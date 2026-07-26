<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\FoodBeverage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminFoodBeverageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = FoodBeverage::with(['municipality', 'barangay', 'images', 'user:id,name']);
        if ($request->filled('status'))
            $query->where('status', $request->status);
        if ($request->filled('q'))
            $query->where('name', 'like', "%{$request->q}%");
        return response()->json($query->orderByDesc('created_at')->paginate(15));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'cuisine_type' => 'nullable|string|max:100',
            'municipality_id' => 'required|exists:municipalities,id',
            'barangay_id' => 'required|exists:barangays,id',
            'address' => 'required|string|max:500',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'price_range' => 'required|in:budget,moderate,luxury',
            'contact_number' => 'nullable|string',
            'operating_hours' => 'nullable|string',
            'status' => 'required|in:pending,approved',
        ]);

        if ($validated['status'] === 'approved') {
            $validated['approved_at'] = now();
            $validated['approved_by'] = $request->user()->id;
        }

        $item = FoodBeverage::create($validated);
        return response()->json(['message' => 'Created.', 'food_beverage' => $item], 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(FoodBeverage::with(['municipality', 'barangay', 'images'])->findOrFail($id));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = FoodBeverage::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'cuisine_type' => 'nullable|string',
            'price_range' => 'sometimes|in:budget,moderate,luxury',
            'status' => 'sometimes|in:pending,approved,rejected,archived',
            'contact_number' => 'nullable|string',
            'operating_hours' => 'nullable|string',
        ]);

        if (isset($validated['status']) && $validated['status'] === 'approved' && $item->status !== 'approved') {
            $validated['approved_at'] = now();
            $validated['approved_by'] = $request->user()->id;
        }

        $item->update($validated);
        return response()->json(['message' => 'Updated.', 'food_beverage' => $item]);
    }

    public function destroy(int $id): JsonResponse
    {
        FoodBeverage::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted.']);
    }
}