<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentFactory> */
    use HasFactory;

    
    protected $fillable = [
        'order_id',
        'paymnet_method',
        'amount',
        'status',
        'transaction_id',
        'paymnet_date',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

}
