<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class YouTubeUrl implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $host = parse_url($value, PHP_URL_HOST);

        if (!$host) {
            $fail('YouTubeのURLを入力してください。');
            return;
        }

        $normalizedHost = strtolower(preg_replace('/^www\./', '', $host));
        $allowedHosts = ['youtube.com', 'youtu.be'];

        if (!in_array($normalizedHost, $allowedHosts, true)) {
            $fail('YouTubeのURLのみ投稿できます（youtube.com または youtu.be）。');
        }
    }
}
