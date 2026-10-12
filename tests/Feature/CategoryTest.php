<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_all_active_categories(): void
    {
        Category::factory()->count(3)->create(['is_active' => true]);
        Category::factory()->inactive()->create();

        $response = $this->getJson('/api/categories');

        $response->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'type', 'description', 'icon', 'is_active', 'products_count'],
                ],
            ]);
    }

    public function test_can_filter_categories_by_type(): void
    {
        Category::factory()->prebuilt()->create(['name' => 'PC Prebuilt']);
        Category::factory()->part()->count(2)->create();

        $responsePrebuilt = $this->getJson('/api/categories?type=prebuilt');
        $responsePrebuilt->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.type', 'prebuilt');

        $responseParts = $this->getJson('/api/categories?type=part');
        $responseParts->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_can_view_single_category_by_slug(): void
    {
        $category = Category::factory()->create([
            'name' => 'Motherboard',
            'slug' => 'motherboard',
        ]);

        Product::factory()->count(2)->create(['category_id' => $category->id]);

        $response = $this->getJson('/api/categories/motherboard');

        $response->assertOk()
            ->assertJsonPath('data.slug', 'motherboard')
            ->assertJsonPath('data.products_count', 2);
    }
}
