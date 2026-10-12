<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_products_with_pagination(): void
    {
        Product::factory()->count(15)->create(['is_active' => true]);

        $response = $this->getJson('/api/products?per_page=10');

        $response->assertOk()
            ->assertJsonCount(10, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'type',
                        'brand',
                        'price',
                        'formatted_price',
                        'stock',
                        'is_in_stock',
                        'specifications',
                        'category',
                    ],
                ],
                'links',
                'meta',
            ]);
    }

    public function test_can_filter_products_by_prebuilt_pc_type(): void
    {
        Product::factory()->prebuilt()->create(['name' => 'PC Gaming Ultra']);
        Product::factory()->part()->count(3)->create();

        $response = $this->getJson('/api/products?type=prebuilt');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.type', 'prebuilt')
            ->assertJsonPath('data.0.name', 'PC Gaming Ultra');
    }

    public function test_can_filter_products_by_part_type(): void
    {
        Product::factory()->prebuilt()->create();
        Product::factory()->part()->count(2)->create();

        $response = $this->getJson('/api/products?type=part');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_can_filter_products_by_category(): void
    {
        $categoryGpu = Category::factory()->create(['name' => 'GPU', 'slug' => 'gpu']);
        $categoryCpu = Category::factory()->create(['name' => 'CPU', 'slug' => 'cpu']);

        Product::factory()->create(['category_id' => $categoryGpu->id, 'name' => 'RTX 4070']);
        Product::factory()->create(['category_id' => $categoryCpu->id, 'name' => 'Intel i7']);

        $response = $this->getJson('/api/products?category=gpu');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'RTX 4070');
    }

    public function test_can_search_products_by_name_or_brand(): void
    {
        Product::factory()->create(['name' => 'Corsair Vengeance DDR5', 'brand' => 'Corsair']);
        Product::factory()->create(['name' => 'Samsung 990 Pro SSD', 'brand' => 'Samsung']);

        $response = $this->getJson('/api/products?search=Corsair');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Corsair Vengeance DDR5');
    }

    public function test_can_filter_products_by_price_range(): void
    {
        Product::factory()->create(['price' => 1000000]);
        Product::factory()->create(['price' => 5000000]);
        Product::factory()->create(['price' => 15000000]);

        $response = $this->getJson('/api/products?min_price=2000000&max_price=8000000');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.price', 5000000);
    }

    public function test_can_filter_products_by_in_stock_only(): void
    {
        Product::factory()->create(['stock' => 5]);
        Product::factory()->outOfStock()->create();

        $response = $this->getJson('/api/products?in_stock=true');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.is_in_stock', true);
    }

    public function test_can_view_product_detail_with_specifications_stock_and_price_for_prebuilt_pc(): void
    {
        $category = Category::factory()->prebuilt()->create([
            'name' => 'PC Siap Pakai',
            'slug' => 'pc-siap-pakai',
        ]);

        $prebuilt = Product::factory()->prebuilt()->create([
            'category_id' => $category->id,
            'name' => 'PC Gaming Sultan RTX 4080',
            'slug' => 'pc-gaming-sultan-rtx-4080',
            'price' => 45000000,
            'stock' => 3,
            'specifications' => [
                'processor' => 'Intel Core i9-14900K',
                'kartu_grafis' => 'NVIDIA RTX 4080 Super 16GB',
                'ram' => '64GB DDR5 6000MHz',
                'storage' => '2TB NVMe Gen4 SSD',
                'power_supply' => '1000W 80+ Gold',
                'casing' => 'Lian Li O11 Dynamic EVO',
            ],
        ]);

        $response = $this->getJson("/api/products/{$prebuilt->slug}");

        $response->assertOk()
            ->assertJsonPath('data.name', 'PC Gaming Sultan RTX 4080')
            ->assertJsonPath('data.type', 'prebuilt')
            ->assertJsonPath('data.price', 45000000)
            ->assertJsonPath('data.formatted_price', 'Rp 45.000.000')
            ->assertJsonPath('data.stock', 3)
            ->assertJsonPath('data.is_in_stock', true)
            ->assertJsonPath('data.specifications.processor', 'Intel Core i9-14900K')
            ->assertJsonPath('data.specifications.kartu_grafis', 'NVIDIA RTX 4080 Super 16GB')
            ->assertJsonPath('data.category.slug', 'pc-siap-pakai');
    }

    public function test_can_view_product_detail_with_specifications_stock_and_price_for_pc_part(): void
    {
        $category = Category::factory()->part()->create([
            'name' => 'Processor',
            'slug' => 'processor',
        ]);

        $part = Product::factory()->part()->create([
            'category_id' => $category->id,
            'name' => 'AMD Ryzen 7 7800X3D',
            'slug' => 'amd-ryzen-7-7800x3d',
            'price' => 6850000,
            'stock' => 15,
            'specifications' => [
                'socket' => 'AM5',
                'jumlah_core' => 8,
                'l3_cache' => '96MB 3D V-Cache',
                'tdp' => '120W',
            ],
        ]);

        $response = $this->getJson("/api/products/{$part->slug}");

        $response->assertOk()
            ->assertJsonPath('data.name', 'AMD Ryzen 7 7800X3D')
            ->assertJsonPath('data.type', 'part')
            ->assertJsonPath('data.price', 6850000)
            ->assertJsonPath('data.formatted_price', 'Rp 6.850.000')
            ->assertJsonPath('data.stock', 15)
            ->assertJsonPath('data.is_in_stock', true)
            ->assertJsonPath('data.specifications.socket', 'AM5')
            ->assertJsonPath('data.specifications.l3_cache', '96MB 3D V-Cache');
    }

    public function test_can_get_related_products(): void
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);
        Product::factory()->count(3)->create(['category_id' => $category->id]);

        $response = $this->getJson("/api/products/{$product->slug}/related");

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_product_detail_includes_is_wishlisted_flag_for_authenticated_user(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        Wishlist::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson("/api/products/{$product->slug}");

        $response->assertOk()
            ->assertJsonPath('data.is_wishlisted', true);
    }
}
