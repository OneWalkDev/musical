<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

// Authentication routes
Route::post('/signup/', [AuthController::class, 'signup']);
Route::post('/login/', [AuthController::class, 'login']);
Route::post('/logout/', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/me/', [AuthController::class, 'me'])->middleware('auth:sanctum');

// Genre routes
Route::get('/genres/', [GenreController::class, 'index']);
Route::get('/user-genres/', [GenreController::class, 'userGenres'])->middleware('auth:sanctum');
Route::post('/user-genres/', [GenreController::class, 'updateUserGenres'])->middleware('auth:sanctum');

// Post routes
Route::get('/can-post/', [PostController::class, 'canPost'])->middleware('auth:sanctum');
Route::post('/posts/', [PostController::class, 'createPost'])->middleware('auth:sanctum');
Route::get('/posts/{id}/', [PostController::class, 'show'])->middleware('auth:sanctum');
Route::get('/today-received-post/', [PostController::class, 'todayReceivedPost'])->middleware('auth:sanctum');
Route::post('/check-receive/', [PostController::class, 'checkReceive'])->middleware('auth:sanctum');
Route::get('/received-posts/', [PostController::class, 'receivedHistory'])->middleware('auth:sanctum');
Route::get('/sent-posts/', [PostController::class, 'sentHistory'])->middleware('auth:sanctum');
Route::get('/stats/', [PostController::class, 'stats']);

// Subscription routes
Route::get('/subscription-types/', [SubscriptionController::class, 'index']);
Route::get('/user-subscription/', [SubscriptionController::class, 'getUserSubscription'])->middleware('auth:sanctum');
Route::post('/subscriptions/', [SubscriptionController::class, 'createSubscription'])->middleware('auth:sanctum');
Route::patch('/subscriptions/{id}/complete/', [SubscriptionController::class, 'completePayment'])->middleware('auth:sanctum');
Route::patch('/subscriptions/{id}/cancel/', [SubscriptionController::class, 'cancelSubscription'])->middleware('auth:sanctum');
