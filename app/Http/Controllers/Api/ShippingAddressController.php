<?php

namespace App\Http\Controllers\Api;

use App\Models\ShippingAddress;
use App\Http\Requests\StoreShippingAddressRequest;
use App\Http\Requests\UpdateShippingAddressRequest;
use Illuminate\Http\Request;

class ShippingAddressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user_id = $request->user()->id;

        $fields = $request->validate([
            'address' => 'required|max:255',
            'city' => 'nullable|max:255',
            'postal_code' => 'required|digits:4',
            'phone_number' => 'required|max:13|regex:/^\+639\d{9}$/|unique:shipping_addresses'
        ]);

        $address = ShippingAddress::create([...$fields, 'user_id' => $user_id]);

        return [
            'message' => 'Shipping address created successfully',
            'address' => $address
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(ShippingAddress $shippingAddress)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ShippingAddress $shippingAddress)
    {
        $fields = $request->validate([
            'address' => 'required|max:255',
            'city' => 'nullable|max:255',
            'postal_code' => 'required|digits:4',
            'phone_number' => 'required|max:13|regex:/^\+639\d{9}$/|unique:shipping_addresses,phone_number,' . $shippingAddress->id
        ]);

        $shippingAddress->update($fields);

        return [
            'message' => 'Shipping address updated successfully',
            'address' => $shippingAddress
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ShippingAddress $shippingAddress)
    {
        //
    }
}
