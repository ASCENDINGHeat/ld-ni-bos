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
        if (! Schema::hasTable('order_items')) {
            Schema::create('order_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('order_id')->constrained()->cascadeOnDelete();
                $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
                $table->foreignId('vendor_id')->nullable()->constrained()->nullOnDelete();
                $table->string('product_name');
                $table->string('product_sku')->nullable();
                $table->decimal('unit_price', 14, 2);
                $table->unsignedInteger('quantity');
                $table->decimal('subtotal', 14, 2);
                $table->timestamps();

                $table->index(['vendor_id', 'created_at']);
            });
        } else {
            Schema::table('order_items', function (Blueprint $table) {
                if (! Schema::hasColumn('order_items', 'vendor_id')) {
                    $table->foreignId('vendor_id')->nullable()->after('product_id')->constrained()->nullOnDelete();
                }
                if (! Schema::hasColumn('order_items', 'product_sku')) {
                    $table->string('product_sku')->nullable()->after('product_name');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('order_items')) {
            Schema::table('order_items', function (Blueprint $table) {
                if (Schema::hasColumn('order_items', 'vendor_id')) {
                    $table->dropConstrainedForeignId('vendor_id');
                }
                if (Schema::hasColumn('order_items', 'product_sku')) {
                    $table->dropColumn('product_sku');
                }
            });
        }
    }
};
