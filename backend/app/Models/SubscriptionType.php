<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionType extends Model
{
    use HasFactory;

    protected $table = 'subscription_type';

    protected $fillable = [
        'title',
        'price',
        'description',
        'post_limit',
    ];

    protected $casts = [
        'price' => 'integer',
        'post_limit' => 'integer',
    ];

    public function subscriptionPayments()
    {
        return $this->hasMany(SubscriptionPayment::class);
    }
}
