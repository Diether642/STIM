<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\Public\DestinationController;
use App\Http\Controllers\Api\Public\AccommodationController;
use App\Http\Controllers\Api\Public\FoodBeverageController;
use App\Http\Controllers\Api\Public\RetailProductController;
use App\Http\Controllers\Api\Public\EventController;
use App\Http\Controllers\Api\Public\AnnouncementController;
use App\Http\Controllers\Api\Public\SearchController;
use App\Http\Controllers\Api\Public\LocationController;
use App\Http\Controllers\Api\Tourist\ItineraryController;
use App\Http\Controllers\Api\Tourist\RatingController;
use App\Http\Controllers\Api\Business\BusinessDashboardController;
use App\Http\Controllers\Api\Business\BusinessSubmissionController;
use App\Http\Controllers\Api\Business\BusinessProfileController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminDestinationController;
use App\Http\Controllers\Api\Admin\AdminAccommodationController;
use App\Http\Controllers\Api\Admin\AdminFoodBeverageController;
use App\Http\Controllers\Api\Admin\AdminRetailProductController;
use App\Http\Controllers\Api\Admin\AdminEventController;
use App\Http\Controllers\Api\Admin\AdminAnnouncementController;
use App\Http\Controllers\Api\Admin\AdminSubmissionController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\ReportController;
use Illuminate\Support\Facades\Route;

// ==================== PUBLIC ROUTES ====================
Route::prefix('v1')->group(function () {

    // Auth
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Public listings
    Route::get('/destinations', [DestinationController::class, 'index']);
    Route::get('/destinations/{id}', [DestinationController::class, 'show'])->name('destinations.show');
    Route::get('/accommodations', [AccommodationController::class, 'index']);
    Route::get('/accommodations/{id}', [AccommodationController::class, 'show'])->name('accommodations.show');
    Route::get('/food-beverages', [FoodBeverageController::class, 'index']);
    Route::get('/food-beverages/{id}', [FoodBeverageController::class, 'show'])->name('food-beverages.show');
    Route::get('/retail-products', [RetailProductController::class, 'index']);
    Route::get('/retail-products/{id}', [RetailProductController::class, 'show'])->name('retail-products.show');
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{id}', [EventController::class, 'show']);
    Route::get('/announcements', [AnnouncementController::class, 'index']);

    // Locations
    Route::get('/municipalities', [LocationController::class, 'municipalities']);
    Route::get('/municipalities/{id}/barangays', [LocationController::class, 'barangays']);
    Route::get('/categories', [LocationController::class, 'categories']);

    // Search
    Route::get('/search', [SearchController::class, 'search']);
});

// ==================== AUTHENTICATED ROUTES ====================
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // ---------- TOURIST ROUTES ----------
    Route::middleware('role:tourist')->group(function () {
        Route::post('/itineraries/generate', [ItineraryController::class, 'generate']);
        Route::get('/itineraries', [ItineraryController::class, 'index']);
        Route::get('/itineraries/{id}', [ItineraryController::class, 'show']);
        Route::delete('/itineraries/{id}', [ItineraryController::class, 'destroy']);

        Route::post('/ratings', [RatingController::class, 'store']);
        Route::put('/ratings/{id}', [RatingController::class, 'update']);
        Route::delete('/ratings/{id}', [RatingController::class, 'destroy']);
        Route::get('/my-reviews', [RatingController::class, 'myReviews']);
    });

    // ---------- BUSINESS OWNER ROUTES ----------
    Route::middleware('role:business_owner')->prefix('business')->group(function () {
        Route::get('/dashboard', [BusinessDashboardController::class, 'index']);
        Route::get('/submissions', [BusinessSubmissionController::class, 'index']);
        Route::post('/submissions', [BusinessSubmissionController::class, 'store']);
        Route::get('/submissions/{id}', [BusinessSubmissionController::class, 'show']);
        Route::put('/submissions/{id}', [BusinessSubmissionController::class, 'update']);
        Route::get('/profile', [BusinessProfileController::class, 'show']);
        Route::put('/profile', [BusinessProfileController::class, 'update']);
    });

    // ---------- ADMIN ROUTES ----------
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        // Content CRUD
        Route::apiResource('/destinations', AdminDestinationController::class);
        Route::apiResource('/accommodations', AdminAccommodationController::class);
        Route::apiResource('/food-beverages', AdminFoodBeverageController::class);
        Route::apiResource('/retail-products', AdminRetailProductController::class);
        Route::apiResource('/events', AdminEventController::class);
        Route::apiResource('/announcements', AdminAnnouncementController::class);

        // Submissions
        Route::get('/submissions', [AdminSubmissionController::class, 'index']);
        Route::put('/submissions/{id}/approve', [AdminSubmissionController::class, 'approve']);
        Route::put('/submissions/{id}/reject', [AdminSubmissionController::class, 'reject']);

        // Users
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::put('/users/{id}', [AdminUserController::class, 'update']);
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

        // Reports
        Route::get('/reports/overview', [ReportController::class, 'overview']);
        Route::get('/reports/visitors', [ReportController::class, 'visitors']);
        Route::get('/reports/popular', [ReportController::class, 'popular']);
        Route::get('/reports/searches', [ReportController::class, 'searches']);
    });
});