<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $search     = $request->input('search');
        $category   = $request->input('category');
        $dateFrom   = $request->input('date_from');
        $dateTo     = $request->input('date_to');
        $sortBy     = $request->input('sort_by', 'created_at');
        $sortDir    = $request->input('sort_dir', 'desc');
        $perPage    = $request->input('per_page', 10);

        // Optional: whitelist sortable columns to prevent SQL injection
        $sortableColumns = ['id', 'name', 'created_at',];
        if (!in_array($sortBy, $sortableColumns)) {
            $sortBy = 'created_at';
        }

        $categories = Category::when($search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        })
            ->when($category, function ($query, $category) {
                $query->where('category_id', $category);
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
            })
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage);

        return $categories;
    }

    public function categories()
    {

        $categories = Category::select('id', 'name')->get();

        return $categories;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate(
            [
                'name' => 'required|max:255',
                'description' => 'nullable'
            ]
        );

        Category::create($fields);

        return [
            'message' => 'Category created successfully.'
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        return ['category' => $category];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $fields = $request->validate(
            [
                "name" => 'required|max:255',
                'description' => 'nullable'
            ]
        );

        $category->update($fields);

        return [
            'category' => $category,
            'message' => 'Category updated successfully.'
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        if (!$category) {
            return 'Category not found.';
        }

        $message = $category->name . ' deleted successfully.';

        $category->delete();

        return $message;
    }

    public function get_products_suggestions(Request $request)
    {
        $category   = $request->input('category');
        $product_id = $request->input('product_id');

        $products = Product::with('category')
            ->where('id', '!=', $product_id)
            ->when($category, function ($query, $category) {
                if (is_array($category)) {
                    $query->whereIn('category_id', $category);
                } else {
                    $query->where('category_id', $category);
                }
            })
            ->limit(8)
            ->get();

        return $products;
    }
}
