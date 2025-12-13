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
        Schema::create('exchanges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requester_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('sent_post_id')->constrained('posts')->onDelete('cascade');
            $table->foreignId('received_post_id')->nullable()->constrained('posts')->onDelete('cascade');
            $table->date('exchange_date');
            $table->timestamps();

            $table->unique(['requester_user_id', 'exchange_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exchanges');
    }
};
