<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Wishlist\StoreWishlistRequest;
use App\Http\Resources\WishlistResource;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class WishlistController extends Controller
{
    /**
     * Display a listing of the user's wishlisted products.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $wishlists = $user->wishlists()
            ->with(['product' => fn ($q) => $q->with('category')])
            ->latest()
            ->paginate(15);

        return WishlistResource::collection($wishlists);
    }

    /**
     * Store a product in the user's wishlist.
     */
    public function store(StoreWishlistRequest $request): JsonResponse
    {
        $user = $request->user();
        $productId = (int) $request->validated('product_id');

        $product = Product::active()->findOrFail($productId);

        $wishlist = Wishlist::firstOrCreate([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);

        $wishlist->load(['product.category']);

        $wasRecentlyCreated = $wishlist->wasRecentlyCreated;

        return response()->json([
            'message' => $wasRecentlyCreated
                ? 'Product added to wishlist successfully'
                : 'Product is already in your wishlist',
            'wishlist' => new WishlistResource($wishlist),
        ], $wasRecentlyCreated ? 201 : 200);
    }

    /**
     * Remove the specified product from the user's wishlist.
     */
    public function destroy(Request $request, int $productId): JsonResponse
    {
        $user = $request->user();

        $deleted = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->delete();

        if (! $deleted) {
            return response()->json([
                'message' => 'Product not found in wishlist',
            ], 404);
        }

        return response()->json([
            'message' => 'Product removed from wishlist successfully',
        ]);
    }

    /**
     * Toggle a product's presence in the user's wishlist.
     */
    public function toggle(StoreWishlistRequest $request): JsonResponse
    {
        $user = $request->user();
        $productId = (int) $request->validated('product_id');

        $product = Product::active()->findOrFail($productId);

        $existing = Wishlist::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            $existing->delete();

            return response()->json([
                'message' => 'Product removed from wishlist',
                'wishlisted' => false,
            ]);
        }

        $wishlist = Wishlist::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);

        $wishlist->load(['product.category']);

        return response()->json([
            'message' => 'Product added to wishlist',
            'wishlisted' => true,
            'wishlist' => new WishlistResource($wishlist),
        ], 201);
    }
}
