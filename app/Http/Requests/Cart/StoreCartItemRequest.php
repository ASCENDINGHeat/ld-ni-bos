<?php

namespace App\Http\Requests\Cart;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCartItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('products') && ! $this->has('items') && is_array($this->input('products'))) {
            $this->merge(['items' => $this->input('products')]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_id' => ['required_without:items'],
            'quantity' => ['nullable', 'integer', 'min:1'],
            'items' => ['required_without:product_id', 'array', 'min:1'],
            'items.*.product_id' => ['required_with:items'],
            'items.*.quantity' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
