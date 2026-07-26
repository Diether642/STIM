<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItineraryItem extends Model
{
    protected $fillable = [
        'itinerary_id',
        'destination_id',
        'day_number',
        'sequence',
        'time_slot',
        'duration_minutes',
        'travel_time_from_prev',
        'distance_from_prev_km',
        'notes',
    ];

    public function itinerary(): BelongsTo
    {
        return $this->belongsTo(Itinerary::class);
    }
    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }
}