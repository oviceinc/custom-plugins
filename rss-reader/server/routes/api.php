<?php

use App\Http\Controllers\RssFeedController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Add a new RSS feed
Route::post('/rss-feeds', [RssFeedController::class, 'store']);
// Delete an existing RSS feed
Route::delete('/rss-feeds/{objectId}', [RssFeedController::class, 'destroy']);
// Update RSS feed item status
Route::patch('/rss-feed-items/{itemId}/mark-as-read', [RssFeedItemController::class, 'markAsRead']);
// Retrieve paginated RSS feed items based on object_id
Route::get('/rss-feed-items/{objectId}', [RssFeedItemController::class, 'getItemsByFeed']);
