<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\BusinessSubmission;
use App\Models\Accommodation;
use App\Models\FoodBeverage;
use App\Models\RetailProduct;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BusinessDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $submissions = BusinessSubmission::where('user_id', $userId)->get();
        $totalSubmissions = $submissions->count();
        $pendingCount = $submissions->where('status', 'pending')->count();
        $approvedCount = $submissions->where('status', 'approved')->count();
        $rejectedCount = $submissions->where('status', 'rejected')->count();

        // Get total views across all approved listings
        $totalViews = 0;
        $totalViews += Accommodation::where('user_id', $userId)->approved()->sum('view_count');
        $totalViews += FoodBeverage::where('user_id', $userId)->approved()->sum('view_count');
        $totalViews += RetailProduct::where('user_id', $userId)->approved()->sum('view_count');

        $recentSubmissions = BusinessSubmission::where('user_id', $userId)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => [
                'total_submissions' => $totalSubmissions,
                'pending' => $pendingCount,
                'approved' => $approvedCount,
                'rejected' => $rejectedCount,
                'total_views' => $totalViews,
            ],
            'recent_submissions' => $recentSubmissions,
        ]);
    }
}