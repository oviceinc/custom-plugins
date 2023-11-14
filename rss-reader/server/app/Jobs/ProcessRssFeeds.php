<?php

namespace App\Jobs;

use App\Models\RssFeed;
use App\Models\RssFeedItem;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessRssFeeds implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Log::info('Starting to collects feeds');
        $rssFeeds = RssFeed::all();

        foreach ($rssFeeds as $rssFeed) {
            // Fetch the RSS feed content
            $feed = \Feeds::make($rssFeed->feed_url, 100, true);

            if ($feed) {
                $feedItems = [];
                foreach ($feed->get_items() as $item) {
                    $feedItems[] = [
                        'rss_feed_id' => $rssFeed->id,
                        'item_id' => $item->get_id(),
                        'category' => $item->get_category()->get_term(),
                        'author' => $item->get_author()->get_name(),
                        'title' => $item->get_title(),
                        'description' => $item->get_description(),
                        'link' => $item->get_permalink(),
                        'is_read' => false,
                        'publish_date' => $item->get_date(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }
        RssFeedItem::upsert($feedItems, ['item_id', ['title', 'description', 'category', 'is_read', 'link']]);
        Log::info('Finished from collecting feeds');
    }
}
