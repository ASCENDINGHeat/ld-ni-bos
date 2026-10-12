<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\VendorResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Vendor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class VendorOrderController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $vendor = $this->vendor($request);
        $items = OrderItem::query()->where('vendor_id', $vendor->id);

        return response()->json([
            'store' => new VendorResource($vendor->loadCount('products')),
            'metrics' => [
                'gross_sales' => (float) (clone $items)->where('status', '!=', 'cancelled')->sum('subtotal'),
                'products_sold' => (int) (clone $items)->where('status', '!=', 'cancelled')->sum('quantity'),
                'active_products' => $vendor->products()->active()->count(),
                'new_orders' => Order::whereHas('items', fn ($query) => $query->where('vendor_id', $vendor->id))->where('status', 'pending')->count(),
            ],
        ]);
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $vendor = $this->vendor($request);
        $orders = Order::query()
            ->whereHas('items', fn ($query) => $query->where('vendor_id', $vendor->id))
            ->with(['user', 'items' => fn ($query) => $query->where('vendor_id', $vendor->id)])
            ->latest('id')
            ->paginate(20);

        $orders->getCollection()->each(function (Order $order): void {
            $order->setAttribute('status', $order->items->first()?->status ?? 'pending');
        });

        return OrderResource::collection($orders);
    }

    public function updateStatus(Request $request, int $order): OrderResource
    {
        $vendor = $this->vendor($request);
        $validated = $request->validate([
            'status' => ['required', Rule::in(['processing', 'shipped', 'completed', 'cancelled'])],
        ]);
        $vendorOrder = Order::query()
            ->whereHas('items', fn ($query) => $query->where('vendor_id', $vendor->id))
            ->whereKey($order)
            ->firstOrFail();

        DB::transaction(function () use ($validated, $vendor, $vendorOrder): void {
            $vendorItems = $vendorOrder->items()->where('vendor_id', $vendor->id)->lockForUpdate()->get();
            abort_if($vendorItems->contains('status', 'cancelled') && $validated['status'] !== 'cancelled', 422, 'Cancelled items cannot be reopened.');

            if ($validated['status'] === 'cancelled') {
                $products = Product::query()
                    ->whereIn('id', $vendorItems->pluck('product_id')->filter())
                    ->lockForUpdate()
                    ->get()
                    ->keyBy('id');
                foreach ($vendorItems->where('status', '!=', 'cancelled') as $item) {
                    $products->get($item->product_id)?->increment('stock', $item->quantity);
                }
            }

            $vendorOrder->items()->where('vendor_id', $vendor->id)->update($validated);
        });

        $statuses = $vendorOrder->items()->pluck('status')->unique();
        if ($statuses->count() === 1) {
            $vendorOrder->update(['status' => $statuses->first()]);
        }

        $vendorOrder->load(['user', 'items' => fn ($query) => $query->where('vendor_id', $vendor->id)]);
        $vendorOrder->setAttribute('status', $validated['status']);

        return new OrderResource($vendorOrder);
    }

    private function vendor(Request $request): Vendor
    {
        abort_unless($request->user()?->isVendor(), 403, 'Vendor account required.');

        return $request->user()->vendor()->firstOrFail();
    }
}
