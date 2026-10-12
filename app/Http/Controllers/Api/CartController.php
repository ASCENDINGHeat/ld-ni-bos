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
use Illuminate\Support\Facades\DB;

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
     * Resolve a product model by numeric ID, slug, or mock code.
     */
    protected function resolveProduct(int|string|null $identifier): ?Product
    {
        if (blank($identifier)) {
            return null;
        }

        if (is_numeric($identifier)) {
            $product = Product::active()->find((int) $identifier);
            if ($product) {
                return $product;
            }
        }

        $stringId = (string) $identifier;

        // Try exact slug
        $product = Product::active()->where('slug', $stringId)->first();
        if ($product) {
            return $product;
        }

        // Map mock codes to slugs
        $mockMap = [
            'cpu-1' => 'intel-core-i9-14900k',
            'cpu-2' => 'intel-core-i7-14700k',
            'cpu-3' => 'intel-core-i5-14600k',
            'cpu-4' => 'amd-ryzen-7-7800x3d',
            'cpu-5' => 'amd-ryzen-5-7600x',
            'cpu-6' => 'amd-ryzen-7-5700x',
            'mb-1' => 'msi-mag-b650-tomahawk-wifi',
            'mb-2' => 'gigabyte-b760m-aorus-elite-ax',
            'mb-3' => 'asus-tuf-gaming-b550-plus',
            'vga-1' => 'asus-dual-rtx-4070-super-oc-12gb',
            'vga-2' => 'msi-rtx-4060-ti-ventus-2x-8g-oc',
            'vga-3' => 'gigabyte-rx-7800-xt-gaming-oc-16gb',
            'vga-4' => 'asus-rog-strix-rtx-4080-super-16gb-oc',
            'ram-1' => 'corsair-vengeance-rgb-32gb-ddr5-6000mhz',
            'ram-2' => 'kingston-fury-beast-32gb-ddr5-5600mhz',
            'ram-3' => 'corsair-vengeance-lpx-16gb-ddr4-3200mhz',
            'ssd-1' => 'samsung-990-pro-nvme-2tb',
            'ssd-2' => 'kingston-kc3000-pcie-4-nvme-1tb',
            'psu-1' => 'corsair-rm850e-850w-gold-atx-3',
            'psu-2' => 'msi-mag-a750gl-750w-gold',
            'psu-3' => 'asus-tuf-gaming-650b-650w-bronze',
            'casing-1' => 'nzxt-h5-flow-black',
            'casing-2' => 'corsair-4000d-airflow-white',
            'casing-3' => 'montech-air-903-base-black',
        ];

        if (isset($mockMap[$stringId])) {
            $mappedProduct = Product::active()->where('slug', $mockMap[$stringId])->first();
            if ($mappedProduct) {
                return $mappedProduct;
            }
        }

        return Product::active()->where('slug', 'like', "%{$stringId}%")->first();
    }

    /**
     * Add single or multiple items to the shopping cart.
     */
    public function store(StoreCartItemRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        // 1. Bulk / Multiple items addition
        if (! empty($validated['items']) && is_array($validated['items'])) {
            return DB::transaction(function () use ($user, $validated): JsonResponse {
                $prepared = [];

                foreach ($validated['items'] as $itemData) {
                    $rawId = $itemData['product_id'] ?? $itemData['id'] ?? null;
                    $quantity = max(1, (int) ($itemData['quantity'] ?? 1));

                    $product = $this->resolveProduct($rawId);
                    if (! $product) {
                        return response()->json([
                            'message' => "Produk tidak ditemukan atau tidak aktif: {$rawId}",
                        ], 422);
                    }

                    if ($product->stock < 1) {
                        return response()->json([
                            'message' => "Produk '{$product->name}' sedang habis (stok 0)",
                        ], 422);
                    }

                    $cartItem = CartItem::where('user_id', $user->id)
                        ->where('product_id', $product->id)
                        ->first();

                    $targetQuantity = $cartItem ? ($cartItem->quantity + $quantity) : $quantity;

                    if ($targetQuantity > $product->stock) {
                        return response()->json([
                            'message' => "Stok produk '{$product->name}' tidak mencukupi. Tersedia: {$product->stock}, Diminta total: {$targetQuantity}",
                        ], 422);
                    }

                    $prepared[] = [
                        'product' => $product,
                        'cartItem' => $cartItem,
                        'targetQuantity' => $targetQuantity,
                    ];
                }

                $addedCount = 0;
                foreach ($prepared as $entry) {
                    if ($entry['cartItem']) {
                        $entry['cartItem']->quantity = $entry['targetQuantity'];
                        $entry['cartItem']->save();
                    } else {
                        CartItem::create([
                            'user_id' => $user->id,
                            'product_id' => $entry['product']->id,
                            'quantity' => $entry['targetQuantity'],
                        ]);
                    }
                    $addedCount++;
                }

                $cartItems = $user->cartItems()
                    ->with(['product' => fn ($q) => $q->with('category')])
                    ->get();

                $totalPrice = $cartItems->sum(function (CartItem $item): float {
                    return (float) (($item->product?->price ?? 0) * $item->quantity);
                });

                return response()->json([
                    'message' => "{$addedCount} produk berhasil dimasukkan ke keranjang",
                    'items' => CartItemResource::collection($cartItems),
                    'summary' => [
                        'total_unique_items' => $cartItems->count(),
                        'total_quantity' => $cartItems->sum('quantity'),
                        'total_price' => $totalPrice,
                        'formatted_total_price' => 'Rp '.number_format($totalPrice, 0, ',', '.'),
                    ],
                ], 201);
            });
        }

        // 2. Single item addition
        $rawId = $validated['product_id'] ?? null;
        $quantity = (int) ($validated['quantity'] ?? 1);

        $product = $this->resolveProduct($rawId);

        if (! $product) {
            return response()->json([
                'message' => 'Product not found',
            ], 422);
        }

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
     * Add multiple items to the cart in bulk.
     */
    public function storeBulk(StoreCartItemRequest $request): JsonResponse
    {
        return $this->store($request);
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
