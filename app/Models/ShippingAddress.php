<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShippingAddress extends Model
{
    /** @use HasFactory<\Database\Factories\ShippingAddressFactory> */
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'address',
        'city',
        'postal_code',
        'phone_number',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(user::class);
    }
}
