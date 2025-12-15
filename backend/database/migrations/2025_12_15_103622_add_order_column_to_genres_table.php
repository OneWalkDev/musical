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
        Schema::table('genres', function (Blueprint $table) {
            $table->integer('order')->default(0)->after('slug');
        });

        // 既存のジャンルにIDベースで順序を自動割り当て
        $genres = Genre::orderBy('id')->get();
        foreach ($genres as $index => $genre) {
            $genre->order = ($index + 1) * 10; // 10刻みで番号を振る（間に挿入できるように）
            $genre->save();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('genres', function (Blueprint $table) {
            $table->dropColumn('order');
        });
    }
};
