<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ShippingAddressController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\CartController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Auth routes with custom rate limits
Route::post('/register', [AuthController::class, 'register'])->middleware(['throttle:register', 'web']);
Route::post('/login', [AuthController::class, 'login'])->middleware(['throttle:login', 'web']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// General API routes with default rate limiting (throttle:api = 60/min)
Route::middleware('throttle:api')->group(function () {
    Route::apiResource('/categories', CategoryController::class);
    Route::apiResource('/products', ProductController::class);
    Route::put('products/status/{product}', [ProductController::class, 'updateStatus']);
    Route::post('products/carts/{product}', [ProductController::class, 'addToCart']);
    Route::put('products/carts/{cart}', [ProductController::class, 'updateQuantity']);
    Route::apiResource('/users', UserController::class)->middleware('auth:sanctum');
    Route::apiResource('/shipping-address', ShippingAddressController::class)->middleware('auth:sanctum');
});

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Route::post('/register', [AuthController::class, 'register']);

// Route::post('/login', [AuthController::class, 'login']);

// Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Route::apiResource('/categories', CategoryController::class);

// Route::apiResource('/products', ProductController::class);

// Route::put('products/status/{product}', [ProductController::class, 'updateStatus']);

// Route::post('products/carts/{product}', [ProductController::class, 'addToCart']);

// Route::put('products/carts/{cart}', [ProductController::class, 'updateQuantity']);

// Route::apiResource('/users', UserController::class)->middleware('auth:sanctum');

// Route::apiResource('/shipping-address', ShippingAddressController::class)->middleware('auth:sanctum');
