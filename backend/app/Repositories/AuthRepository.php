<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthRepository
{
    public function createUser(array $data): User
    {
        return User::create([
            'username' => $data['username'],
            'password' => Hash::make($data['password']),
        ]);
    }

    public function findByUsername(string $username): ?User
    {
        return User::where('username', $username)->first();
    }

    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    public function deleteToken(User $user, string $tokenId): bool
    {
        return $user->tokens()->where('id', $tokenId)->delete();
    }
}
