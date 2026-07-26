<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\BusinessSubmission;
use App\Models\Accommodation;
use App\Models\FoodBeverage;
use App\Models\RetailProduct;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSubmissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BusinessSubmission::with(['user:id,name,email', 'municipality', 'barangay']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderByDesc('created_at')->paginate(15));
    }

    public function approve(Request $request, int $id): JsonResponse
    {
        $submission = BusinessSubmission::pending()->findOrFail($id);

        $submission->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'admin_notes' => $request->get('notes'),
        ]);

        // Create the actual listing based on type
        $listingData = [
            'user_id' => $submission->user_id,
            'name' => $submission->business_name,
            'description' => $submission->description,
            'municipality_id' => $submission->municipality_id,
            'barangay_id' => $submission->barangay_id,
            'address' => $submission->address,
            'latitude' => $submission->latitude,
            'longitude' => $submission->longitude,
            'contact_number' => $submission->contact_number,
            'operating_hours' => $submission->operating_hours,
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $request->user()->id,
        ];

        match ($submission->type) {
            'accommodation' => Accommodation::create(array_merge($listingData, [
                'type' => 'hotel',
                'price_range' => 'moderate',
            ])),
            'food_beverage' => FoodBeverage::create(array_merge($listingData, [
                'price_range' => 'moderate',
            ])),
            'retail_product' => RetailProduct::create(array_merge($listingData, [
                'product_type' => 'local product',
            ])),
        };

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'approved_submission',
            'description' => "Approved business submission: {$submission->business_name}",
            'model_type' => BusinessSubmission::class,
            'model_id' => $submission->id,
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json(['message' => 'Submission approved and listing created.']);
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        $request->validate(['notes' => 'required|string|max:1000']);

        $submission = BusinessSubmission::pending()->findOrFail($id);

        $submission->update([
            'status' => 'rejected',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'admin_notes' => $request->notes,
        ]);

        return response()->json(['message' => 'Submission rejected.']);
    }
}