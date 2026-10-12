<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'category_id',
    'name',
    'slug',
    'type',
    'brand',
    'price',
    'stock',
    'description',
    'specifications',
    'image_url',
    'images',
    'is_active',
    'weight_grams',
])]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'stock' => 'integer',
            'specifications' => 'array',
            'images' => 'array',
            'is_active' => 'boolean',
            'weight_grams' => 'integer',
        ];
    }

    /**
     * Category relation.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Cart items relation.
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Wishlists relation.
     */
    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    /**
     * Determine if this product is a pre-built PC.
     */
    public function isPrebuilt(): bool
    {
        return $this->type === 'prebuilt';
    }

    /**
     * Determine if this product is a PC component/part.
     */
    public function isPart(): bool
    {
        return $this->type === 'part';
    }

    /**
     * Determine if the product is in stock.
     */
    public function isInStock(): bool
    {
        return $this->stock > 0;
    }

    /**
     * Scope to active products.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to in-stock products.
     */
    public function scopeInStock(Builder $query): Builder
    {
        return $query->where('stock', '>', 0);
    }

    /**
     * Scope by product type ('prebuilt' or 'part').
     */
    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    /**
     * Scope by prebuilt PC products.
     */
    public function scopePrebuilt(Builder $query): Builder
    {
        return $query->where('type', 'prebuilt');
    }

    /**
     * Scope by PC component/part products.
     */
    public function scopePart(Builder $query): Builder
    {
        return $query->where('type', 'part');
    }

    /**
     * Scope search query by term across name, brand, or description.
     */
    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (blank($term)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term): void {
            $q->where('name', 'like', "%{$term}%")
                ->orWhere('brand', 'like', "%{$term}%")
                ->orWhere('description', 'like', "%{$term}%");
        });
    }

    /**
     * Scope filter by category ID or slug.
     */
    public function scopeCategory(Builder $query, string|int|null $category): Builder
    {
        if (blank($category)) {
            return $query;
        }

        if (is_numeric($category)) {
            return $query->where('category_id', (int) $category);
        }

        return $query->whereHas('category', function (Builder $q) use ($category): void {
            $q->where('slug', $category);
        });
    }
}
