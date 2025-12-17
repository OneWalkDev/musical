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
        Schema::create('subscription_payment', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("subscription_type_id");
            $table->string("payment_method_id");
            $table->boolean("payment_is_finished");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_payment');
    }
};
