<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log as FacadesLog;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class StripePaymentController
{
    public function createPaymentIntent(Request $request)
    {
        $user_id = $request->user()->id;

        $validated = $request->validate([
            'amount' => 'required|numeric',
        ]);

        // $amount = Cart::where('user_id', $user_id)
        //     ->selectRaw('SUM(price * quantity) as total')
        //     ->value('total');

        $amount = $validated['amount'];

        Stripe::setApiKey(env('STRIPE_SECRET'));

        $paymentIntent = PaymentIntent::create([
            'amount' => $amount * 100, // $10.00 = 1000
            'currency' => 'usd',
            'automatic_payment_methods' => ['enabled' => true],
        ]);

        // 'payment_method_types' => ['card'], (if you want to use card only)
        // 'automatic_payment_methods' => ['enabled' => true], (for having many options for payment method)

        return response()->json([
            'clientSecret' => $paymentIntent->client_secret
        ]);
    }

    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = env('STRIPE_WEBHOOK_SECRET');

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sigHeader,
                $endpointSecret
            );
        } catch (\Exception $e) {
            return response('Invalid signature', 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $intent = $event->data->object;
            FacadesLog::info('💰 PaymentIntent was successful!', ['id' => $intent->id]);
        }

        return response('Webhook received', 200);
    }
}
