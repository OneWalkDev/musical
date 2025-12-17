<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPayment extends Model
{
    use HasFactory;

    protected $table = 'subscription_payment';

    protected $fillable = [
        'user_id',
        'subscription_type_id',
        'payment_method_id',
        'payment_is_finished',
        'canceled_at',
    ];

    protected $casts = [
        'subscription_type_id' => 'integer',
        'payment_is_finished' => 'boolean',
        'canceled_at' => 'datetime',
    ];

    public function subscriptionType()
    {
        return $this->belongsTo(SubscriptionType::class);
    }
}
