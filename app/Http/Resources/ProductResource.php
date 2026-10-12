<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Product
 */
class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();

        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'vendor_id' => $this->vendor_id,
            'sku' => $this->sku,
            'name' => $this->name,
            'slug' => $this->slug,
            'type' => $this->type,
            'brand' => $this->brand,
            'price' => (float) $this->price,
            'formatted_price' => 'Rp '.number_format((float) $this->price, 0, ',', '.'),
            'stock' => (int) $this->stock,
            'is_in_stock' => $this->isInStock(),
            'description' => $this->description,
            'specifications' => $this->specifications ?? [],
            'image_url' => $this->image_url,
            'images' => $this->images ?? [],
            'is_active' => (bool) $this->is_active,
            'weight_grams' => (int) $this->weight_grams,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'vendor' => new VendorResource($this->whenLoaded('vendor')),
            'is_wishlisted' => $user ? $this->relationLoaded('wishlists')
                ? $this->wishlists->contains('user_id', $user->id)
                : $this->wishlists()->where('user_id', $user->id)->exists()
                : false,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
