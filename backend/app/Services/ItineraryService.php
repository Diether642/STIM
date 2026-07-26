<?php

namespace App\Services;

use App\Models\Destination;
use App\Models\Itinerary;
use App\Models\ItineraryItem;
use App\Models\User;
use Illuminate\Support\Collection;

class ItineraryService
{
    public function __construct(
        private ClaudeAIService $claude,
        private GoogleMapsService $maps
    ) {
    }

    public function generate(User $user, array $preferences): Itinerary
    {
        $destinations = $this->getEligibleDestinations($preferences);

        if ($destinations->count() < 3) {
            throw new \Exception('Not enough destinations available for your preferences. Try broadening your interests.');
        }

        $distanceMatrix = $this->maps->getDistanceMatrix($destinations);
        $prompt = $this->buildPrompt($preferences, $destinations, $distanceMatrix);
        $aiResponse = $this->claude->generate($prompt);
        $parsedItinerary = $this->parseAIResponse($aiResponse, $destinations);

        $itinerary = Itinerary::create([
            'user_id' => $user->id,
            'title' => $parsedItinerary['title'],
            'num_days' => $preferences['num_days'],
            'interests' => $preferences['interests'],
            'travel_pace' => $preferences['travel_pace'],
            'budget' => $preferences['budget'],
            'ai_response_raw' => $aiResponse,
            'total_distance_km' => $this->calculateTotalDistance($parsedItinerary),
        ]);

        foreach ($parsedItinerary['days'] as $day) {
            foreach ($day['stops'] as $stop) {
                ItineraryItem::create([
                    'itinerary_id' => $itinerary->id,
                    'destination_id' => $stop['destination_id'],
                    'day_number' => $day['day_number'],
                    'sequence' => $stop['sequence'],
                    'time_slot' => $stop['time_slot'],
                    'duration_minutes' => $stop['duration_minutes'],
                    'travel_time_from_prev' => $stop['travel_time_from_prev'] ?? null,
                    'distance_from_prev_km' => $stop['distance_from_prev_km'] ?? null,
                    'notes' => $stop['notes'] ?? null,
                ]);
            }
        }

        return $itinerary;
    }

    private function getEligibleDestinations(array $preferences): Collection
    {
        $interestCategoryMap = [
            'nature' => [1, 2, 3, 7, 8],
            'culture' => [4, 5],
            'food' => [13, 14, 15, 16],
            'adventure' => [2, 3, 7, 8],
            'shopping' => [17, 18, 19, 20],
            'relaxation' => [1, 6, 8],
        ];

        $categoryIds = [];
        foreach ($preferences['interests'] as $interest) {
            if (isset($interestCategoryMap[$interest])) {
                $categoryIds = array_merge($categoryIds, $interestCategoryMap[$interest]);
            }
        }
        $categoryIds = array_unique($categoryIds);

        $query = Destination::published()
            ->where('municipality_id', 1)
            ->whereIn('category_id', $categoryIds);

        if (!empty($preferences['preferred_destinations'])) {
            $preferred = $preferences['preferred_destinations'];
            $query->orWhere(function ($q) use ($preferred) {
                $q->whereIn('id', $preferred)->where('status', 'published');
            });
        }

        return $query->with('category:id,name')
            ->select('id', 'name', 'description', 'category_id', 'latitude', 'longitude', 'operating_hours', 'entrance_fee')
            ->get();
    }

    private function buildPrompt(array $preferences, Collection $destinations, array $distanceMatrix): string
    {
        $travelPace = $preferences['travel_pace'];
        $numDays = $preferences['num_days'];
        $budget = $preferences['budget'];
        $interestsFormatted = $this->formatInterests($preferences['interests']);

        $stopsPerDay = match ($travelPace) {
            'relaxed' => '3 to 4',
            'moderate' => '4 to 5',
            'packed' => '5 to 7',
            default => '4 to 5',
        };

        $startTime = match ($travelPace) {
            'relaxed' => '8:30 AM',
            'moderate' => '7:30 AM',
            'packed' => '6:30 AM',
            default => '7:30 AM',
        };

        $destinationsList = $destinations->map(function ($d) {
            $hours = $d->operating_hours ?? 'Open';
            $fee = $d->entrance_fee ?? '0';
            return "ID:{$d->id} | {$d->name} | Category: {$d->category->name} | Coords: {$d->latitude},{$d->longitude} | Hours: {$hours} | Fee: PHP {$fee}";
        })->implode("\n");

        $matrixText = '';
        foreach ($distanceMatrix as $entry) {
            $from = $entry['from'];
            $to = $entry['to'];
            $dur = $entry['duration_min'];
            $dist = $entry['distance_km'];
            $matrixText .= "From ID:{$from} to ID:{$to}: {$dur} min, {$dist} km\n";
        }

        $prompt = "You are a local travel itinerary planner for Bulan, Sorsogon, Philippines.\n\n";
        $prompt .= "Create a {$numDays}-day travel itinerary.\n\n";
        $prompt .= "TOURIST PREFERENCES:\n";
        $prompt .= "- Duration: {$numDays} day(s)\n";
        $prompt .= "- Interests: {$interestsFormatted}\n";
        $prompt .= "- Travel Pace: {$travelPace} ({$stopsPerDay} stops per day)\n";
        $prompt .= "- Budget: {$budget}\n\n";
        $prompt .= "AVAILABLE VERIFIED DESTINATIONS (use ONLY these, reference by ID):\n";
        $prompt .= "{$destinationsList}\n\n";
        $prompt .= "TRAVEL TIME BETWEEN DESTINATIONS:\n";
        $prompt .= "{$matrixText}\n";
        $prompt .= "RULES:\n";
        $prompt .= "1. Use ONLY destination IDs from the list above. Never invent locations.\n";
        $prompt .= "2. Schedule {$stopsPerDay} stops per day.\n";
        $prompt .= "3. Group nearby destinations on the same day to minimize travel time.\n";
        $prompt .= "4. Start each day at {$startTime}.\n";
        $prompt .= "5. Allow 45 to 90 minutes per destination.\n";
        $prompt .= "6. Include logical meal breaks if food destinations are in the list.\n";
        $prompt .= "7. End each day by 6:00 PM for relaxed, 7:00 PM for moderate, 8:00 PM for packed.\n\n";
        $prompt .= "RESPOND WITH ONLY THIS JSON (no other text):\n";
        $prompt .= "{\n";
        $prompt .= '  "title": "A short descriptive title for this itinerary",' . "\n";
        $prompt .= '  "days": [' . "\n";
        $prompt .= "    {\n";
        $prompt .= '      "day_number": 1,' . "\n";
        $prompt .= '      "stops": [' . "\n";
        $prompt .= "        {\n";
        $prompt .= '          "destination_id": 123,' . "\n";
        $prompt .= '          "sequence": 1,' . "\n";
        $prompt .= '          "time_slot": "8:30 AM",' . "\n";
        $prompt .= '          "duration_minutes": 60,' . "\n";
        $prompt .= '          "notes": "Brief activity suggestion"' . "\n";
        $prompt .= "        }\n";
        $prompt .= "      ]\n";
        $prompt .= "    }\n";
        $prompt .= "  ]\n";
        $prompt .= "}\n";

        return $prompt;
    }

    private function parseAIResponse(string $response, Collection $destinations): array
    {
        $json = $response;
        if (preg_match('/```(?:json)?\s*([\s\S]*?)```/', $response, $matches)) {
            $json = $matches[1];
        }

        $parsed = json_decode(trim($json), true);

        if (!$parsed || !isset($parsed['days'])) {
            throw new \Exception('AI returned invalid itinerary format.');
        }

        $validIds = $destinations->pluck('id')->toArray();

        foreach ($parsed['days'] as &$day) {
            foreach ($day['stops'] as $idx => &$stop) {
                if (!in_array($stop['destination_id'], $validIds)) {
                    unset($day['stops'][$idx]);
                    continue;
                }
                $stop['sequence'] = $stop['sequence'] ?? ($idx + 1);
                $stop['travel_time_from_prev'] = null;
                $stop['distance_from_prev_km'] = null;
            }
            $day['stops'] = array_values($day['stops']);
        }

        foreach ($parsed['days'] as &$day) {
            $prevDest = null;
            foreach ($day['stops'] as &$stop) {
                $dest = $destinations->firstWhere('id', $stop['destination_id']);
                if ($prevDest && $dest) {
                    $distance = $this->haversineDistance(
                        $prevDest->latitude,
                        $prevDest->longitude,
                        $dest->latitude,
                        $dest->longitude
                    );
                    $stop['distance_from_prev_km'] = round($distance, 2);
                    $stop['travel_time_from_prev'] = (int) ceil(($distance / 30) * 60);
                }
                $prevDest = $dest;
            }
        }

        return $parsed;
    }

    private function haversineDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $earthRadius * $c;
    }

    private function calculateTotalDistance(array $itinerary): float
    {
        $total = 0;
        foreach ($itinerary['days'] as $day) {
            foreach ($day['stops'] as $stop) {
                $total += $stop['distance_from_prev_km'] ?? 0;
            }
        }
        return round($total, 2);
    }

    private function formatInterests(array $interests): string
    {
        return implode(', ', array_map('ucfirst', $interests));
    }
}