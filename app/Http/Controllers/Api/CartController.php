<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\StoreCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Http\Resources\CartItemResource;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Display a summary and listing of the user's shopping cart items.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $cartItems = $user->cartItems()
            ->with(['product' => fn ($q) => $q->with('category')])
            ->get();

        $totalPrice = $cartItems->sum(function (CartItem $item): float {
            return (float) (($item->product?->price ?? 0) * $item->quantity);
        });

        $totalQuantity = $cartItems->sum('quantity');

        return response()->json([
            'items' => CartItemResource::collection($cartItems),
            'summary' => [
                'total_unique_items' => $cartItems->count(),
                'total_quantity' => $totalQuantity,
                'total_price' => $totalPrice,
                'formatted_total_price' => 'Rp '.number_format($totalPrice, 0, ',', '.'),
            ],
        ]);
    }

    /**
     * Add an item to the shopping cart or increment quantity if already present.
     */
    public function store(StoreCartItemRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();
        $productId = (int) $validated['product_id'];
        $quantity = (int) ($validated['quantity'] ?? 1);

        $product = Product::active()->findOrFail($productId);

        if ($product->stock < 1) {
            return response()->json([
                'message' => 'Product is currently out of stock',
            ], 422);
        }

        $cartItem = CartItem::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        $targetQuantity = $cartItem ? ($cartItem->quantity + $quantity) : $quantity;

        if ($targetQuantity > $product->stock) {
            return response()->json([
                'message' => "Insufficient stock. Available: {$product->stock}, Requested total: {$targetQuantity}",
            ], 422);
        }

        if ($cartItem) {
            $cartItem->quantity = $targetQuantity;
            $cartItem->save();
        } else {
            $cartItem = CartItem::create([
                'user_id' => $user->id,
                'product_id' => $product->id,
                'quantity' => $targetQuantity,
            ]);
        }

        $cartItem->load(['product.category']);

        return response()->json([
            'message' => 'Item added to cart successfully',
            'cart_item' => new CartItemResource($cartItem),
        ], 201);
    }

    /**
     * Update the quantity of a specific cart item.
     */
    public function update(UpdateCartItemRequest $request, int|string $cartItemId): JsonResponse
    {
        $user = $request->user();
        $newQuantity = (int) $request->validated('quantity');

        $cartItem = CartItem::where('user_id', $user->id)
            ->where('id', $cartItemId)
            ->firstOrFail();

        $product = $cartItem->product;

        if ($newQuantity > $product->stock) {
            return response()->json([
                'message' => "Insufficient stock. Available: {$product->stock}, Requested: {$newQuantity}",
            ], 422);
        }

        $cartItem->quantity = $newQuantity;
        $cartItem->save();
        $cartItem->load(['product.category']);

        return response()->json([
            'message' => 'Cart item updated successfully',
            'cart_item' => new CartItemResource($cartItem),
        ]);
    }

    /**
     * Remove an item from the shopping cart.
     */
    public function destroy(Request $request, int|string $cartItemId): JsonResponse
    {
        $user = $request->user();

        $deleted = CartItem::where('user_id', $user->id)
            ->where('id', $cartItemId)
            ->delete();

        if (! $deleted) {
            return response()->json([
                'message' => 'Cart item not found',
            ], 404);
        }

        return response()->json([
            'message' => 'Item removed from cart successfully',
        ]);
    }

    /**
     * Empty all items in the user's shopping cart.
     */
    public function clear(Request $request): JsonResponse
    {
        $user = $request->user();

        CartItem::where('user_id', $user->id)->delete();

        return response()->json([
            'message' => 'Cart cleared successfully',
        ]);
    }
}
