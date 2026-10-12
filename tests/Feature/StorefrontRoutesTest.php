<?php

namespace Tests\Feature;

use Tests\TestCase;

class StorefrontRoutesTest extends TestCase
{
    public function test_home_route_renders_the_home_view(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee('id="root"', false);
        $response->assertSee('data-initial-view="beranda"', false);
    }

    public function test_catalog_route_renders_the_catalog_view(): void
    {
        $response = $this->get('/katalog');

        $response->assertOk();
        $response->assertSee('data-initial-view="katalog"', false);
    }

    public function test_pc_builder_route_renders_the_builder_view(): void
    {
        $response = $this->get('/pc-builder');

        $response->assertOk();
        $response->assertSee('data-initial-view="pc-builder"', false);
    }

    public function test_cart_route_renders_the_cart_view(): void
    {
        $response = $this->get('/keranjang');

        $response->assertOk();
        $response->assertSee('data-initial-view="cart"', false);
    }

    public function test_checkout_route_renders_the_checkout_view(): void
    {
        $response = $this->get('/checkout');

        $response->assertOk();
        $response->assertSee('data-initial-view="checkout"', false);
    }

    public function test_account_settings_route_renders_the_account_view(): void
    {
        $response = $this->get('/akun');

        $response->assertOk();
        $response->assertSee('data-initial-view="account"', false);
    }

    public function test_vendor_dashboard_route_renders_the_overview(): void
    {
        $response = $this->get('/vendor/dashboard');

        $response->assertOk();
        $response->assertSee('data-initial-view="vendor-dashboard"', false);
        $response->assertSee('data-vendor-section="overview"', false);
    }

    public function test_vendor_navigation_routes_render_their_sections(): void
    {
        foreach ([
            '/vendor/products' => 'products',
            '/vendor/orders' => 'orders',
            '/vendor/reports' => 'reports',
            '/vendor/settings' => 'settings',
        ] as $path => $section) {
            $response = $this->get($path);

            $response->assertOk();
            $response->assertSee('data-initial-view="vendor-dashboard"', false);
            $response->assertSee('data-vendor-section="'.$section.'"', false);
        }
    }

    public function test_product_route_renders_the_requested_product_detail(): void
    {
        $response = $this->get('/produk/intel-core-i9-14900k');

        $response->assertOk();
        $response->assertSee('data-initial-view="detail"', false);
        $response->assertSee('data-product-slug="intel-core-i9-14900k"', false);
    }

    public function test_product_route_rejects_slugs_with_invalid_characters(): void
    {
        $response = $this->get('/produk/invalid_slug');

        $response->assertNotFound();
    }
}
