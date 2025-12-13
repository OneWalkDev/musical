<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function signup(SignupRequest $request)
    {
        $validated = $request->validated();

        $result = $this->authService->signup($validated);

        return response()->json($result, 201);
    }

    public function login(LoginRequest $request)
    {
        $validated = $request->validated();

        $result = $this->authService->login(
            $validated['username'],
            $validated['password']
        );

        return response()->json($result);
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        $result = $this->authService->getUserInfo($user);

        return response()->json($result);
    }
}
