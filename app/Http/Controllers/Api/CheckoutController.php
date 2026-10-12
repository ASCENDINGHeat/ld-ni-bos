<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checkout\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        if (! $request->has('items')) {
            return app(OrderController::class)->checkout($request);
        }

        $validated = $request->validate((new StoreOrderRequest)->rules());

        $order = DB::transaction(function () use ($request, $validated): Order {
            $requestedItems = collect($validated['items'])->keyBy('product_id');
            $products = Product::query()->active()->whereIn('id', $requestedItems->keys())->lockForUpdate()->get();

            abort_unless($products->count() === $requestedItems->count(), 422, 'One or more products are unavailable.');

            $subtotal = 0.0;
            foreach ($products as $product) {
                $quantity = (int) $requestedItems[$product->id]['quantity'];
                abort_if($quantity > $product->stock, 422, "Insufficient stock for {$product->name}.");
                $subtotal += (float) $product->price * $quantity;
            }

            $shippingCost = match ($validated['shipping_method']) {
                'express' => 35000.0,
                'regular' => $subtotal >= 2000000 ? 0.0 : 20000.0,
                default => 0.0,
            };
            $order = Order::create([
                'order_number' => 'PCS-'.now()->format('Ymd').'-'.Str::upper(Str::random(6)),
                'user_id' => $request->user()->id,
                'status' => 'pending',
                'payment_method' => $validated['payment_method'],
                'shipping_method' => $validated['shipping_method'],
                'recipient_name' => $validated['recipient_name'],
                'recipient_phone' => $validated['recipient_phone'],
                'shipping_address' => $validated['shipping_address'] ?? 'Store pickup',
                'customer_note' => $validated['customer_note'] ?? null,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'total' => $subtotal + $shippingCost,
            ]);

            foreach ($products as $product) {
                $quantity = (int) $requestedItems[$product->id]['quantity'];
                $order->items()->create([
                    'product_id' => $product->id,
                    'vendor_id' => $product->vendor_id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'unit_price' => $product->price,
                    'quantity' => $quantity,
                    'subtotal' => (float) $product->price * $quantity,
                ]);
                $product->decrement('stock', $quantity);
            }

            return $order;
        });

        return response()->json([
            'message' => 'Order created successfully.',
            'order' => new OrderResource($order->load('items')),
        ], 201);
    }
}
