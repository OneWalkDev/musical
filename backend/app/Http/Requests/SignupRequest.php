<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SignupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => [
                'required',
                'string',
                'min:3',
                'max:20',
                'unique:users,username',
                'regex:/^[a-zA-Z0-9ぁ-んァ-ヶー一-龯々]+$/u',
            ],
            'password' => 'required|string|min:8',
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => 'ユーザー名は必須です。',
            'username.min' => 'ユーザー名は3文字以上で入力してください。',
            'username.max' => 'ユーザー名は20文字以内で入力してください。',
            'username.unique' => 'このユーザー名は既に使用されています。',
            'username.regex' => 'ユーザー名は日本語、英語、数字のみ使用できます。',
            'password.required' => 'パスワードは必須です。',
            'password.min' => 'パスワードは8文字以上で入力してください。',
        ];
    }
}
