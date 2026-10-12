<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'PC Siap Pakai (Pre-built PC)',
                'slug' => 'pc-siap-pakai',
                'type' => 'prebuilt',
                'description' => 'PC Gaming, Office, dan Workstation yang sudah dirakit lengkap dan siap langsung digunakan.',
                'icon' => 'desktop',
                'is_active' => true,
            ],
            [
                'name' => 'Processor (CPU)',
                'slug' => 'processor',
                'type' => 'part',
                'description' => 'Prosesor Intel Core dan AMD Ryzen untuk performa komputasi maksimal.',
                'icon' => 'cpu',
                'is_active' => true,
            ],
            [
                'name' => 'Motherboard',
                'slug' => 'motherboard',
                'type' => 'part',
                'description' => 'Papan induk berbagai form factor (ATX, Micro-ATX, Mini-ITX) untuk socket Intel & AMD.',
                'icon' => 'motherboard',
                'is_active' => true,
            ],
            [
                'name' => 'Kartu Grafis (GPU)',
                'slug' => 'kartu-grafis',
                'type' => 'part',
                'description' => 'VGA Card NVIDIA GeForce RTX dan AMD Radeon untuk rendering grafis dan gaming.',
                'icon' => 'gpu',
                'is_active' => true,
            ],
            [
                'name' => 'Memori (RAM)',
                'slug' => 'ram',
                'type' => 'part',
                'description' => 'Modul RAM DDR4 & DDR5 berkecepatan tinggi dengan atau tanpa RGB.',
                'icon' => 'memory',
                'is_active' => true,
            ],
            [
                'name' => 'Penyimpanan (SSD / HDD)',
                'slug' => 'storage',
                'type' => 'part',
                'description' => 'Media penyimpanan NVMe M.2 SSD PCIe 4.0/5.0 dan SATA HDD berkapasitas besar.',
                'icon' => 'hard-drive',
                'is_active' => true,
            ],
            [
                'name' => 'Power Supply Unit (PSU)',
                'slug' => 'power-supply',
                'type' => 'part',
                'description' => 'Catu daya efisien bersertifikasi 80 Plus Bronze hingga Titanium modular.',
                'icon' => 'zap',
                'is_active' => true,
            ],
            [
                'name' => 'Casing PC',
                'slug' => 'casing',
                'type' => 'part',
                'description' => 'Casing komputer dengan airflow optimal dan panel tempered glass.',
                'icon' => 'box',
                'is_active' => true,
            ],
            [
                'name' => 'Pendingin PC (Cooler)',
                'slug' => 'cooler',
                'type' => 'part',
                'description' => 'AIO Liquid Cooler dan Air Cooler untuk menjaga suhu komponen tetap dingin.',
                'icon' => 'wind',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::updateOrCreate(
                ['slug' => $categoryData['slug']],
                $categoryData
            );
        }
    }
}
