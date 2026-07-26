<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MunicipalitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('municipalities')->insert([
            ['name' => 'Bulan', 'description' => 'Municipality of Bulan, the pilot area for Sosogon system implementation.', 'latitude' => 12.6744, 'longitude' => 123.8756, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Sorsogon City', 'description' => 'Capital city of the Province of Sorsogon.', 'latitude' => 12.9742, 'longitude' => 124.0049, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Donsol', 'description' => 'Known for whale shark interactions.', 'latitude' => 12.9083, 'longitude' => 123.5981, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Matnog', 'description' => 'Gateway to the Visayas with beautiful islands.', 'latitude' => 12.5833, 'longitude' => 124.0833, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Barcelona', 'description' => 'Known for its churches and natural springs.', 'latitude' => 12.8694, 'longitude' => 124.1417, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
