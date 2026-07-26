<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Destination::published()
            ->with(['category', 'municipality', 'barangay', 'images']);

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('municipality_id')) {
            $query->where('municipality_id', $request->municipality_id);
        }

        if ($request->filled('barangay_id')) {
            $query->where('barangay_id', $request->barangay_id);
        }

        if ($request->filled('q')) {
            $search = $request->q;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort', 'name');
        $sortDir = $request->get('dir', 'asc');
        $allowedSorts = ['name', 'average_rating', 'view_count', 'created_at'];

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDir === 'desc' ? 'desc' : 'asc');
        }

        $perPage = min($request->get('per_page', 12), 50);
        $destinations = $query->paginate($perPage);

        return response()->json($destinations);
    }

    public function show(int $id): JsonResponse
    {
        $destination = Destination::published()
            ->with(['category', 'municipality', 'barangay', 'images', 'ratings.user'])
            ->findOrFail($id);

        $destination->increment('view_count');

        // Get nearby destinations (within ~5km radius)
        $nearby = Destination::published()
            ->where('id', '!=', $id)
            ->where('municipality_id', $destination->municipality_id)
            ->select('id', 'name', 'category_id', 'latitude', 'longitude', 'average_rating')
            ->with('category:id,name,icon')
            ->limit(6)
            ->get();

        return response()->json([
            'destination' => $destination,
            'nearby' => $nearby,
        ]);
    }
}