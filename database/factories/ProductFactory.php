<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'category_id' => Category::factory(),
            'name' => ucfirst($name),
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(100, 999),
            'type' => 'part',
            'brand' => fake()->randomElement(['Asus', 'MSI', 'Gigabyte', 'Corsair', 'Intel', 'AMD']),
            'price' => fake()->randomFloat(2, 500000, 25000000),
            'stock' => fake()->numberBetween(5, 50),
            'description' => fake()->paragraph(),
            'specifications' => [
                'model' => fake()->bothify('Model-###??'),
                'warranty' => '2 Years Official Warranty',
            ],
            'image_url' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop',
            'images' => [
                'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop',
            ],
            'is_active' => true,
            'weight_grams' => fake()->numberBetween(300, 4000),
        ];
    }

    /**
     * Indicate that the product is a pre-built PC.
     */
    public function prebuilt(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'prebuilt',
            'brand' => fake()->randomElement(['LD Gaming Build', 'Custom ROG Build', 'Corsair One', 'NZXT BLD']),
            'specifications' => [
                'processor' => fake()->randomElement(['Intel Core i7-14700K', 'AMD Ryzen 7 7800X3D', 'Intel Core i5-14400F', 'AMD Ryzen 5 7600X']),
                'gpu' => fake()->randomElement(['NVIDIA GeForce RTX 4070 Super 12GB', 'NVIDIA GeForce RTX 4080 Super 16GB', 'AMD Radeon RX 7800 XT 16GB']),
                'motherboard' => fake()->randomElement(['MSI B760 Gaming Plus WiFi', 'ASUS TUF B650-PLUS WiFi', 'Gigabyte Z790 Aorus Elite']),
                'ram' => fake()->randomElement(['32GB (2x16GB) DDR5 6000MHz', '16GB (2x8GB) DDR5 5600MHz', '64GB (2x32GB) DDR5 6000MHz']),
                'storage' => fake()->randomElement(['1TB NVMe PCIe 4.0 SSD', '2TB NVMe PCIe 4.0 SSD']),
                'power_supply' => fake()->randomElement(['750W 80+ Gold Fully Modular', '850W 80+ Gold Fully Modular', '650W 80+ Bronze']),
                'casing' => fake()->randomElement(['NZXT H5 Flow RGB Tempered Glass', 'Montech Air 903 MAX', 'Lian Li O11 Dynamic EVO']),
                'cooler' => fake()->randomElement(['240mm AIO Liquid Cooler', '360mm AIO Liquid Cooler', 'Dual Tower Air Cooler']),
                'os' => 'Windows 11 Home 64-bit Activated',
                'warranty' => '3 Years Labor, 1 Year Parts Warranty',
            ],
            'weight_grams' => fake()->numberBetween(8000, 15000),
        ]);
    }

    /**
     * Indicate that the product is a PC part/component.
     */
    public function part(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'part',
            'specifications' => [
                'socket' => fake()->randomElement(['AM5', 'LGA1700']),
                'form_factor' => fake()->randomElement(['ATX', 'Micro-ATX']),
                'interface' => 'PCIe 4.0 x16',
                'power_consumption' => '120W TDP',
                'warranty' => '3 Years Manufacturer Warranty',
            ],
            'weight_grams' => fake()->numberBetween(300, 3000),
        ]);
    }

    /**
     * Indicate that the product is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => 0,
        ]);
    }

    /**
     * Indicate that the product is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
