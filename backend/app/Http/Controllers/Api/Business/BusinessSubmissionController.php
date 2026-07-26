<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\BusinessSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BusinessSubmissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $submissions = BusinessSubmission::where('user_id', $request->user()->id)
            ->with(['municipality', 'barangay'])
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json($submissions);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'type' => 'required|in:accommodation,food_beverage,retail_product',
            'description' => 'required|string|min:50',
            'address' => 'required|string|max:500',
            'municipality_id' => 'required|exists:municipalities,id',
            'barangay_id' => 'required|exists:barangays,id',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'contact_number' => 'required|string|max:20',
            'operating_hours' => 'nullable|string|max:255',
            'business_permit' => 'required|file|mimes:pdf,jpeg,jpg,png|max:10240',
        ]);

        // Store business permit
        $permitPath = $request->file('business_permit')
            ->store("business-permits/{$request->user()->id}", 'public');

        $submission = BusinessSubmission::create([
            'user_id' => $request->user()->id,
            'business_name' => $validated['business_name'],
            'type' => $validated['type'],
            'description' => $validated['description'],
            'address' => $validated['address'],
            'municipality_id' => $validated['municipality_id'],
            'barangay_id' => $validated['barangay_id'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'contact_number' => $validated['contact_number'],
            'operating_hours' => $validated['operating_hours'],
            'business_permit_path' => $permitPath,
        ]);

        return response()->json([
            'message' => 'Submission created. Awaiting admin approval.',
            'submission' => $submission,
        ], 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $submission = BusinessSubmission::where('user_id', $request->user()->id)
            ->with(['municipality', 'barangay'])
            ->findOrFail($id);

        return response()->json($submission);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $submission = BusinessSubmission::where('user_id', $request->user()->id)
            ->where('status', '!=', 'approved')
            ->findOrFail($id);

        $validated = $request->validate([
            'business_name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|min:50',
            'address' => 'sometimes|string|max:500',
            'contact_number' => 'sometimes|string|max:20',
            'operating_hours' => 'nullable|string|max:255',
        ]);

        $submission->update($validated);

        // Reset to pending if previously rejected
        if ($submission->status === 'rejected') {
            $submission->update(['status' => 'pending', 'admin_notes' => null]);
        }

        return response()->json(['message' => 'Submission updated.', 'submission' => $submission]);
    }
}