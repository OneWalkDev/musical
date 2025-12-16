<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreatePostRequest;
use App\Services\PostService;
use Illuminate\Http\Request;

class PostController extends Controller
{
    protected PostService $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    public function canPost(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        $canPost = $this->postService->canPost($user);

        return response()->json(['can_post' => $canPost]);
    }

    public function createPost(CreatePostRequest $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        $validated = $request->validated();

        try {
            $result = $this->postService->createPost($user, $validated);

            return response()->json($result, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function todayReceivedPost(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        $result = $this->postService->getTodayReceivedPost($user);

        return response()->json($result);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        $post = $this->postService->getPostById($id);

        if (!$post) {
            return response()->json(['error' => 'Post not found'], 404);
        }

        return response()->json($post);
    }

    public function stats()
    {
        $stats = $this->postService->getStats();

        return response()->json($stats);
    }

    public function receivedHistory(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        $perPage = (int) $request->query('per_page', 10);

        $history = $this->postService->getReceivedHistory($user, $perPage);

        return response()->json($history);
    }

    public function sentHistory(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        $perPage = (int) $request->query('per_page', 10);

        $history = $this->postService->getSentHistory($user, $perPage);

        return response()->json($history);
    }

    public function checkReceive(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        // まず今日の受信情報を確認
        $result = $this->postService->getTodayReceivedPost($user);

        // すでに受け取っている場合はその情報を返す
        if ($result['has_received']) {
            return response()->json($result);
        }

        // まだ受け取っていない場合、プールから受け取りを試みる
        $received = $this->postService->checkAndReceiveFromPool($user);

        if ($received) {
            // 受け取りに成功した場合、更新された今日の受信情報を返す
            $result = $this->postService->getTodayReceivedPost($user);
            return response()->json($result);
        }

        // まだ受け取れていない
        return response()->json(['has_received' => false]);
    }
}
