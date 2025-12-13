<?php

return [
    'required' => ':attributeは必須です。',
    'string' => ':attributeは文字列である必要があります。',
    'max' => [
        'string' => ':attributeは:max文字以内で入力してください。',
        'array' => ':attributeは:max個以内で選択してください。',
    ],
    'min' => [
        'string' => ':attributeは:min文字以上で入力してください。',
        'array' => ':attributeは:min個以上選択してください。',
    ],
    'unique' => ':attributeは既に使用されています。',
    'url' => ':attributeは有効なURLを入力してください。',
    'array' => ':attributeは配列である必要があります。',
    'exists' => '選択された:attributeは無効です。',
    'nullable' => '',

    'attributes' => [
        'username' => 'ユーザー名',
        'password' => 'パスワード',
        'title' => 'タイトル',
        'artist' => 'アーティスト',
        'url' => 'URL',
        'musicbrainz_id' => 'MusicBrainz ID',
        'cover_art_url' => 'カバーアートURL',
        'primary_genre_id' => 'メインジャンル',
        'genre_ids' => 'ジャンル',
        'genre_ids.*' => 'ジャンル',
        'comment' => 'コメント',
    ],
];
