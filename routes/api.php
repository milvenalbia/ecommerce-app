<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ShippingAddressController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\StripePaymentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/categories/filters', [CategoryController::class, 'categories']);
Route::get('/product-by-categories', [CategoryController::class, 'get_products_suggestions']);

Route::post('/register', [AuthController::class, 'register'])->middleware(['throttle:register', 'web']);
Route::post('/login', [AuthController::class, 'login'])->middleware(['throttle:login', 'web']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/create-payment-intent', [StripePaymentController::class, 'createPaymentIntent'])->middleware('auth:sanctum');
Route::post('/webhook', [StripePaymentController::class, 'webhook'])->middleware('auth:sanctum');

// General API routes with default rate limiting (throttle:api = 60/min)
Route::middleware('throttle:api')->group(function () {
    // Api Resource
    Route::apiResource('/categories', CategoryController::class)->middleware('auth:sanctum');
    Route::apiResource('/products', ProductController::class);
    Route::apiResource('/carts', CartController::class)->middleware('auth:sanctum');
    Route::apiResource('/orders', OrderController::class)->middleware('auth:sanctum');
    Route::apiResource('/payments', PaymentController::class)->middleware('auth:sanctum');
    Route::apiResource('/users', UserController::class)->middleware('auth:sanctum');
    Route::apiResource('/shipping-address', ShippingAddressController::class)->middleware('auth:sanctum');

    // Custom Api
    Route::post('products/carts/{product}', [ProductController::class, 'addToCart'])->middleware('auth:sanctum');

    Route::put('products/status/{product}', [ProductController::class, 'updateStatus'])->middleware('auth:sanctum');
    Route::put('/orders/status/{order}', [OrderController::class, 'updateStatus'])->middleware('auth:sanctum');
});
