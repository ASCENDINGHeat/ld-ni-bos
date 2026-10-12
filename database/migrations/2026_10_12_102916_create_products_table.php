<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('type')->default('part')->index(); // 'prebuilt' or 'part'
            $table->string('brand')->nullable()->index();
            $table->decimal('price', 14, 2);
            $table->unsignedInteger('stock')->default(0);
            $table->text('description')->nullable();
            $table->json('specifications')->nullable();
            $table->string('image_url')->nullable();
            $table->json('images')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('weight_grams')->default(0);
            $table->timestamps();

            $table->index(['is_active', 'type']);
            $table->index(['is_active', 'category_id']);
            $table->index(['is_active', 'price']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
