<?php

namespace App\Models;

use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'status',
        'payment_method',
        'shipping_method',
        'recipient_name',
        'recipient_phone',
        'shipping_phone',
        'shipping_address',
        'customer_note',
        'notes',
        'subtotal',
        'shipping_cost',
        'total',
        'total_amount',
    ];

    protected function casts(): array
    {
        return [
            'total_amount' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'total' => 'decimal:2',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Order $order): void {
            if (empty($order->total) && ! empty($order->total_amount)) {
                $order->total = $order->total_amount;
                $order->subtotal ??= $order->total_amount;
            }
            if (empty($order->total_amount) && ! empty($order->total)) {
                $order->total_amount = $order->total;
            }
            if (empty($order->recipient_phone) && ! empty($order->shipping_phone)) {
                $order->recipient_phone = $order->shipping_phone;
            }
            if (empty($order->shipping_phone) && ! empty($order->recipient_phone)) {
                $order->shipping_phone = $order->recipient_phone;
            }
        });
    }

    public function getTotalAttribute(): float
    {
        return (float) ($this->attributes['total'] ?? $this->attributes['total_amount'] ?? 0);
    }

    public function getSubtotalAttribute(): float
    {
        return (float) ($this->attributes['subtotal'] ?? $this->attributes['total_amount'] ?? 0);
    }

    public function getTotalAmountAttribute(): float
    {
        return (float) ($this->attributes['total_amount'] ?? $this->attributes['total'] ?? 0);
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    public static function generateOrderNumber(): string
    {
        $date = now()->format('Ymd');
        $random = strtoupper(substr(uniqid(), -4));

        return "ORD-{$date}-{$random}";
    }

    public function isCancellable(): bool
    {
        return in_array($this->status, ['pending', 'paid'], true);
    }
}
