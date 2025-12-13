<?php

namespace App\Repositories;

use App\Models\Track;

class TrackRepository
{
    public function create(array $data): Track
    {
        return Track::create($data);
    }

    public function findById(int $id): ?Track
    {
        return Track::find($id);
    }
}
