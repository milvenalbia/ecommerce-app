<?php

namespace App\Http\Controllers\Api;

use App\Models\Cart;
use App\Models\Product;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ProductController extends Controller implements HasMiddleware
{
    /**
     * Display a listing of the resource.
     */

    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show'])
        ];
    }

    public function index(Request $request)
    {
        $search     = $request->input('search');
        $category   = $request->input('category');
        $sortBy     = $request->input('sort_by', 'created_at');
        $sortDir    = $request->input('sort_dir', 'desc');
        $perPage    = $request->input('per_page', 10);
        $dateFrom   = $request->input('date_from');
        $dateTo     = $request->input('date_to');
        $priceFrom   = $request->input('price_from') ?? null;
        $priceTo     = $request->input('price_to') ?? null;


        // Optional: whitelist sortable columns to prevent SQL injection
        $sortableColumns = ['id', 'name', 'price', 'created_at', 'stock_quantity'];
        if (!in_array($sortBy, $sortableColumns)) {
            $sortBy = 'created_at';
        }

        $products = Product::with('category')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('description', 'LIKE', "%{$search}%");
                });
            })
            ->when($category, function ($query, $category) {
                if (is_array($category)) {
                    $query->whereIn('category_id', $category);
                } else {
                    $query->where('category_id', $category);
                }
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
            })
            ->when($priceFrom, function ($query, $priceFrom) {
                $query->where('price', '>=', $priceFrom);
            })
            ->when($priceTo, function ($query, $priceTo) {
                $query->where('price', '<=', $priceTo);
            })
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage);

        return $products;
    }


    public function store(Request $request)
    {
        $fields = $request->validate([
            "name" => 'required|max:255',
            "description" => 'nullable',
            "price" => 'required|numeric|min:1|max:9999999.99',
            "stock_quantity" => 'required|numeric|min:1|max:9999999.99',
            "category_id" => 'required|exists:categories,id',
            "image_url" => 'required|image|max:4096',
        ]);

        // Upload to Cloudinary
        $path = Storage::disk('cloudinary')
            ->putFile('ecom_products', $request->file('image_url'));

        $image_url = Storage::disk('cloudinary')->url($path);

        $product = Product::create(array_merge($fields, [
            "image_url" => $image_url,
            "image_public_id" => $path
        ]));

        return response()->json([
            'message' => 'Product created successfully.',
            'product' => $product,
        ]);
    }




    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load('category');

        return ['product' => $product];
    }


    public function update(Request $request, Product $product)
    {
        // Use conditional validation rules to avoid duplication
        $rules = [
            "name" => 'required|max:255',
            "description" => 'nullable',
            "price" => 'required|numeric|min:1|max:9999999.99',
            "stock_quantity" => 'required|numeric|min:1|max:9999999.99',
            "category_id" => 'required|exists:categories,id',
        ];

        // If image is uploaded, validate it as image; else, image_url required only if no existing image
        if ($request->hasFile('image_url')) {
            $rules["image_url"] = 'image|max:4096';
        } else {
            $rules["image_url"] = $product->image_url ? 'nullable' : 'required';
        }

        $fields = $request->validate($rules);

        // Process image if uploaded
        if ($request->hasFile('image_url')) {
            // Delete old image only if public id exists
            if ($product->image_public_id) {
                Storage::disk('cloudinary')->delete($product->image_public_id);
            }

            // Upload new image
            $path = Storage::disk('cloudinary')->putFile('ecom_products', $request->file('image_url'));
            $image_url = Storage::disk('cloudinary')->url($path);

            $fields['image_url'] = $image_url;
            $fields['image_public_id'] = $path;
        }

        $product->update($fields);

        return [
            'message' => 'Product updated successfully.'
        ];
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        if (!$product) {
            return [
                'message' => "Product not found."
            ];;
        }

        $message = $product->name . ' deleted successfully.';

        if ($product->image_public_id) {
            Storage::disk('cloudinary')->delete($product->image_public_id);
        }

        $product->delete();

        return [
            'message' => $message
        ];
    }

    public function updateStatus(Product $product)
    {
        if (!$product) {
            return 'Product not found.';
        }

        $status = $product->is_active ? false : true;

        $product->update([
            'is_active' => $status,
        ]);

        return [
            'product' => $product,
            'message' => 'Product status updated successfully.'
        ];
    }

    public function addToCart(Request $request, Product $product)
    {
        $user_id = $request->user()->id;
        $quantity = $request->input('quantity') ?? 1;

        if (!$product) {
            throw new NotFoundHttpException();
        }

        //Check cart of the login user
        $cart = Cart::where('user_id', $user_id)->where('product_id', $product->id)->first();

        //Check if user add the same product

        if ($cart) {
            $cart->update([
                'quantity' => $cart->quantity + $quantity,
            ]);
        } else {
            Cart::create([
                'user_id' => $user_id,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price' => $product->price
            ]);
        }

        $userCartCount = Cart::where('user_id', $user_id)->sum('quantity');

        return [
            'message' => 'Added successfully.',
            'totalItems' => $userCartCount
        ];
    }
}
