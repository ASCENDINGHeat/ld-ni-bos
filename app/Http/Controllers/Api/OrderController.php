<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CheckoutRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * List all orders for the authenticated user (latest first).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $orders = $request->user()
            ->orders()
            ->with('items')
            ->latest()
            ->paginate(10);

        return OrderResource::collection($orders);
    }

    /**
     * Show a single order (must belong to the authenticated user).
     */
    public function show(Request $request, int $id): OrderResource|JsonResponse
    {
        $order = $request->user()
            ->orders()
            ->with('items')
            ->find($id);

        if (! $order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        return new OrderResource($order);
    }

    /**
     * Checkout: convert cart items into a new order atomically.
     */
    public function checkout(Request $request): JsonResponse
    {
        $request->validate((new CheckoutRequest)->rules());

        $user = $request->user();
        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Your cart is empty.'], 422);
        }

        // Validate stock for every cart item before committing
        foreach ($cartItems as $item) {
            if (! $item->product || ! $item->product->is_active) {
                return response()->json([
                    'message' => "Product \"{$item->product?->name}\" is no longer available.",
                ], 422);
            }

            if ($item->product->stock < $item->quantity) {
                return response()->json([
                    'message' => "Insufficient stock for \"{$item->product->name}\". "
                               ."Available: {$item->product->stock}, requested: {$item->quantity}.",
                ], 422);
            }
        }

        $order = DB::transaction(function () use ($user, $cartItems, $request) {
            $totalAmount = $cartItems->sum(fn ($i) => $i->product->price * $i->quantity);

            // Create the order
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
                'status' => 'paid',
                'shipping_address' => $request->shipping_address,
                'shipping_phone' => $request->shipping_phone,
                'payment_method' => $request->payment_method,
                'notes' => $request->notes,
            ]);

            // Snapshot each cart item into order_items and decrement stock
            foreach ($cartItems as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'unit_price' => $item->product->price,
                    'quantity' => $item->quantity,
                    'subtotal' => $item->product->price * $item->quantity,
                ]);

                $item->product->decrement('stock', $item->quantity);
            }

            // Clear the cart
            $user->cartItems()->delete();

            return $order;
        });

        return response()->json([
            'message' => 'Order placed successfully.',
            'order' => new OrderResource($order->load('items')),
        ], 201);
    }

    /**
     * Cancel an order (only if status is pending or paid).
     */
    public function cancel(Request $request, int $id): JsonResponse
    {
        $order = $request->user()->orders()->with('items')->find($id);

        if (! $order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        if (! $order->isCancellable()) {
            return response()->json([
                'message' => "Order cannot be cancelled (current status: {$order->status}).",
            ], 422);
        }

        DB::transaction(function () use ($order) {
            // Restore stock for each item
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->increment('stock', $item->quantity);
                }
            }

            $order->update(['status' => 'cancelled']);
            $order->items()->update(['status' => 'cancelled']);
        });

        return response()->json([
            'message' => 'Order cancelled successfully.',
            'order' => new OrderResource($order->refresh()->load('items')),
        ]);
    }
}
