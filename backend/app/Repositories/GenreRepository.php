<?php

namespace App\Repositories;

use App\Models\Genre;
use Illuminate\Database\Eloquent\Collection;

class GenreRepository
{
    public function getAll(): Collection
    {
        return Genre::orderBy('order')->get();
    }

    public function findById(int $id): ?Genre
    {
        return Genre::find($id);
    }

    public function findByIds(array $ids): Collection
    {
        return Genre::whereIn('id', $ids)->get();
    }
}
