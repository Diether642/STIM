<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\RetailProduct;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminRetailProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = RetailProduct::with(['municipality', 'barangay', 'images', 'user:id,name']);
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
            'product_type' => 'required|string|max:100',
            'municipality_id' => 'required|exists:municipalities,id',
            'barangay_id' => 'required|exists:barangays,id',
            'address' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'price' => 'nullable|numeric|min:0',
            'contact_number' => 'nullable|string',
            'status' => 'required|in:pending,approved',
        ]);

        if ($validated['status'] === 'approved') {
            $validated['approved_at'] = now();
            $validated['approved_by'] = $request->user()->id;
        }

        $item = RetailProduct::create($validated);
        return response()->json(['message' => 'Created.', 'retail_product' => $item], 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(RetailProduct::with(['municipality', 'barangay', 'images'])->findOrFail($id));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = RetailProduct::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'product_type' => 'sometimes|string',
            'price' => 'nullable|numeric|min:0',
            'status' => 'sometimes|in:pending,approved,rejected,archived',
        ]);

        if (isset($validated['status']) && $validated['status'] === 'approved' && $item->status !== 'approved') {
            $validated['approved_at'] = now();
            $validated['approved_by'] = $request->user()->id;
        }

        $item->update($validated);
        return response()->json(['message' => 'Updated.', 'retail_product' => $item]);
    }

    public function destroy(int $id): JsonResponse
    {
        RetailProduct::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted.']);
    }
}