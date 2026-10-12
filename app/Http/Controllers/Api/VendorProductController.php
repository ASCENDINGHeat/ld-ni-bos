<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\StoreVendorProductRequest;
use App\Http\Requests\Vendor\UpdateVendorProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Vendor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

class VendorProductController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $products = $this->vendor($request)->products()
            ->with('category')
            ->latest('id')
            ->paginate(20);

        return ProductResource::collection($products);
    }

    public function store(StoreVendorProductRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['slug'] = $this->uniqueSlug($validated['name']);
        $validated['type'] ??= 'part';
        $validated['is_active'] ??= true;
        $validated['weight_grams'] ??= 0;

        $product = $request->user()->vendor->products()->create($validated);
        $product->load('category');

        return response()->json([
            'message' => 'Product created successfully.',
            'product' => new ProductResource($product),
        ], 201);
    }

    public function update(UpdateVendorProductRequest $request, int $product): ProductResource
    {
        $vendorProduct = $this->ownedProduct($request, $product);
        $validated = $request->validated();

        if (isset($validated['name']) && $validated['name'] !== $vendorProduct->name) {
            $validated['slug'] = $this->uniqueSlug($validated['name'], $vendorProduct->id);
        }

        $vendorProduct->update($validated);

        return new ProductResource($vendorProduct->refresh()->load('category'));
    }

    public function destroy(Request $request, int $product): JsonResponse
    {
        $this->ownedProduct($request, $product)->delete();

        return response()->json(['message' => 'Product deleted successfully.']);
    }

    private function ownedProduct(Request $request, int $product): Product
    {
        return $this->vendor($request)->products()->whereKey($product)->firstOrFail();
    }

    private function vendor(Request $request): Vendor
    {
        abort_unless($request->user()?->isVendor(), 403, 'Vendor account required.');

        return $request->user()->vendor()->firstOrFail();
    }

    private function uniqueSlug(string $name, ?int $exceptId = null): string
    {
        $base = Str::slug($name) ?: 'product';
        $slug = $base;
        $suffix = 2;

        while (Product::where('slug', $slug)->when($exceptId, fn ($query) => $query->whereKeyNot($exceptId))->exists()) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }
}
