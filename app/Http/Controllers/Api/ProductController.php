<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\ProductIndexRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    /**
     * Display a paginated listing of products.
     */
    public function index(ProductIndexRequest $request): AnonymousResourceCollection
    {
        $validated = $request->validated();

        $query = Product::active()->with(['category', 'vendor']);

        // Filter by search query
        if (! empty($validated['search'])) {
            $query->search($validated['search']);
        }

        // Filter by category slug or ID
        if (! empty($validated['category'])) {
            $query->category($validated['category']);
        }

        // Filter by product type ('prebuilt' or 'part')
        if (! empty($validated['type'])) {
            $query->ofType($validated['type']);
        }

        // Filter by brand
        if (! empty($validated['brand'])) {
            $query->where('brand', $validated['brand']);
        }

        // Filter by price range
        if (isset($validated['min_price'])) {
            $query->where('price', '>=', $validated['min_price']);
        }

        if (isset($validated['max_price'])) {
            $query->where('price', '<=', $validated['max_price']);
        }

        // Filter by in-stock availability
        if (isset($validated['in_stock']) && filter_var($validated['in_stock'], FILTER_VALIDATE_BOOLEAN)) {
            $query->inStock();
        }

        // Apply sorting
        match ($validated['sort'] ?? 'latest') {
            'oldest' => $query->orderBy('created_at', 'asc'),
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'name_asc' => $query->orderBy('name', 'asc'),
            'name_desc' => $query->orderBy('name', 'desc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $perPage = (int) ($validated['per_page'] ?? 12);
        $products = $query->paginate($perPage)->withQueryString();

        return ProductResource::collection($products);
    }

    /**
     * Display the specified product detail with full specifications, stock, and price.
     */
    public function show(string $slug): ProductResource
    {
        $product = Product::active()
            ->with(['category', 'vendor'])
            ->where(function ($q) use ($slug): void {
                $q->where('slug', $slug)
                    ->orWhere('id', $slug);
            })
            ->firstOrFail();

        return new ProductResource($product);
    }

    /**
     * Get related products based on category or type.
     */
    public function related(string $slug): AnonymousResourceCollection
    {
        $product = Product::active()
            ->where(function ($q) use ($slug): void {
                $q->where('slug', $slug)
                    ->orWhere('id', $slug);
            })
            ->firstOrFail();

        $related = Product::active()
            ->with('category')
            ->where('id', '!=', $product->id)
            ->where(function ($query) use ($product): void {
                $query->where('category_id', $product->category_id)
                    ->orWhere('type', $product->type);
            })
            ->inRandomOrder()
            ->limit(4)
            ->get();

        return ProductResource::collection($related);
    }
}
