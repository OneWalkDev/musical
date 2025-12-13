<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PoolEntry extends Model
{
    protected $fillable = [
        'post_id',
        'is_consumed',
        'consumed_at',
    ];

    protected $casts = [
        'is_consumed' => 'boolean',
        'consumed_at' => 'datetime',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
