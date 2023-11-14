<?php

namespace App\Http\Controllers;

use App\Models\RssFeed;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class RssFeedController extends Controller
{
    // Add a new RSS feed
    public function store(Request $request)
    {
        $request->validate([
            'object_id' => 'required|unique:rss_feeds',
            'feed_url' => 'required|url',
        ]);

        if (RssFeed::where('object_id', $request->input('object_id'))->count() < 100) {
            try {
                $rssFeed = RssFeed::create([
                    'object_id' => $request->input('object_id'),
                    'feed_url' => $request->input('feed_url'),
                ]);
            } catch (QueryException $e) {
                // Check if the exception is due to a unique constraint violation
                if ($e->errorInfo[1] == 1062) {
                    return response()->json(['error' => "Feed URL must be unique per object"], 400);
                }
            }
            return response()->json(['message' => 'RSS feed added successfully', 'data' => $rssFeed], 201);
        }


        return response()->json(['error' => 'Limit reached for object_id. Cannot add more than 100 records.'], 422);
    }

    // Delete an existing RSS feed
    public function destroy($objectId)
    {
        $rssFeed = RssFeed::where('object_id', $objectId)->first();

        if ($rssFeed) {
            $rssFeed->delete();
            return response()->json(['message' => 'RSS feed deleted successfully']);
        }

        return response()->json(['error' => 'RSS feed not found'], 404);
    }
}
