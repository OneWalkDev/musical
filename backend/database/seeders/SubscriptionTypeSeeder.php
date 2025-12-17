<?php

namespace Database\Seeders;

use App\Models\SubscriptionType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubscriptionTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subscriptionTypes = [
            [
                "title" => "プラス",
                "price" => 300,
                "description" => "開発の支援のためにコーヒーを支援してくれる方用\n\n特典\n・3曲まで好きな曲を送ることが出来ます。",
                "post_limit" => 3
            ],
            [
                "title" => "スタンダード",
                "price" => 500,
                "description" => "開発の支援のためにおやつを支援してくれる方用\n\n特典\n・8曲まで好きな曲を送ることが出来ます。",
                "post_limit" => 8
            ],
            [
                "title" => "プレミアム",
                "price" => 1000,
                "description" => "開発の支援のために夕食を支援してくれる方用\n\n特典\n・15曲まで好きな曲を送ることが出来ます。",
                "post_limit" => 15
            ],
        ];

        foreach($subscriptionTypes as $subscriptionType){
            SubscriptionType::create($subscriptionType);
        }
    }
}
