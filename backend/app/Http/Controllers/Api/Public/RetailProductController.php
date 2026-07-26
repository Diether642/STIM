<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\RetailProduct;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RetailProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = RetailProduct::approved()
            ->with(['municipality', 'barangay', 'images']);

        if ($request->filled('municipality_id')) {
            $query->where('municipality_id', $request->municipality_id);
        }

        if ($request->filled('product_type')) {
            $query->where('product_type', $request->product_type);
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
        $product = RetailProduct::approved()
            ->with(['municipality', 'barangay', 'images', 'ratings.user'])
            ->findOrFail($id);

        $product->increment('view_count');
        return response()->json($product);
    }
}