<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VendorProductControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_vendor_can_create_update_and_delete_own_product(): void
    {
        $user = User::factory()->vendor()->create();
        $vendor = Vendor::factory()->for($user)->create();
        $category = Category::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/vendor/products', [
            'category_id' => $category->id,
            'name' => 'Ryzen Test CPU',
            'sku' => 'CPU-001',
            'brand' => 'AMD',
            'price' => 4500000,
            'stock' => 8,
        ])->assertCreated()->assertJsonPath('product.vendor_id', $vendor->id);

        $productId = $response->json('product.id');
        $this->patchJson("/api/vendor/products/{$productId}", ['stock' => 3])
            ->assertOk()->assertJsonPath('data.stock', 3);
        $this->deleteJson("/api/vendor/products/{$productId}")->assertOk();
        $this->assertDatabaseMissing('products', ['id' => $productId]);
    }

    public function test_vendor_receives_404_for_another_vendors_product(): void
    {
        $owner = Vendor::factory()->create();
        $otherUser = User::factory()->vendor()->create();
        Vendor::factory()->for($otherUser)->create();
        $product = Product::factory()->for($owner)->create();
        Sanctum::actingAs($otherUser);

        $this->patchJson("/api/vendor/products/{$product->id}", ['stock' => 0])->assertNotFound();

        $this->assertDatabaseHas('products', ['id' => $product->id, 'stock' => $product->stock]);
    }

    public function test_customer_receives_403_when_listing_vendor_products(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->getJson('/api/vendor/products')->assertForbidden();
    }
}
