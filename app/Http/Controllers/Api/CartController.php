<?php

namespace App\Http\Controllers\Api;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CartController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user_id = $request->user()->id;

        $carts = Cart::with('product')
            ->where('user_id', $user_id)
            ->get();

        $totalItems = $carts->sum('quantity');

        return [
            'carts' => $carts,
            'totalItems' => $totalItems
        ];
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {}
    /**
     * Display the specified resource.
     */
    public function show(Cart $cart)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cart $cart)
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

        $carts = Cart::with('product')
            ->where('user_id', $user_id)
            ->get();

        $totalItems = $carts->sum('quantity');

        return  [
            'message' => 'Updated successfully.',
            'cart' => $cart,
            'totalItems' => $totalItems,
        ];
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Cart $cart)
    {
        $user_id = $request->user()->id;

        $cart->delete();

        $carts = Cart::with('product')
            ->where('user_id', $user_id)
            ->get();

        $totalItems = $carts->sum('quantity');

        return [
            'message' => 'Item removed',
            'carts' => $carts,
            'totalItems' => $totalItems,
        ];
    }
}
