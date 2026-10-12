<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\StoreVendorRequest;
use App\Http\Requests\Vendor\UpdateVendorRequest;
use App\Http\Resources\VendorResource;
use App\Models\Vendor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class VendorController extends Controller
{
    public function show(Request $request): VendorResource
    {
        abort_unless($request->user()?->isVendor(), 403, 'Vendor account required.');
        $vendor = $request->user()->vendor()->withCount('products')->firstOrFail();

        return new VendorResource($vendor);
    }

    public function store(StoreVendorRequest $request): JsonResponse
    {
        if ($request->user()->vendor()->exists()) {
            return response()->json(['message' => 'Vendor store already exists.'], 409);
        }

        $validated = $request->validated();
        $vendor = $request->user()->vendor()->create([
            ...$validated,
            'store_slug' => $this->uniqueSlug($validated['store_name']),
        ]);

        return response()->json([
            'message' => 'Store created successfully.',
            'vendor' => new VendorResource($vendor),
        ], 201);
    }

    public function update(UpdateVendorRequest $request): VendorResource
    {
        $vendor = $request->user()->vendor()->firstOrFail();
        $validated = $request->validated();

        if (isset($validated['store_name']) && $validated['store_name'] !== $vendor->store_name) {
            $validated['store_slug'] = $this->uniqueSlug($validated['store_name'], $vendor->id);
        }

        $vendor->update($validated);

        return new VendorResource($vendor->refresh()->loadCount('products'));
    }

    private function uniqueSlug(string $name, ?int $exceptId = null): string
    {
        $base = Str::slug($name) ?: 'store';
        $slug = $base;
        $suffix = 2;

        while (Vendor::where('store_slug', $slug)->when($exceptId, fn ($query) => $query->whereKeyNot($exceptId))->exists()) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }
}
