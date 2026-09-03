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
        Schema::create('sheds', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('zone');
            $table->integer('capacity');
            $table->enum('status', ['ACTIVE', 'SANITARY_VOID'])->default('ACTIVE');
            $table->date('last_emptied_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sheds');
    }
};
