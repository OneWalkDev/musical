<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\ExchangeRepository;
use App\Repositories\PoolEntryRepository;
use App\Repositories\PostRepository;
use App\Repositories\TrackRepository;
use Illuminate\Support\Facades\DB;

class PostService
{
    protected PostRepository $postRepository;
    protected TrackRepository $trackRepository;
    protected ExchangeRepository $exchangeRepository;
    protected PoolEntryRepository $poolEntryRepository;

    public function __construct(
        PostRepository $postRepository,
        TrackRepository $trackRepository,
        ExchangeRepository $exchangeRepository,
        PoolEntryRepository $poolEntryRepository
    ) {
        $this->postRepository = $postRepository;
        $this->trackRepository = $trackRepository;
        $this->exchangeRepository = $exchangeRepository;
        $this->poolEntryRepository = $poolEntryRepository;
    }

    public function canPost(User $user): bool
    {
        return !$this->postRepository->hasPostedToday($user);
    }

    public function createPost(User $user, array $data): array
    {
        if ($this->postRepository->hasPostedToday($user)) {
            throw new \Exception('Already posted today');
        }

        return DB::transaction(function () use ($user, $data) {
            $today = now()->toDateString();

            // Create track
            $track = $this->trackRepository->create([
                'title' => $data['title'],
                'artist' => $data['artist'],
                'url' => $data['url'],
                'musicbrainz_id' => $data['musicbrainz_id'] ?? null,
                'cover_art_url' => $data['cover_art_url'] ?? null,
                'primary_genre_id' => $data['primary_genre_id'],
            ]);

            // Create post
            $post = $this->postRepository->create([
                'user_id' => $user->id,
                'track_id' => $track->id,
                'comment' => $data['comment'] ?? null,
                'post_date' => $today,
            ]);

            // Attach genres
            $this->postRepository->attachGenres($post, $data['genre_ids']);

            // Create pool entry
            $poolEntry = $this->poolEntryRepository->create([
                'post_id' => $post->id,
                'is_consumed' => false,
            ]);

            // 1. Find waiting users and assign them the new post
            $waitingExchange = $this->exchangeRepository->findWaitingExchange($user, $track);

            if ($waitingExchange) {
                $this->poolEntryRepository->markAsConsumed($poolEntry);
                $this->exchangeRepository->update($waitingExchange, [
                    'received_post_id' => $post->id,
                ]);
            }

            // 2. Find a song for current user
            $receivedTrackIds = $this->exchangeRepository->getReceivedTrackIds($user);
            $availablePoolEntry = $this->poolEntryRepository->findAvailableEntry($user, $receivedTrackIds);

            if ($availablePoolEntry) {
                $this->poolEntryRepository->markAsConsumed($availablePoolEntry);
                $this->exchangeRepository->create([
                    'requester_user_id' => $user->id,
                    'sent_post_id' => $post->id,
                    'received_post_id' => $availablePoolEntry->post_id,
                    'exchange_date' => $today,
                ]);
            } else {
                $this->exchangeRepository->create([
                    'requester_user_id' => $user->id,
                    'sent_post_id' => $post->id,
                    'received_post_id' => null,
                    'exchange_date' => $today,
                ]);
            }

            return [
                'message' => 'Post created successfully',
                'post_id' => $post->id,
            ];
        });
    }

    public function getTodayReceivedPost(User $user): array
    {
        $exchange = $this->exchangeRepository->findTodayExchange($user);

        if (!$exchange || !$exchange->receivedPost) {
            return ['has_received' => false];
        }

        $receivedPost = $exchange->receivedPost;

        // Filter own posts
        if ($receivedPost->user_id == $user->id) {
            return [
                'has_received' => false,
                'message' => '自分の投稿は受け取れません',
            ];
        }

        // Filter duplicate songs (same Track)
        $hasPastExchange = $this->exchangeRepository->hasPastExchangeWithTrack(
            $user,
            $receivedPost->track_id,
            $exchange->id
        );

        if ($hasPastExchange) {
            return [
                'has_received' => false,
                'message' => 'この曲は既に受け取ったことがあります',
            ];
        }

        return [
            'has_received' => true,
            'post' => [
                'id' => $receivedPost->id,
                'user' => $receivedPost->user_id,
                'username' => $receivedPost->user->username,
                'track' => [
                    'id' => $receivedPost->track->id,
                    'title' => $receivedPost->track->title,
                    'artist' => $receivedPost->track->artist,
                    'url' => $receivedPost->track->url,
                    'primary_genre' => [
                        'id' => $receivedPost->track->primaryGenre->id,
                        'name' => $receivedPost->track->primaryGenre->name,
                        'slug' => $receivedPost->track->primaryGenre->slug,
                    ],
                ],
                'genres' => $receivedPost->genres->map(fn($genre) => [
                    'id' => $genre->id,
                    'name' => $genre->name,
                    'slug' => $genre->slug,
                ]),
                'comment' => $receivedPost->comment,
                'created_at' => $receivedPost->created_at->toIso8601String(),
            ],
        ];
    }

    public function getPostById(int $id): ?array
    {
        $post = $this->postRepository->findById($id);

        if (!$post) {
            return null;
        }

        return [
            'id' => $post->id,
            'user' => $post->user_id,
            'username' => $post->user->username,
            'track' => [
                'id' => $post->track->id,
                'title' => $post->track->title,
                'artist' => $post->track->artist,
                'url' => $post->track->url,
                'primary_genre' => [
                    'id' => $post->track->primaryGenre->id,
                    'name' => $post->track->primaryGenre->name,
                    'slug' => $post->track->primaryGenre->slug,
                ],
            ],
            'genres' => $post->genres->map(fn($genre) => [
                'id' => $genre->id,
                'name' => $genre->name,
                'slug' => $genre->slug,
            ]),
            'comment' => $post->comment,
            'created_at' => $post->created_at->toIso8601String(),
        ];
    }

    public function getStats(): array
    {
        // 今日交換されている曲をランダムに1つ取得
        $todayExchange = $this->exchangeRepository->getTodayRandomExchange();

        // 最も人気のある曲（最も多く交換されている曲）をランダムに1つ取得
        $popularTrack = $this->postRepository->getMostPopularTrack();

        // アクティブユーザー数（今日投稿したユーザー数）
        $activeUsers = $this->postRepository->getTodayActiveUsersCount();

        return [
            'today_exchange' => $todayExchange,
            'popular_track' => $popularTrack,
            'active_users' => $activeUsers,
        ];
    }

    public function getReceivedHistory(User $user, int $perPage = 10): array
    {
        $paginator = $this->exchangeRepository->getReceivedByUserPaginated($user, $perPage);

        $data = $paginator->getCollection()->map(function ($exchange) {
            $post = $exchange->receivedPost;

            return [
                'id' => $exchange->id,
                'received_at' => $exchange->created_at?->toIso8601String(),
                'from_username' => $post->user->username ?? '',
                'track' => [
                    'title' => $post->track->title,
                    'artist' => $post->track->artist,
                    'url' => $post->track->url,
                    'primary_genre' => [
                        'id' => $post->track->primaryGenre->id,
                        'name' => $post->track->primaryGenre->name,
                        'slug' => $post->track->primaryGenre->slug,
                    ],
                ],
                'genres' => $post->genres->map(fn($genre) => [
                    'id' => $genre->id,
                    'name' => $genre->name,
                    'slug' => $genre->slug,
                ]),
                'comment' => $post->comment,
            ];
        })->values();

        return [
            'data' => $data,
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
            ],
        ];
    }
}
