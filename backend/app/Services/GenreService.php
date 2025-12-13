<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\GenreRepository;

class GenreService
{
    protected GenreRepository $genreRepository;

    public function __construct(GenreRepository $genreRepository)
    {
        $this->genreRepository = $genreRepository;
    }

    public function getAllGenres(): array
    {
        $genres = $this->genreRepository->getAll();

        return $genres->map(function ($genre) {
            return [
                'id' => $genre->id,
                'name' => $genre->name,
                'slug' => $genre->slug,
            ];
        })->toArray();
    }

    public function getUserGenres(User $user): array
    {
        $genres = $user->genres;

        return $genres->map(function ($genre) {
            return [
                'id' => $genre->id,
                'name' => $genre->name,
                'slug' => $genre->slug,
            ];
        })->toArray();
    }

    public function updateUserGenres(User $user, array $genreIds): void
    {
        $user->genres()->sync($genreIds);
    }
}
