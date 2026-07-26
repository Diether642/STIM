<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\DestinationImage;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminDestinationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Destination::with(['category', 'municipality', 'barangay', 'images']);

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
            'category_id' => 'required|exists:categories,id',
            'municipality_id' => 'required|exists:municipalities,id',
            'barangay_id' => 'required|exists:barangays,id',
            'address' => 'required|string|max:500',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'operating_hours' => 'nullable|string|max:255',
            'entrance_fee' => 'nullable|numeric|min:0',
            'contact_number' => 'nullable|string|max:20',
            'status' => 'required|in:draft,published',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|mimes:jpeg,jpg,png,webp|max:5120',
        ]);

        $destination = Destination::create([
            ...$validated,
            'created_by' => $request->user()->id,
        ]);

        // Handle images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store("destinations/{$destination->id}", 'public');
                DestinationImage::create([
                    'destination_id' => $destination->id,
                    'image_path' => $path,
                    'thumbnail_path' => $path,
                    'sort_order' => $index,
                    'is_primary' => $index === 0,
                ]);
            }
        }

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'created_destination',
            'description' => "Created destination: {$destination->name}",
            'model_type' => Destination::class,
            'model_id' => $destination->id,
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => 'Destination created.',
            'destination' => $destination->load('images'),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(
            Destination::with(['category', 'municipality', 'barangay', 'images'])->findOrFail($id)
        );
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $destination = Destination::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category_id' => 'sometimes|exists:categories,id',
            'municipality_id' => 'sometimes|exists:municipalities,id',
            'barangay_id' => 'sometimes|exists:barangays,id',
            'address' => 'sometimes|string|max:500',
            'latitude' => 'sometimes|numeric|between:-90,90',
            'longitude' => 'sometimes|numeric|between:-180,180',
            'operating_hours' => 'nullable|string|max:255',
            'entrance_fee' => 'nullable|numeric|min:0',
            'contact_number' => 'nullable|string|max:20',
            'status' => 'sometimes|in:draft,published,archived',
        ]);

        $destination->update($validated);

        // Handle new images
        if ($request->hasFile('images')) {
            $maxOrder = $destination->images()->max('sort_order') ?? -1;
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store("destinations/{$destination->id}", 'public');
                DestinationImage::create([
                    'destination_id' => $destination->id,
                    'image_path' => $path,
                    'thumbnail_path' => $path,
                    'sort_order' => $maxOrder + $index + 1,
                    'is_primary' => false,
                ]);
            }
        }

        return response()->json(['message' => 'Destination updated.', 'destination' => $destination->fresh('images')]);
    }

    public function destroy(int $id): JsonResponse
    {
        $destination = Destination::findOrFail($id);

        // Delete images from storage
        foreach ($destination->images as $img) {
            Storage::disk('public')->delete($img->image_path);
        }

        $destination->delete();

        return response()->json(['message' => 'Destination deleted.']);
    }
}