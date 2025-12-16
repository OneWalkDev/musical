<?php

namespace App\Repositories;

use App\Models\Exchange;
use App\Models\Track;
use App\Models\User;
use Illuminate\Support\Collection;

class ExchangeRepository
{
    public function findWaitingExchange(User $user, Track $track): ?Exchange
    {
        return Exchange::whereNull('received_post_id')
            ->where('requester_user_id', '!=', $user->id)
            ->whereNotIn('requester_user_id', function ($query) use ($track) {
                $query->select('requester_user_id')
                    ->from('exchanges')
                    ->join('posts', 'exchanges.received_post_id', '=', 'posts.id')
                    ->where('posts.track_id', $track->id);
            })
            ->first();
    }

    public function getReceivedTrackIds(User $user): Collection
    {
        return Exchange::where('requester_user_id', $user->id)
            ->whereNotNull('received_post_id')
            ->join('posts', 'exchanges.received_post_id', '=', 'posts.id')
            ->pluck('posts.track_id');
    }

    public function findTodayExchange(User $user): ?Exchange
    {
        $today = now()->toDateString();

        return Exchange::where('requester_user_id', $user->id)
            ->where('exchange_date', $today)
            ->with(['receivedPost.track.primaryGenre', 'receivedPost.genres', 'receivedPost.user'])
            ->first();
    }

    public function findLatestWaitingExchange(User $user): ?Exchange
    {
        return Exchange::where('requester_user_id', $user->id)
            ->whereNull('received_post_id')
            ->orderByDesc('created_at')
            ->first();
    }

    public function hasPastExchangeWithTrack(User $user, int $trackId, int $excludeExchangeId): bool
    {
        return Exchange::where('requester_user_id', $user->id)
            ->whereNotNull('received_post_id')
            ->where('exchanges.id', '!=', $excludeExchangeId)
            ->join('posts', 'exchanges.received_post_id', '=', 'posts.id')
            ->where('posts.track_id', $trackId)
            ->exists();
    }

    public function create(array $data): Exchange
    {
        return Exchange::create($data);
    }

    public function update(Exchange $exchange, array $data): bool
    {
        return $exchange->update($data);
    }

    public function getReceivedByUserPaginated(User $user, int $perPage = 10)
    {
        return Exchange::where('requester_user_id', $user->id)
            ->whereNotNull('received_post_id')
            ->with(['receivedPost.track.primaryGenre', 'receivedPost.genres', 'receivedPost.user'])
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function getTodayRandomExchange(): ?array
    {
        $today = now()->toDateString();

        $exchange = Exchange::where('exchange_date', $today)
            ->whereNotNull('received_post_id')
            ->with(['receivedPost.track.primaryGenre', 'receivedPost.genres'])
            ->inRandomOrder()
            ->first();

        if (!$exchange || !$exchange->receivedPost) {
            return null;
        }

        $post = $exchange->receivedPost;

        return [
            'title' => $post->track->title,
            'artist' => $post->track->artist,
            'genre' => $post->track->primaryGenre->name,
        ];
    }
}
