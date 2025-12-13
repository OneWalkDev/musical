<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:200',
            'artist' => 'required|string|max:200',
            'url' => 'required|url',
            'musicbrainz_id' => 'nullable|string|max:100',
            'cover_art_url' => 'nullable|url|max:500',
            'primary_genre_id' => 'required|exists:genres,id',
            'genre_ids' => 'required|array|min:1|max:3',
            'genre_ids.*' => 'exists:genres,id',
            'comment' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'タイトルは必須です。',
            'title.max' => 'タイトルは200文字以内で入力してください。',
            'artist.required' => 'アーティスト名は必須です。',
            'artist.max' => 'アーティスト名は200文字以内で入力してください。',
            'url.required' => 'URLは必須です。',
            'url.url' => '有効なURLを入力してください。',
            'cover_art_url.url' => '有効なカバーアートURLを入力してください。',
            'cover_art_url.max' => 'カバーアートURLは500文字以内で入力してください。',
            'primary_genre_id.required' => 'メインジャンルは必須です。',
            'primary_genre_id.exists' => '選択されたメインジャンルは無効です。',
            'genre_ids.required' => 'ジャンルは必須です。',
            'genre_ids.min' => 'ジャンルは1つ以上選択してください。',
            'genre_ids.max' => 'ジャンルは3つまで選択できます。',
            'genre_ids.*.exists' => '選択されたジャンルは無効です。',
        ];
    }
}
