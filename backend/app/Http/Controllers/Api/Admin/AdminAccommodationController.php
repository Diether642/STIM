<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Accommodation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAccommodationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Accommodation::with(['municipality', 'barangay', 'images', 'user:id,name']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('q')) {
            $query->where('name', 'like', "%{$request->q}%");
        }

        return response()->json($query->orderByDesc('created_at')->paginate(15));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|string|max:100',
            'municipality_id' => 'required|exists:municipalities,id',
            'barangay_id' => 'required|exists:barangays,id',
            'address' => 'required|string|max:500',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'price_range' => 'required|in:budget,moderate,luxury',
            'contact_number' => 'nullable|string|max:20',
            'operating_hours' => 'nullable|string|max:255',
            'status' => 'required|in:pending,approved',
        ]);

        $validated['approved_at'] = $validated['status'] === 'approved' ? now() : null;
        $validated['approved_by'] = $validated['status'] === 'approved' ? $request->user()->id : null;

        $accommodation = Accommodation::create($validated);

        return response()->json(['message' => 'Accommodation created.', 'accommodation' => $accommodation], 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(Accommodation::with(['municipality', 'barangay', 'images', 'user'])->findOrFail($id));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $accommodation = Accommodation::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'type' => 'sometimes|string|max:100',
            'address' => 'sometimes|string|max:500',
            'price_range' => 'sometimes|in:budget,moderate,luxury',
            'status' => 'sometimes|in:pending,approved,rejected,archived',
            'contact_number' => 'nullable|string|max:20',
            'operating_hours' => 'nullable|string|max:255',
        ]);

        if (isset($validated['status']) && $validated['status'] === 'approved' && $accommodation->status !== 'approved') {
            $validated['approved_at'] = now();
            $validated['approved_by'] = $request->user()->id;
        }

        $accommodation->update($validated);
        return response()->json(['message' => 'Accommodation updated.', 'accommodation' => $accommodation]);
    }

    public function destroy(int $id): JsonResponse
    {
        Accommodation::findOrFail($id)->delete();
        return response()->json(['message' => 'Accommodation deleted.']);
    }
}