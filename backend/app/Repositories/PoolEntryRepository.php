<?php

namespace App\Repositories;

use App\Models\PoolEntry;
use App\Models\User;
use Illuminate\Support\Collection;

class PoolEntryRepository
{
    public function create(array $data): PoolEntry
    {
        return PoolEntry::create($data);
    }

    public function findAvailableEntry(User $user, Collection $receivedTrackIds): ?PoolEntry
    {
        return PoolEntry::where('is_consumed', false)
            ->whereHas('post', function ($query) use ($user, $receivedTrackIds) {
                $query->where('user_id', '!=', $user->id)
                    ->whereNotIn('track_id', $receivedTrackIds);
            })
            ->first();
    }

    public function markAsConsumed(PoolEntry $poolEntry): bool
    {
        $poolEntry->is_consumed = true;
        $poolEntry->consumed_at = now();
        return $poolEntry->save();
    }
}
