<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BusinessSubmission extends Model
{
    protected $fillable = [
        'user_id',
        'business_name',
        'type',
        'description',
        'address',
        'municipality_id',
        'barangay_id',
        'latitude',
        'longitude',
        'contact_number',
        'operating_hours',
        'business_permit_path',
        'status',
        'admin_notes',
        'reviewed_by',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return ['reviewed_at' => 'datetime', 'latitude' => 'decimal:7', 'longitude' => 'decimal:7'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function municipality(): BelongsTo
    {
        return $this->belongsTo(Municipality::class);
    }
    public function barangay(): BelongsTo
    {
        return $this->belongsTo(Barangay::class);
    }
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}