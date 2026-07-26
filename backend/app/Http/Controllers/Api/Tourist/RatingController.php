<?php

namespace App\Http\Controllers\Api\Tourist;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use App\Models\Destination;
use App\Models\Accommodation;
use App\Models\FoodBeverage;
use App\Models\RetailProduct;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    private array $typeMap = [
        'destination' => Destination::class,
        'accommodation' => Accommodation::class,
        'food_beverage' => FoodBeverage::class,
        'retail_product' => RetailProduct::class,
    ];

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'rateable_type' => 'required|in:destination,accommodation,food_beverage,retail_product',
            'rateable_id' => 'required|integer',
            'score' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $modelClass = $this->typeMap[$validated['rateable_type']];
        $modelClass::findOrFail($validated['rateable_id']);

        $existing = Rating::where('user_id', $request->user()->id)
            ->where('rateable_type', $modelClass)
            ->where('rateable_id', $validated['rateable_id'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already rated this item.'], 422);
        }

        $rating = Rating::create([
            'user_id' => $request->user()->id,
            'rateable_type' => $modelClass,
            'rateable_id' => $validated['rateable_id'],
            'score' => $validated['score'],
            'comment' => $validated['comment'],
        ]);

        // Recalculate average
        $model = $modelClass::find($validated['rateable_id']);
        if (method_exists($model, 'recalculateRating')) {
            $model->recalculateRating();
        } else {
            $model->average_rating = $model->ratings()->avg('score') ?? 0;
            $model->total_reviews = $model->ratings()->count();
            $model->save();
        }

        return response()->json(['message' => 'Rating submitted.', 'rating' => $rating->load('user')], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $rating = Rating::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'score' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $rating->update($validated);

        // Recalculate
        $model = $rating->rateable;
        if ($model) {
            $model->average_rating = $model->ratings()->avg('score') ?? 0;
            $model->save();
        }

        return response()->json(['message' => 'Rating updated.', 'rating' => $rating]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $rating = Rating::where('user_id', $request->user()->id)->findOrFail($id);
        $model = $rating->rateable;
        $rating->delete();

        if ($model) {
            $model->average_rating = $model->ratings()->avg('score') ?? 0;
            $model->total_reviews = $model->ratings()->count();
            $model->save();
        }

        return response()->json(['message' => 'Rating deleted.']);
    }

    public function myReviews(Request $request): JsonResponse
    {
        $reviews = Rating::where('user_id', $request->user()->id)
            ->with('rateable:id,name')
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json($reviews);
    }
}