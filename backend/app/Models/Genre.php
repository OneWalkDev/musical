<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    protected $fillable = [
        'name',
        'slug',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_genres');
    }

    public function posts()
    {
        return $this->belongsToMany(Post::class, 'post_genre');
    }

    public function tracks()
    {
        return $this->hasMany(Track::class, 'primary_genre_id');
    }
}
