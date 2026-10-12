<?php

namespace Tests\Feature;

use Tests\TestCase;

class StorefrontRoutesTest extends TestCase
{
    public function test_home_route_renders_the_home_view(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee('id="root" data-initial-view="beranda"', false);
    }

    public function test_catalog_route_renders_the_catalog_view(): void
    {
        $response = $this->get('/katalog');

        $response->assertOk();
        $response->assertSee('id="root" data-initial-view="katalog"', false);
    }

    public function test_pc_builder_route_renders_the_builder_view(): void
    {
        $response = $this->get('/pc-builder');

        $response->assertOk();
        $response->assertSee('id="root" data-initial-view="pc-builder"', false);
    }
}
