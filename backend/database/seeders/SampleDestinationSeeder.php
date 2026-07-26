<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SampleDestinationSeeder extends Seeder
{
    public function run(): void
    {
        $destinations = [
            [
                'name' => 'Bulan Beach',
                'description' => 'A beautiful public beach in the heart of Bulan municipality with fine gray sand, calm waters, and stunning sunset views. Popular among locals and tourists for swimming, picnics, and relaxation. The beach stretches along the coast offering panoramic ocean views and gentle waves suitable for all ages.',
                'category_id' => 1,
                'municipality_id' => 1,
                'barangay_id' => 1,
                'address' => 'Coastal area, Zone 1, Bulan, Sorsogon',
                'latitude' => 12.6720,
                'longitude' => 123.8780,
                'operating_hours' => 'Open 24 hours',
                'entrance_fee' => 0,
                'status' => 'published',
                'created_by' => 1,
                'image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
            ],
            [
                'name' => 'San Bernardino Island',
                'description' => 'A picturesque island off the coast of Bulan featuring crystal-clear waters, white sand beaches, and rich marine biodiversity. Ideal for snorkeling, island hopping, and nature photography. The island is accessible by boat and offers untouched natural beauty with coral formations visible from the shore.',
                'category_id' => 8,
                'municipality_id' => 1,
                'barangay_id' => 5,
                'address' => 'Off the coast of Bulan, Sorsogon',
                'latitude' => 12.6500,
                'longitude' => 123.9200,
                'operating_hours' => '6:00 AM - 5:00 PM',
                'entrance_fee' => 50.00,
                'status' => 'published',
                'created_by' => 1,
                'image' => 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80',
            ],
            [
                'name' => 'Bulan Church (St. John the Baptist Parish)',
                'description' => 'A historic Catholic church built during the Spanish colonial era. The church features baroque architecture with intricate stone carvings and serves as a spiritual and cultural landmark of Bulan. Mass is held daily and the church grounds include a peaceful garden area.',
                'category_id' => 5,
                'municipality_id' => 1,
                'barangay_id' => 2,
                'address' => 'Zone 2 Poblacion, Bulan, Sorsogon',
                'latitude' => 12.6748,
                'longitude' => 123.8752,
                'operating_hours' => '5:00 AM - 7:00 PM',
                'entrance_fee' => 0,
                'status' => 'published',
                'created_by' => 1,
                'image' => 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80',
            ],
            [
                'name' => 'Bulan Town Plaza',
                'description' => 'The central park of Bulan municipality surrounded by local government buildings and commercial establishments. A popular gathering place for community events, leisure walks, and cultural celebrations. The plaza features mature trees providing shade and benches for visitors.',
                'category_id' => 6,
                'municipality_id' => 1,
                'barangay_id' => 3,
                'address' => 'Zone 3 Poblacion, Bulan, Sorsogon',
                'latitude' => 12.6745,
                'longitude' => 123.8755,
                'operating_hours' => 'Open 24 hours',
                'entrance_fee' => 0,
                'status' => 'published',
                'created_by' => 1,
                'image' => 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80',
            ],
            [
                'name' => 'Dancalan Beach',
                'description' => 'A hidden gem beach in Bulan with dark volcanic sand and calm coves. Known for its tranquil atmosphere, fresh seafood vendors, and beautiful rock formations along the shore. The beach is less crowded than tourist hotspots making it ideal for peaceful getaways.',
                'category_id' => 1,
                'municipality_id' => 1,
                'barangay_id' => 10,
                'address' => 'Bonga, Bulan, Sorsogon',
                'latitude' => 12.6600,
                'longitude' => 123.8900,
                'operating_hours' => 'Open 24 hours',
                'entrance_fee' => 20.00,
                'status' => 'published',
                'created_by' => 1,
                'image' => 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
            ],
            [
                'name' => 'Mount Jormajan',
                'description' => 'A scenic mountain trail offering panoramic views of Bulan and the surrounding seas. Popular for day hikes and nature treks with diverse flora and fauna along the path. The summit provides a breathtaking 360-degree view of the coastline and neighboring municipalities.',
                'category_id' => 2,
                'municipality_id' => 1,
                'barangay_id' => 15,
                'address' => 'Calpi, Bulan, Sorsogon',
                'latitude' => 12.6900,
                'longitude' => 123.8600,
                'operating_hours' => '5:00 AM - 4:00 PM',
                'entrance_fee' => 30.00,
                'status' => 'published',
                'created_by' => 1,
                'image' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
            ],
            [
                'name' => 'Aroroy Falls',
                'description' => 'A multi-tiered waterfall tucked in the lush rainforest of Bulan. The falls cascade into natural pools perfect for swimming. Surrounded by tropical vegetation, it offers a refreshing escape from the heat and a chance to experience the biodiversity of Sorsogon.',
                'category_id' => 3,
                'municipality_id' => 1,
                'barangay_id' => 18,
                'address' => 'Danao, Bulan, Sorsogon',
                'latitude' => 12.6850,
                'longitude' => 123.8650,
                'operating_hours' => '6:00 AM - 5:00 PM',
                'entrance_fee' => 25.00,
                'status' => 'published',
                'created_by' => 1,
                'image' => 'https://images.unsplash.com/photo-1432405972618-c6b0cfba1a30?w=800&q=80',
            ],
            [
                'name' => 'Bulan Eco-Park',
                'description' => 'An eco-tourism site dedicated to conservation and environmental education. Features nature trails, native tree species, birdwatching areas, and a small butterfly garden. The park promotes sustainable tourism while offering visitors a peaceful natural setting.',
                'category_id' => 7,
                'municipality_id' => 1,
                'barangay_id' => 20,
                'address' => 'Guadalupe, Bulan, Sorsogon',
                'latitude' => 12.6780,
                'longitude' => 123.8700,
                'operating_hours' => '7:00 AM - 5:00 PM',
                'entrance_fee' => 15.00,
                'status' => 'published',
                'created_by' => 1,
                'image' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
            ],
        ];

        foreach ($destinations as $dest) {
            $imageUrl = $dest['image'];
            unset($dest['image']);

            $dest['created_at'] = now();
            $dest['updated_at'] = now();

            $id = DB::table('destinations')->insertGetId($dest);

            // Insert image record with external URL
            DB::table('destination_images')->insert([
                'destination_id' => $id,
                'image_path' => $imageUrl,
                'thumbnail_path' => $imageUrl,
                'alt_text' => $dest['name'],
                'sort_order' => 0,
                'is_primary' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}