<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exchange extends Model
{
    protected $fillable = [
        'requester_user_id',
        'sent_post_id',
        'received_post_id',
        'exchange_date',
    ];

    protected $casts = [
        'exchange_date' => 'date',
    ];

    public function requesterUser()
    {
        return $this->belongsTo(User::class, 'requester_user_id');
    }

    public function sentPost()
    {
        return $this->belongsTo(Post::class, 'sent_post_id');
    }

    public function receivedPost()
    {
        return $this->belongsTo(Post::class, 'received_post_id');
    }
}
