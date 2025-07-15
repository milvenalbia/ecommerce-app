<?php

namespace App\Http\Controllers\Api;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ProductController extends Controller implements HasMiddleware
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


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            "name" => 'required|max:255|',
            "description" => 'nullable',
            "price" => 'required|numeric|min:1|max:9999999.99',
            "stock_quantity" => 'required|numeric|min:1|max:9999999.99',
            "category_id" => 'required|exists:categories,id',
            "image_url" => 'nullable',
        ]);

        Product::create($fields);

        return [
            'message' => 'Product created successfully.'
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return ['product' => $product];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $fields = $request->validate([
            "name" => 'required|max:255|',
            "description" => 'nullable',
            "price" => 'required|numeric|min:1|max:9999999.99',
            "stock_quantity" => 'required|numeric|min:1|max:9999999.99',
            "category_id" => 'required|exists:categories,id',
            "image_url" => 'nullable',
        ]);

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

    public function cartItems(Request $request)
    {
        $user_id = $request->user()->id;

        $carts = Cart::with('product')
            ->where('user_id', $user_id)
            ->get();

        return $carts;
    }

    public function addToCart(Request $request, Product $product)
    {
        $user_id = $request->user()->id;

        if (!$product) {
            throw new NotFoundHttpException();
        }

        //Check cart of the login user
        $cart = Cart::where('user_id', $user_id)->where('product_id', $product->id)->first();

        //Check if user add the same product

        if ($cart) {
            $cart->update([
                'quantity' => $cart->quantity + 1,
            ]);
        } else {
            Cart::create([
                'user_id' => $user_id,
                'product_id' => $product->id,
                'quantity' => 1,
                'price' => $product->price
            ]);
        }

        $userCartCount = Cart::where('user_id', $user_id)->count();

        return [
            'message' => 'Added successfully.',
            'totalItems' => $userCartCount
        ];
    }

    public function deleteCart(Request $request, Cart $cart)
    {
        $user_id = $request->user()->id;

        $cart->delete();

        $carts = Cart::with('product')
            ->where('user_id', $user_id)
            ->get();

        $totalItems = $carts->count();

        return [
            'message' => 'Item removed',
            'carts' => $carts,
            'totalItems' => $totalItems,
        ];
    }

    public function updateQuantity(Request $request, Cart $cart)
    {

        $user_id = $request->user()->id;

        if (!$cart) {
            throw new NotFoundHttpException();
        }

        $fields = $request->validate([
            'quantity' => 'required|numeric|min:1',
        ]);

        $cart->update([
            'quantity' => $fields['quantity']
        ]);

        $cart->load('product');

        return  [
            'message' => 'Updated successfully.',
            'cart' => $cart
        ];

        // $carts = Cart::with('product')
        //     ->where('user_id', $user_id)
        //     ->get();

        // $totalItems = $carts->count();

        // return [
        //     'message' => 'Updated successfully.',
        //     'carts' => $carts,
        //     'totalItems' => $totalItems,
        // ];
    }
}
