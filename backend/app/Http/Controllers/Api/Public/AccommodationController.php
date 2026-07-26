<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Accommodation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccommodationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Accommodation::approved()
            ->with(['municipality', 'barangay', 'images']);

        if ($request->filled('municipality_id')) {
            $query->where('municipality_id', $request->municipality_id);
        }

        if ($request->filled('barangay_id')) {
            $query->where('barangay_id', $request->barangay_id);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('price_range')) {
            $query->where('price_range', $request->price_range);
        }

        if ($request->filled('q')) {
            $search = $request->q;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $perPage = min($request->get('per_page', 12), 50);
        return response()->json($query->orderBy('name')->paginate($perPage));
    }

    public function show(int $id): JsonResponse
    {
        $accommodation = Accommodation::approved()
            ->with(['municipality', 'barangay', 'images', 'ratings.user'])
            ->findOrFail($id);

        $accommodation->increment('view_count');

        return response()->json($accommodation);
    }
}