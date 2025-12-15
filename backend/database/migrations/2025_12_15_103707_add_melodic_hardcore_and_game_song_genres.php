<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Genre;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // パンクロックの順序を取得
        $punkRock = Genre::where('slug', 'punk-rock')->first();
        if ($punkRock) {
            // メロコアをパンクロックの次に追加
            Genre::create([
                'name' => 'メロコア',
                'slug' => 'melodic-hardcore',
                'order' => $punkRock->order + 1,
            ]);
        }

        // アニソンの順序を取得
        $animeSong = Genre::where('slug', 'anime-song')->first();
        if ($animeSong) {
            // ゲームソングをアニソンの次に追加
            Genre::create([
                'name' => 'ゲームソング',
                'slug' => 'game-song',
                'order' => $animeSong->order + 1,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // ロールバック時は追加したジャンルを削除
        Genre::where('slug', 'melodic-hardcore')->delete();
        Genre::where('slug', 'game-song')->delete();
    }
};
