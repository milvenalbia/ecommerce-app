<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search     = $request->input('search');
        $dateFrom   = $request->input('date_from');
        $dateTo     = $request->input('date_to');
        $sortBy     = $request->input('sort_by', 'created_at');
        $sortDir    = $request->input('sort_dir', 'desc');
        $perPage    = $request->input('per_page', 10);

        // Optional: whitelist sortable columns to prevent SQL injection
        $sortableColumns = [
            'id' => 'orders.id',
            'status' => 'orders.status',
            'total_amount' => 'orders.total_amount',
            'created_at' => 'orders.created_at',
            'user' => 'users.name',
        ];

        $sortBy = $sortableColumns[$request->input('sort_by')] ?? 'orders.created_at';

        $orders = Order::select('orders.*')
            ->join('users', 'users.id', '=', 'orders.user_id')
            ->with(['orderItems', 'user'])
            ->when($search, function ($query, $search) {
                $query->where('users.name', 'LIKE', "%{$search}%");
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->where('orders.created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->where('orders.created_at', '<=', $dateTo);
            })
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage);


        return $orders;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user_id = $request->user()->id;
        $total_amount = 0;

        return 'Create Order';
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $order->load(['orderItems', 'orderItems.product', 'user', 'user.shippingAddresses']);

        return $order;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => ['required', new Enum(OrderStatus::class)]
        ]);

        $order->update([
            'status' => $validated['status'],
        ]);

        return [
            'order' => $order,
            'message' => 'Product status updated successfully.'
        ];
    }
}
