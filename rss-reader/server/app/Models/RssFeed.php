<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RssFeed extends Model
{
    use HasFactory;

    protected $fillable = ['object_id', 'feed_url'];



    public function rssFeedItems()
    {
        return $this->hasMany(RssFeedItem::class);
    }
}
