<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VendorControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_vendor_can_view_and_update_own_store(): void
    {
        $user = User::factory()->vendor()->create();
        $vendor = Vendor::factory()->for($user)->create(['store_name' => 'Old Store']);
        Sanctum::actingAs($user);

        $this->getJson('/api/vendor/store')->assertOk()->assertJsonPath('data.id', $vendor->id);
        $this->patchJson('/api/vendor/store', [
            'store_name' => 'New Store',
            'store_description' => 'Trusted computer hardware seller.',
        ])->assertOk()->assertJsonPath('data.store_name', 'New Store');

        $this->assertDatabaseHas('vendors', ['id' => $vendor->id, 'store_name' => 'New Store', 'store_slug' => 'new-store']);
    }

    public function test_customer_receives_403_when_creating_store(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/vendor/store', ['store_name' => 'Blocked Store'])->assertForbidden();

        $this->assertDatabaseCount('vendors', 0);
    }
}
