<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_number' => 'PCS-'.fake()->unique()->numerify('########'),
            'user_id' => User::factory(),
            'status' => 'pending',
            'payment_method' => 'bank-transfer',
            'shipping_method' => 'regular',
            'recipient_name' => fake()->name(),
            'recipient_phone' => fake()->phoneNumber(),
            'shipping_address' => fake()->address(),
            'subtotal' => 1000000,
            'shipping_cost' => 0,
            'total' => 1000000,
        ];
    }
}
