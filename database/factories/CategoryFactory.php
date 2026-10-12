<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'name' => ucfirst($name),
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(100, 999),
            'type' => fake()->randomElement(['prebuilt', 'part']),
            'description' => fake()->sentence(),
            'icon' => null,
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the category is for pre-built PCs.
     */
    public function prebuilt(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'prebuilt',
        ]);
    }

    /**
     * Indicate that the category is for PC parts.
     */
    public function part(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'part',
        ]);
    }

    /**
     * Indicate that the category is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
