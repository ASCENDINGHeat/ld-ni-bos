<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shipping_address' => ['required', 'string', 'max:500'],
            'shipping_phone'   => ['required', 'string', 'max:20'],
            'payment_method'   => ['required', 'in:simulated_wallet,bank_transfer_simulated,cod'],
            'notes'            => ['nullable', 'string', 'max:1000'],
        ];
    }
}
