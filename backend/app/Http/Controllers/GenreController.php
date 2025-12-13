<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserGenresRequest;
use App\Services\GenreService;
use Illuminate\Http\Request;

class GenreController extends Controller
{
    protected GenreService $genreService;

    public function __construct(GenreService $genreService)
    {
        $this->genreService = $genreService;
    }

    public function index()
    {
        $genres = $this->genreService->getAllGenres();

        return response()->json($genres);
    }

    public function userGenres(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        $genres = $this->genreService->getUserGenres($user);

        return response()->json($genres);
    }

    public function updateUserGenres(UpdateUserGenresRequest $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        $validated = $request->validated();

        $this->genreService->updateUserGenres($user, $validated['genre_ids']);

        return response()->json(['message' => 'ジャンルを更新しました']);
    }
}
