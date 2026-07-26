<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BarangaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bulanId = 1;
        $barangays = [
            'Zone 1 (Poblacion)',
            'Zone 2 (Poblacion)',
            'Zone 3 (Poblacion)',
            'Zone 4 (Poblacion)',
            'Zone 5 (Poblacion)',
            'Zone 6 (Poblacion)',
            'Zone 7 (Poblacion)',
            'Zone 8 (Poblacion)',
            'Aquino',
            'Beguin',
            'Bonga',
            'Butag',
            'Cadandanan',
            'Calomagon',
            'Calpi',
            'Cocok-Cocok',
            'Daganas',
            'Danao',
            'Gate',
            'Guadalupe',
            'Guruyan',
            'Jamorawon',
            'Lajong',
            'Libertad',
            'Lura',
            'Mabini',
            'Манга',
            'Nasuje',
            'Obrero',
            'Otavi',
            'Palale',
            'Quezon',
            'Rawis',
            'Salvacion',
            'San Francisco',
            'San Isidro',
            'San Juan',
            'San Rafael',
            'San Ramon',
            'San Vicente',
            'Santa Remedios',
            'Sigad',
            'Somagongsong',
            'Taromata',
            'Tinanogan',
            'Togawe',
        ];

        $records = [];
        foreach ($barangays as $name) {
            $records[] = [
                'municipality_id' => $bulanId,
                'name' => $name,
                'latitude' => 12.6744 + (rand(-500, 500) / 10000),
                'longitude' => 123.8756 + (rand(-500, 500) / 10000),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('barangays')->insert($records);
    }
}
