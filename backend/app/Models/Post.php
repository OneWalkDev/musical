<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'user_id',
        'track_id',
        'comment',
        'impression',
        'post_date',
    ];

    protected $casts = [
        'post_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function track()
    {
        return $this->belongsTo(Track::class);
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class, 'post_genre');
    }

    public function poolEntry()
    {
        return $this->hasOne(PoolEntry::class);
    }

    public function sentExchanges()
    {
        return $this->hasMany(Exchange::class, 'sent_post_id');
    }

    public function receivedExchanges()
    {
        return $this->hasMany(Exchange::class, 'received_post_id');
    }
}
