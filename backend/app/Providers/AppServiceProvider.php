<?php

namespace App\Providers;

use App\Services\ClaudeAIService;
use App\Services\GoogleMapsService;
use App\Services\ItineraryService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ClaudeAIService::class, fn() => new ClaudeAIService());
        $this->app->singleton(GoogleMapsService::class, fn() => new GoogleMapsService());

        $this->app->singleton(ItineraryService::class, function ($app) {
            return new ItineraryService(
                $app->make(ClaudeAIService::class),
                $app->make(GoogleMapsService::class),
            );
        });
    }

    public function boot(): void
    {
        //
    }
}