<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRssFeedItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rss_feed_items', function (Blueprint $table) {
            $table->id();
            $table->string('item_id')->nullable()->unique();
            $table->string('title');
            $table->string('link');
            $table->string('author')->nullable();
            $table->text('description');
            $table->string('category')->nullable();
            $table->boolean('is_read');
            $table->string('publish_date')->nullable();
            $table->foreignId('rss_feed_id')->constrained('rss_feeds')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rss_feeds_items');
    }
}
