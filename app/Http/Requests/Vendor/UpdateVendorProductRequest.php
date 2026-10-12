<?php

namespace App\Http\Requests\Vendor;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVendorProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isVendor() && $this->user()->vendor !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['sometimes', 'required', 'integer', 'exists:categories,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'sku' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('products', 'sku')
                    ->where('vendor_id', $this->user()?->vendor?->id)
                    ->ignore($this->route('product')),
            ],
            'type' => ['sometimes', 'string', 'in:part,prebuilt'],
            'brand' => ['nullable', 'string', 'max:100'],
            'price' => ['sometimes', 'required', 'numeric', 'min:1', 'max:999999999999.99'],
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'description' => ['nullable', 'string', 'max:5000'],
            'specifications' => ['nullable', 'array'],
            'image_url' => ['nullable', 'url', 'max:2048'],
            'images' => ['nullable', 'array', 'max:8'],
            'images.*' => ['url', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
            'weight_grams' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
