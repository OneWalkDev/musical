<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function signup(array $data): array
    {
        $user = $this->userRepository->create([
            'username' => $data['username'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'id' => $user->id,
            'username' => $user->username,
            'token' => $token,
        ];
    }

    public function login(string $username, string $password): array
    {
        $user = $this->userRepository->findByUsername($username);

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['ユーザー名またはパスワードが正しくありません'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'id' => $user->id,
            'username' => $user->username,
            'token' => $token,
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    public function getUserInfo(User $user): array
    {
        return [
            'id' => $user->id,
            'username' => $user->username,
        ];
    }
}
