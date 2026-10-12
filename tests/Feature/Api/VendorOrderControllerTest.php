<?php

namespace Tests\Feature\Api;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VendorOrderControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_vendor_only_sees_own_items_and_can_update_their_status(): void
    {
        $vendorUser = User::factory()->vendor()->create();
        $vendor = Vendor::factory()->for($vendorUser)->create();
        $otherVendor = Vendor::factory()->create();
        $order = Order::factory()->create();
        $ownProduct = Product::factory()->for($vendor)->create();
        $otherProduct = Product::factory()->for($otherVendor)->create();
        $ownItem = OrderItem::factory()->for($order)->for($ownProduct)->for($vendor)->create(['product_name' => 'Own Product']);
        $otherItem = OrderItem::factory()->for($order)->for($otherProduct)->for($otherVendor)->create(['product_name' => 'Other Product']);
        Sanctum::actingAs($vendorUser);

        $this->getJson('/api/vendor/orders')
            ->assertOk()
            ->assertJsonCount(1, 'data.0.items')
            ->assertJsonPath('data.0.items.0.product_name', 'Own Product');

        $this->patchJson("/api/vendor/orders/{$order->id}/status", ['status' => 'shipped'])
            ->assertOk()
            ->assertJsonPath('data.status', 'shipped');
        $this->assertDatabaseHas('order_items', ['id' => $ownItem->id, 'status' => 'shipped']);
        $this->assertDatabaseHas('order_items', ['id' => $otherItem->id, 'status' => 'pending']);
    }

    public function test_vendor_receives_404_for_order_without_own_items(): void
    {
        $vendorUser = User::factory()->vendor()->create();
        Vendor::factory()->for($vendorUser)->create();
        $order = Order::factory()->create();
        OrderItem::factory()->for($order)->create();
        Sanctum::actingAs($vendorUser);

        $this->patchJson("/api/vendor/orders/{$order->id}/status", ['status' => 'processing'])
            ->assertNotFound();
    }
}
