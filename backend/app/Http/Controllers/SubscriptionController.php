<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionType;
use App\Models\SubscriptionPayment;
use Illuminate\Http\Request;
use Payjp\Payjp;
use Payjp\Charge;

class SubscriptionController extends Controller
{
    /**
     * Get all subscription types
     */
    public function index()
    {
        $subscriptionTypes = SubscriptionType::all();
        return response()->json($subscriptionTypes);
    }

    /**
     * Create a new subscription payment
     */
    public function createSubscription(Request $request)
    {
        $validated = $request->validate([
            'subscription_type_id' => 'required|exists:subscription_type,id',
            'payjp_token' => 'required|string',
        ]);

        // Payjp API Key設定
        Payjp::setApiKey(config('services.payjp.secret_key'));

        try {
            // サブスクリプションタイプを取得
            $subscriptionType = SubscriptionType::findOrFail($validated['subscription_type_id']);

            // Payjpで決済を実行
            $charge = Charge::create([
                'amount' => $subscriptionType->price,
                'currency' => 'jpy',
                'card' => $validated['payjp_token'],
                'description' => "Subscription: {$subscriptionType->title}",
            ]);

            // サブスクリプション支払いレコードを作成
            $subscription = SubscriptionPayment::create([
                'user_id' => $request->user()->id,
                'subscription_type_id' => $validated['subscription_type_id'],
                'payment_method_id' => $charge->id,
                'payment_is_finished' => true,
            ]);

            return response()->json([
                'message' => 'Subscription created successfully',
                'subscription' => $subscription->load('subscriptionType'),
            ], 201);
        } catch (\Payjp\Error\Base $e) {
            return response()->json([
                'message' => 'Payment failed',
                'error' => $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Complete subscription payment
     */
    public function completePayment(Request $request, $id)
    {
        $subscription = SubscriptionPayment::findOrFail($id);
        $subscription->update(['payment_is_finished' => true]);

        return response()->json([
            'message' => 'Payment completed successfully',
            'subscription' => $subscription->load('subscriptionType'),
        ]);
    }

    /**
     * Cancel user's subscription
     */
    public function cancelSubscription(Request $request, $id)
    {
        $user = $request->user();

        $subscription = SubscriptionPayment::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$subscription) {
            return response()->json([
                'message' => 'Subscription not found',
            ], 404);
        }

        if ($subscription->canceled_at) {
            return response()->json([
                'message' => 'Subscription already canceled',
            ], 409);
        }

        $subscription->update(['canceled_at' => now()]);

        return response()->json([
            'message' => 'Subscription canceled successfully',
            'subscription' => $subscription->load('subscriptionType'),
        ]);
    }

    /**
     * Get user's subscription status
     */
    public function getUserSubscription(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'has_subscription' => false,
                'subscription' => null,
            ]);
        }

        // 最新の支払い済みサブスクリプションを取得
        $subscription = SubscriptionPayment::where('user_id', $user->id)
            ->where('payment_is_finished', true)
            ->with('subscriptionType')
            ->latest()
            ->first();

        if (!$subscription) {
            return response()->json([
                'has_subscription' => false,
                'subscription' => null,
            ]);
        }

        $activeUntil = $subscription->created_at->copy()->addMonth();
        if ($subscription->canceled_at && now()->greaterThan($activeUntil)) {
            return response()->json([
                'has_subscription' => false,
                'subscription' => null,
            ]);
        }

        return response()->json([
            'has_subscription' => true,
            'subscription' => $subscription,
            'active_until' => $activeUntil,
        ]);
    }
}
