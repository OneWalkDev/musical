<?php

namespace App\Repositories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Carbon;

class PostRepository
{
    public function findById(int $id): ?Post
    {
        return Post::with(['track.primaryGenre', 'genres', 'user'])->find($id);
    }

    public function findTodayPostByUser(User $user): ?Post
    {
        $today = now()->toDateString();

        return Post::where('user_id', $user->id)
            ->where('post_date', $today)
            ->first();
    }

    public function hasPostedToday(User $user): bool
    {
        $today = now()->toDateString();

        return Post::where('user_id', $user->id)
            ->where('post_date', $today)
            ->exists();
    }

    public function create(array $data): Post
    {
        return Post::create($data);
    }

    public function attachGenres(Post $post, array $genreIds): void
    {
        $post->genres()->attach($genreIds);
    }

    public function getMostPopularTrack(): ?array
    {
        // 最も多く交換されているトラックを取得
        $trackId = \DB::table('exchanges')
            ->join('posts', 'exchanges.received_post_id', '=', 'posts.id')
            ->select('posts.track_id', \DB::raw('count(*) as exchange_count'))
            ->whereNotNull('exchanges.received_post_id')
            ->groupBy('posts.track_id')
            ->orderBy('exchange_count', 'desc')
            ->limit(10)  // 上位10件
            ->pluck('posts.track_id')
            ->toArray();

        if (empty($trackId)) {
            return null;
        }

        // 上位10件からランダムに1つ選択
        $randomTrackId = $trackId[array_rand($trackId)];

        $post = Post::with(['track.primaryGenre', 'genres', 'user'])
            ->whereHas('track', function ($query) use ($randomTrackId) {
                $query->where('id', $randomTrackId);
            })
            ->first();

        if (!$post) {
            return null;
        }

        return [
            'title' => $post->track->title,
            'artist' => $post->track->artist,
            'genre' => $post->track->primaryGenre->name,
        ];
    }

    public function getTodayActiveUsersCount(): int
    {
        $today = now()->toDateString();

        return Post::where('post_date', $today)
            ->distinct('user_id')
            ->count('user_id');
    }
}
