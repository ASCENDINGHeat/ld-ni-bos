<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    /**
     * Display a listing of product categories.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Category::active()->withCount([
            'products' => fn ($q) => $q->active(),
        ]);

        if ($request->filled('type')) {
            $query->ofType($request->string('type')->value());
        }

        $categories = $query->orderBy('name')->get();

        return CategoryResource::collection($categories);
    }

    /**
     * Display the specified category by slug or ID.
     */
    public function show(string $slug): CategoryResource
    {
        $category = Category::active()
            ->withCount(['products' => fn ($q) => $q->active()])
            ->where(function ($q) use ($slug): void {
                $q->where('slug', $slug)
                    ->orWhere('id', $slug);
            })
            ->firstOrFail();

        return new CategoryResource($category);
    }
}
