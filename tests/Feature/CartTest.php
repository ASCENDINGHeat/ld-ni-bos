<?php

namespace Tests\Feature;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_cart(): void
    {
        $response = $this->getJson('/api/cart');

        $response->assertUnauthorized();
    }

    public function test_user_can_view_cart_with_subtotal_and_total_calculations(): void
    {
        $user = User::factory()->create();
        $product1 = Product::factory()->create(['price' => 1000000, 'stock' => 10]);
        $product2 = Product::factory()->create(['price' => 2500000, 'stock' => 10]);

        CartItem::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product1->id,
            'quantity' => 2, // 2,000,000
        ]);

        CartItem::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product2->id,
            'quantity' => 1, // 2,500,000
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/cart');

        $response->assertOk()
            ->assertJsonPath('summary.total_unique_items', 2)
            ->assertJsonPath('summary.total_quantity', 3)
            ->assertJsonPath('summary.total_price', 4500000)
            ->assertJsonPath('summary.formatted_total_price', 'Rp 4.500.000')
            ->assertJsonCount(2, 'items');
    }

    public function test_user_can_add_item_to_cart(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 5]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/cart', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response->assertCreated()
            ->assertJsonPath('message', 'Item added to cart successfully')
            ->assertJsonPath('cart_item.quantity', 2);

        $this->assertDatabaseHas('cart_items', [
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);
    }

    public function test_adding_same_item_increments_quantity(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10]);

        CartItem::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/cart', [
            'product_id' => $product->id,
            'quantity' => 3,
        ]);

        $response->assertCreated()
            ->assertJsonPath('cart_item.quantity', 5);

        $this->assertDatabaseHas('cart_items', [
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 5,
        ]);
    }

    public function test_cannot_add_item_exceeding_stock(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 3]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/cart', [
            'product_id' => $product->id,
            'quantity' => 4,
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('message', 'Insufficient stock. Available: 3, Requested total: 4');
    }

    public function test_user_can_update_cart_item_quantity(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10]);

        $cartItem = CartItem::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        Sanctum::actingAs($user);

        $response = $this->patchJson("/api/cart/{$cartItem->id}", [
            'quantity' => 4,
        ]);

        $response->assertOk()
            ->assertJsonPath('cart_item.quantity', 4);

        $this->assertDatabaseHas('cart_items', [
            'id' => $cartItem->id,
            'quantity' => 4,
        ]);
    }

    public function test_cannot_update_cart_item_quantity_exceeding_stock(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 3]);

        $cartItem = CartItem::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        Sanctum::actingAs($user);

        $response = $this->patchJson("/api/cart/{$cartItem->id}", [
            'quantity' => 5,
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('message', 'Insufficient stock. Available: 3, Requested: 5');
    }

    public function test_user_can_delete_cart_item(): void
    {
        $user = User::factory()->create();
        $cartItem = CartItem::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/cart/{$cartItem->id}");

        $response->assertOk()
            ->assertJsonPath('message', 'Item removed from cart successfully');

        $this->assertDatabaseMissing('cart_items', [
            'id' => $cartItem->id,
        ]);
    }

    public function test_user_can_clear_all_items_in_cart(): void
    {
        $user = User::factory()->create();
        CartItem::factory()->count(3)->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $response = $this->deleteJson('/api/cart');

        $response->assertOk()
            ->assertJsonPath('message', 'Cart cleared successfully');

        $this->assertDatabaseCount('cart_items', 0);
    }
}
