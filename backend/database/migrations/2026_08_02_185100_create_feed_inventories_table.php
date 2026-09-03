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
        Schema::create('feed_inventories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('zone', ['A', 'B', 'C']);
            $table->integer('sacks_stock');
            $table->decimal('kg_stock', 10, 2);
            $table->date('entry_date');
            $table->date('expiration_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feed_inventories');
    }
};
