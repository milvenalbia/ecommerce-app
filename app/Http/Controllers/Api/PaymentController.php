<?php

namespace App\Http\Controllers\Api;

use App\Models\Payment;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\StripeClient;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'payment_intent_id' => 'required|string',
            'amount' => 'required|numeric',
            'payment_method_id' => 'required|string',
        ]);

        $stripe = new StripeClient(env('STRIPE_SECRET'));

        try {
            DB::beginTransaction();

            // Confirm the payment intent first
            $paymentIntent = $stripe->paymentIntents->retrieve($validated['payment_intent_id']);


            if ($paymentIntent->status !== 'succeeded') {
                throw new \Exception('Payment not confirmed');
            }

            $paymentMethod = $stripe->paymentMethods->retrieve($validated['payment_method_id']);

            // Get cart items first and check if empty
            $cartItems = Cart::where('user_id', $user->id)->get();

            if ($cartItems->isEmpty()) {
                throw new \Exception('Cart is empty');
            }

            // Create Order
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $validated['amount'] / 100,
                'status' => 'paid',
            ]);

            // Create order items
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price_at_purchase' => $item->price,
                ]);
            }

            // Create payment record
            Payment::create([
                'order_id' => $order->id,
                'payment_method' => $paymentMethod->type,
                'amount' => $order->total_amount,
                'status' => 'paid',
                'transaction_id' => $validated['payment_intent_id'],
                'payment_date' => now(),
            ]);

            // Clear cart
            Cart::where('user_id', $user->id)->delete();

            DB::commit();

            return response()->json(['message' => 'Order stored successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to process order: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentRequest $request, Payment $payment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        //
    }
}
