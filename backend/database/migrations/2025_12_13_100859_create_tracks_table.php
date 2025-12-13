<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tracks', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->string('artist', 200);
            $table->text('url');
            $table->string('musicbrainz_id', 100)->nullable();
            $table->string('cover_art_url', 500)->nullable();
            $table->foreignId('primary_genre_id')->nullable()->constrained('genres')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracks');
    }
};
