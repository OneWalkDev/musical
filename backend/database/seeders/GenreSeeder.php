<?php

namespace Database\Seeders;

use App\Models\Genre;
use Illuminate\Database\Seeder;

class GenreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $genres = [
            // ポップ / メインストリーム
            ['name' => 'J-POP', 'slug' => 'j-pop'],
            ['name' => 'K-POP', 'slug' => 'k-pop'],
            ['name' => 'C-POP', 'slug' => 'c-pop'],
            ['name' => 'アイドル', 'slug' => 'idol'],
            ['name' => '洋楽', 'slug' => 'western-music'],

            // ロック系
            ['name' => 'ロック', 'slug' => 'rock'],
            ['name' => '邦ロック', 'slug' => 'j-rock'],
            ['name' => '洋ロック', 'slug' => 'us-rock'],
            ['name' => 'ラウドロック', 'slug' => 'loud-rock'],
            ['name' => 'パンクロック', 'slug' => 'punk-rock'],
            ['name' => 'メタル', 'slug' => 'metal'],
            ['name' => 'オルタナティブ', 'slug' => 'alternative'],
            ['name' => 'インディー', 'slug' => 'indie'],

            // ヒップホップ / ブラックミュージック
            ['name' => 'ヒップホップ', 'slug' => 'hip-hop'],
            ['name' => 'ラップ', 'slug' => 'rap'],
            ['name' => 'R&B', 'slug' => 'r-and-b'],
            ['name' => 'ソウル', 'slug' => 'soul'],
            ['name' => 'ファンク', 'slug' => 'funk'],
            ['name' => 'レゲエ', 'slug' => 'reggae'],

            // ダンス / クラブ
            ['name' => 'EDM', 'slug' => 'edm'],
            ['name' => 'ハウス', 'slug' => 'house'],
            ['name' => 'テクノ', 'slug' => 'techno'],
            ['name' => 'トランス', 'slug' => 'trance'],
            ['name' => 'ダブステップ', 'slug' => 'dubstep'],
            ['name' => 'ドラムンベース', 'slug' => 'drum-and-bass'],
            ['name' => 'トラップ', 'slug' => 'trap'],
            ['name' => 'Kawaii EDM', 'slug' => 'kawaii-edm'],
            ['name' => 'ナイトコア', 'slug' => 'nightcore'],
            ['name' => 'チル', 'slug' => 'chill'],
            ['name' => 'アンビエント', 'slug' => 'ambient'],

            // ジャズ / クラシック / 伝統
            ['name' => 'ジャズ', 'slug' => 'jazz'],
            ['name' => 'クラシック', 'slug' => 'classical'],
            ['name' => 'ブルース', 'slug' => 'blues'],
            ['name' => 'カントリー', 'slug' => 'country'],
            ['name' => 'フォーク', 'slug' => 'folk'],
            ['name' => '演歌', 'slug' => 'enka'],

            // サブカル / コンテンツ系
            ['name' => 'アニソン', 'slug' => 'anime-song'],
            ['name' => 'ボーカロイド', 'slug' => 'vocaloid'],
            ['name' => '東方Project', 'slug' => 'touhou-project'],
            ['name' => 'サンクラ', 'slug' => 'soundcloud'],

            // その他
            ['name' => 'ディスコ', 'slug' => 'disco'],
            ['name' => 'ラテン', 'slug' => 'latin'],
            ['name' => 'ワールドミュージック', 'slug' => 'world'],
        ];

        foreach ($genres as $genre) {
            Genre::create($genre);
        }
    }
}
