<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('roles')->insert([
            ['name' => 'admin', 'description' => 'Tourism Office Administrator', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'tourist', 'description' => 'Registered Tourist', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'business_owner', 'description' => 'Business Establishment Owner', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
