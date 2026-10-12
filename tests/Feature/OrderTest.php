<?php

namespace Tests\Feature;

use App\Models\CartItem;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(['role' => 'customer']);

        $category = Category::factory()->create();
        $this->product = Product::factory()->create([
            'category_id' => $category->id,
            'price'       => 500000,
            'stock'       => 10,
            'is_active'   => true,
        ]);
    }

    private function addToCart(int $quantity = 2): void
    {
        CartItem::create([
            'user_id'    => $this->user->id,
            'product_id' => $this->product->id,
            'quantity'   => $quantity,
        ]);
    }

    private function checkoutPayload(array $overrides = []): array
    {
        return array_merge([
            'shipping_address' => 'Jl. Contoh No. 1, Jakarta',
            'shipping_phone'   => '08123456789',
            'payment_method'   => 'simulated_wallet',
        ], $overrides);
    }

    // ─── Checkout ─────────────────────────────────────────────────────────────

    public function test_guest_cannot_checkout(): void
    {
        $this->postJson('/api/checkout', $this->checkoutPayload())
            ->assertStatus(401);
    }

    public function test_checkout_fails_when_cart_is_empty(): void
    {
        Sanctum::actingAs($this->user);

        $this->postJson('/api/checkout', $this->checkoutPayload())
            ->assertStatus(422)
            ->assertJsonFragment(['message' => 'Your cart is empty.']);
    }

    public function test_checkout_creates_order_and_clears_cart(): void
    {
        Sanctum::actingAs($this->user);
        $this->addToCart(2);

        $response = $this->postJson('/api/checkout', $this->checkoutPayload());

        $response->assertStatus(201)
            ->assertJsonFragment(['message' => 'Order placed successfully.'])
            ->assertJsonPath('order.status', 'paid')
            ->assertJsonCount(1, 'order.items');

        // Cart should be cleared
        $this->assertDatabaseCount('cart_items', 0);

        // Stock should be decremented
        $this->assertEquals(8, $this->product->fresh()->stock);

        // Order and order_item should exist in DB
        $this->assertDatabaseCount('orders', 1);
        $this->assertDatabaseCount('order_items', 1);
    }

    public function test_checkout_fails_if_stock_insufficient(): void
    {
        Sanctum::actingAs($this->user);
        $this->addToCart(20); // more than stock of 10

        $this->postJson('/api/checkout', $this->checkoutPayload())
            ->assertStatus(422)
            ->assertJsonPath('message', fn ($msg) => str_contains($msg, 'Insufficient stock'));
    }

    public function test_checkout_validates_required_fields(): void
    {
        Sanctum::actingAs($this->user);
        $this->addToCart();

        $this->postJson('/api/checkout', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['shipping_address', 'shipping_phone', 'payment_method']);
    }

    // ─── List / Show ──────────────────────────────────────────────────────────

    public function test_user_can_list_their_orders(): void
    {
        Sanctum::actingAs($this->user);
        $this->addToCart();
        $this->postJson('/api/checkout', $this->checkoutPayload());

        $this->getJson('/api/orders')
            ->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_user_can_view_single_order(): void
    {
        Sanctum::actingAs($this->user);
        $this->addToCart();
        $checkoutResponse = $this->postJson('/api/checkout', $this->checkoutPayload());
        $orderId = $checkoutResponse->json('order.id');

        $this->getJson("/api/orders/{$orderId}")
            ->assertStatus(200)
            ->assertJsonPath('data.id', $orderId);
    }

    public function test_user_cannot_view_another_users_order(): void
    {
        Sanctum::actingAs($this->user);
        $this->addToCart();
        $checkoutResponse = $this->postJson('/api/checkout', $this->checkoutPayload());
        $orderId = $checkoutResponse->json('order.id');

        // Switch authenticated user to other user
        $otherUser = User::factory()->create();
        Sanctum::actingAs($otherUser);

        $this->getJson("/api/orders/{$orderId}")
            ->assertStatus(404);
    }

    // ─── Cancel ───────────────────────────────────────────────────────────────

    public function test_user_can_cancel_a_paid_order(): void
    {
        Sanctum::actingAs($this->user);
        $this->addToCart(2);
        $checkoutResponse = $this->postJson('/api/checkout', $this->checkoutPayload());
        $orderId = $checkoutResponse->json('order.id');

        $this->patchJson("/api/orders/{$orderId}/cancel")
            ->assertStatus(200)
            ->assertJsonPath('order.status', 'cancelled');

        // Stock should be restored
        $this->assertEquals(10, $this->product->fresh()->stock);
    }

    public function test_user_cannot_cancel_a_shipped_order(): void
    {
        Sanctum::actingAs($this->user);
        $this->addToCart();
        $checkoutResponse = $this->postJson('/api/checkout', $this->checkoutPayload());
        $orderId = $checkoutResponse->json('order.id');

        Order::find($orderId)->update(['status' => 'shipped']);

        $this->patchJson("/api/orders/{$orderId}/cancel")
            ->assertStatus(422);
    }
}
