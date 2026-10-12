<?php

namespace Tests\Feature\Api;

use App\Models\Product;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CheckoutControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_checkout_creates_order_items_and_reduces_stock(): void
    {
        $customer = User::factory()->create();
        $vendor = Vendor::factory()->create();
        $product = Product::factory()->for($vendor)->create(['price' => 250000, 'stock' => 5]);
        Sanctum::actingAs($customer);

        $response = $this->postJson('/api/checkout', $this->payload($product->id, 2));

        $response->assertCreated()
            ->assertJsonPath('order.total', 520000)
            ->assertJsonPath('order.items.0.vendor_id', $vendor->id);
        $this->assertDatabaseHas('order_items', ['product_id' => $product->id, 'quantity' => 2]);
        $this->assertDatabaseHas('products', ['id' => $product->id, 'stock' => 3]);
    }

    public function test_checkout_rejects_quantity_above_stock_without_creating_order(): void
    {
        $customer = User::factory()->create();
        $product = Product::factory()->create(['stock' => 1]);
        Sanctum::actingAs($customer);

        $this->postJson('/api/checkout', $this->payload($product->id, 2))->assertUnprocessable();

        $this->assertDatabaseCount('orders', 0);
        $this->assertDatabaseHas('products', ['id' => $product->id, 'stock' => 1]);
    }

    private function payload(int $productId, int $quantity): array
    {
        return [
            'items' => [['product_id' => $productId, 'quantity' => $quantity]],
            'payment_method' => 'bank-transfer',
            'shipping_method' => 'regular',
            'recipient_name' => 'Customer Test',
            'recipient_phone' => '08123456789',
            'shipping_address' => 'Jalan Test 1',
        ];
    }
}
