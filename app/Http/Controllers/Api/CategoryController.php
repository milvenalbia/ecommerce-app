<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class CategoryController extends Controller implements HasMiddleware
{
    /**
     * Display a listing of the resource.
     */

    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum', except: ['index'])
        ];
    }

    public function index(Request $request)
    {
        $name = $request->input('name');

        $categories = Category::where('name', 'LIKE', "%{$name}%")->get();

        if(count($categories) < 1){
            return 'No category data found.';
        }

        return ['categories' => $categories];
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
        if(!$category){
            return 'Category not found.';
        }
        
        $message = $category->name . ' deleted successfully.';

        $category->delete();

        return $message;
    }
}
