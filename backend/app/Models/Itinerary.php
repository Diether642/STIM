<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Itinerary extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'num_days',
        'interests',
        'travel_pace',
        'budget',
        'start_date',
        'ai_response_raw',
        'total_distance_km',
    ];

    protected function casts(): array
    {
        return [
            'interests' => 'array',
            'start_date' => 'date',
            'total_distance_km' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(ItineraryItem::class)->orderBy('day_number')->orderBy('sequence');
    }
}