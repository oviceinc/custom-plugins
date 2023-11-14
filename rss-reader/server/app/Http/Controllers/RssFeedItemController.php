<?php

namespace App\Http\Controllers;

use App\Models\RssFeedItem;
use Illuminate\Http\Request;

class RssFeedItemController extends Controller
{
    public function markAsRead($itemId)
    {
        $rssFeedItem = RssFeedItem::find($itemId);

        if (!$rssFeedItem) {
            return response()->json(['error' => 'RSS feed item not found'], 404);
        }
        $rssFeedItem->update(['is_read' => true]);

        return response()->json(['message' => 'RSS feed item marked as read']);
    }

    public function getItemsByFeed($objectId)
    {
        $perPage = request()->input('per_page', 10);
        $page = request()->input('page', 1);

        $rssFeedItems = RssFeedItem::whereHas('rssFeed', function ($query) use ($objectId) {
            $query->where('object_id', $objectId);
        })->orderBy('created_at', 'desc')->paginate($perPage, ['*'], 'page', $page);

        return response()->json(['data' => $rssFeedItems]);
    }
}
