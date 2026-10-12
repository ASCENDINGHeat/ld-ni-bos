<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Vendor>
 */
class VendorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->state(['role' => 'vendor']),
            'store_name' => fake()->company(),
            'store_slug' => fake()->unique()->slug(),
            'store_description' => fake()->paragraph(),
            'store_phone' => fake()->phoneNumber(),
            'store_address' => fake()->address(),
            'is_active' => true,
        ];
    }
}
