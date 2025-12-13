<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserGenresRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'genre_ids' => 'required|array',
            'genre_ids.*' => 'exists:genres,id',
        ];
    }

    public function messages(): array
    {
        return [
            'genre_ids.required' => 'ジャンルは必須です。',
            'genre_ids.array' => 'ジャンルは配列で送信してください。',
            'genre_ids.*.exists' => '選択されたジャンルは無効です。',
        ];
    }
}
