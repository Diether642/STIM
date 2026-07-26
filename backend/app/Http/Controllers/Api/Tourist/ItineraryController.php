<?php

namespace App\Http\Controllers\Api\Tourist;

use App\Http\Controllers\Controller;
use App\Models\Itinerary;
use App\Services\ItineraryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ItineraryController extends Controller
{
    public function __construct(private ItineraryService $itineraryService)
    {
    }

    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'num_days' => 'required|integer|min:1|max:7',
            'interests' => 'required|array|min:1',
            // Added 'history' to the allowed interests
            'interests.*' => 'string|in:nature,culture,food,adventure,shopping,relaxation,history',
            'travel_pace' => 'required|in:relaxed,moderate,packed',
            // Added 'medium' to the allowed budgets
            'budget' => 'required|in:budget,moderate,luxury,medium',
            'preferred_destinations' => 'nullable|array',
            'preferred_destinations.*' => 'integer|exists:destinations,id',
        ]);

        try {
            $itinerary = $this->itineraryService->generate(
                user: $request->user(),
                preferences: $validated
            );

            return response()->json([
                'message' => 'Itinerary generated successfully.',
                'itinerary' => $itinerary->load('items.destination.images', 'items.destination.category'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to generate itinerary.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function index(Request $request): JsonResponse
    {
        $itineraries = $request->user()
            ->itineraries()
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json($itineraries);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $itinerary = $request->user()
            ->itineraries()
            ->with(['items.destination.images', 'items.destination.category', 'items.destination.municipality'])
            ->findOrFail($id);

        return response()->json($itinerary);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $itinerary = $request->user()->itineraries()->findOrFail($id);
        $itinerary->delete();

        return response()->json(['message' => 'Itinerary deleted.']);
    }
}