<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class WishlistTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_wishlist(): void
    {
        $response = $this->getJson('/api/wishlist');

        $response->assertUnauthorized();
    }

    public function test_user_can_view_their_wishlist(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $product1 = Product::factory()->create();
        $product2 = Product::factory()->create();

        Wishlist::factory()->create(['user_id' => $user->id, 'product_id' => $product1->id]);
        Wishlist::factory()->create(['user_id' => $otherUser->id, 'product_id' => $product2->id]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/wishlist');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.product_id', $product1->id);
    }

    public function test_user_can_add_product_to_wishlist(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/wishlist', [
            'product_id' => $product->id,
        ]);

        $response->assertCreated()
            ->assertJsonPath('message', 'Product added to wishlist successfully')
            ->assertJsonPath('wishlist.product_id', $product->id);

        $this->assertDatabaseHas('wishlists', [
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);
    }

    public function test_adding_duplicate_product_to_wishlist_is_handled(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        Wishlist::factory()->create(['user_id' => $user->id, 'product_id' => $product->id]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/wishlist', [
            'product_id' => $product->id,
        ]);

        $response->assertOk()
            ->assertJsonPath('message', 'Product is already in your wishlist');

        $this->assertDatabaseCount('wishlists', 1);
    }

    public function test_user_can_remove_product_from_wishlist(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        Wishlist::factory()->create(['user_id' => $user->id, 'product_id' => $product->id]);

        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/wishlist/{$product->id}");

        $response->assertOk()
            ->assertJsonPath('message', 'Product removed from wishlist successfully');

        $this->assertDatabaseMissing('wishlists', [
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);
    }

    public function test_user_can_toggle_wishlist(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        Sanctum::actingAs($user);

        // First toggle: Add to wishlist
        $response1 = $this->postJson('/api/wishlist/toggle', [
            'product_id' => $product->id,
        ]);

        $response1->assertCreated()
            ->assertJsonPath('wishlisted', true);

        $this->assertDatabaseHas('wishlists', [
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);

        // Second toggle: Remove from wishlist
        $response2 = $this->postJson('/api/wishlist/toggle', [
            'product_id' => $product->id,
        ]);

        $response2->assertOk()
            ->assertJsonPath('wishlisted', false);

        $this->assertDatabaseMissing('wishlists', [
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);
    }
}
