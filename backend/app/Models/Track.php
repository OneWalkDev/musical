<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Track extends Model
{
    protected $fillable = [
        'title',
        'artist',
        'url',
        'musicbrainz_id',
        'cover_art_url',
        'primary_genre_id',
    ];

    public function primaryGenre()
    {
        return $this->belongsTo(Genre::class, 'primary_genre_id');
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}
