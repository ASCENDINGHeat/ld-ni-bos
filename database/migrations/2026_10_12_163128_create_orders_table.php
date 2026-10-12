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
        if (! Schema::hasTable('orders')) {
            Schema::create('orders', function (Blueprint $table) {
                $table->id();
                $table->string('order_number')->unique();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->string('status')->default('pending');
                $table->string('payment_method');
                $table->string('shipping_method')->default('regular');
                $table->string('recipient_name')->nullable();
                $table->string('recipient_phone')->nullable();
                $table->string('shipping_phone')->nullable();
                $table->text('shipping_address');
                $table->text('customer_note')->nullable();
                $table->text('notes')->nullable();
                $table->decimal('subtotal', 14, 2)->default(0);
                $table->decimal('shipping_cost', 14, 2)->default(0);
                $table->decimal('total', 14, 2)->default(0);
                $table->decimal('total_amount', 14, 2)->default(0);
                $table->timestamps();

                $table->index(['user_id', 'created_at']);
                $table->index(['status', 'created_at']);
            });
        } else {
            Schema::table('orders', function (Blueprint $table) {
                if (! Schema::hasColumn('orders', 'shipping_method')) {
                    $table->string('shipping_method')->default('regular')->after('payment_method');
                }
                if (! Schema::hasColumn('orders', 'recipient_name')) {
                    $table->string('recipient_name')->nullable()->after('shipping_method');
                }
                if (! Schema::hasColumn('orders', 'recipient_phone')) {
                    $table->string('recipient_phone')->nullable()->after('recipient_name');
                }
                if (! Schema::hasColumn('orders', 'customer_note')) {
                    $table->text('customer_note')->nullable()->after('shipping_address');
                }
                if (! Schema::hasColumn('orders', 'subtotal')) {
                    $table->decimal('subtotal', 14, 2)->default(0)->after('customer_note');
                }
                if (! Schema::hasColumn('orders', 'shipping_cost')) {
                    $table->decimal('shipping_cost', 14, 2)->default(0)->after('subtotal');
                }
                if (! Schema::hasColumn('orders', 'total')) {
                    $table->decimal('total', 14, 2)->default(0)->after('shipping_cost');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                $columns = ['shipping_method', 'recipient_name', 'recipient_phone', 'customer_note', 'subtotal', 'shipping_cost', 'total'];
                $existingColumns = array_filter($columns, fn ($col) => Schema::hasColumn('orders', $col));
                if (! empty($existingColumns)) {
                    $table->dropColumn($existingColumns);
                }
            });
        }
    }
};
