<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Event::published()->with('municipality');

        if ($request->get('upcoming', false)) {
            $query->upcoming();
        }

        $events = $query->orderBy('start_date', 'desc')
            ->paginate($request->get('per_page', 10));

        return response()->json($events);
    }

    public function show(int $id): JsonResponse
    {
        $event = Event::published()->with('municipality')->findOrFail($id);
        return response()->json($event);
    }
}