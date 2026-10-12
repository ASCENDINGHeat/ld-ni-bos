<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all()->keyBy('slug');

        $products = [
            // ==========================================
            // Kategori 1: PC Siap Pakai (Pre-built PC)
            // ==========================================
            [
                'category_slug' => 'pc-siap-pakai',
                'name' => 'PC Gaming Beast Ultra - Intel Core i7-14700K & RTX 4070 Ti SUPER',
                'slug' => 'pc-gaming-beast-ultra-i7-14700k-rtx-4070-ti-super',
                'type' => 'prebuilt',
                'brand' => 'LD Custom Builds',
                'price' => 34500000,
                'stock' => 5,
                'description' => 'PC gaming high-end siap pakai yang dirancang untuk performa gaming 1440p dan 4K rata kanan serta rendering konten berat tanpa hambatan. Dilengkapi sistem pendingin cair 360mm dan airflow casing optimal.',
                'specifications' => [
                    'tipe_sistem' => 'Pre-built High-End Gaming & Workstation',
                    'processor' => 'Intel Core i7-14700K (20 Cores, 28 Threads, up to 5.6 GHz)',
                    'motherboard' => 'MSI MAG Z790 TOMAHAWK WIFI DDR5',
                    'kartu_grafis' => 'ASUS TUF Gaming GeForce RTX 4070 Ti SUPER 16GB GDDR6X',
                    'ram' => 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz CL30',
                    'storage' => 'Samsung 990 PRO 2TB PCIe 4.0 NVMe M.2 SSD',
                    'power_supply' => 'Corsair RM850e 850W 80 Plus Gold Fully Modular',
                    'pendingin' => 'DeepCool LT720 360mm Liquid CPU Cooler',
                    'casing' => 'NZXT H5 Flow RGB Tempered Glass Black',
                    'sistem_operasi' => 'Windows 11 Pro 64-bit Activated',
                    'garansi' => '2 Tahun Garansi Servis & Perakitan + Garansi Resmi Tiap Komponen',
                ],
                'image_url' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop',
                'images' => [
                    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop',
                ],
                'is_active' => true,
                'weight_grams' => 12500,
            ],
            [
                'category_slug' => 'pc-siap-pakai',
                'name' => 'PC Gaming Esports Pro - AMD Ryzen 5 7600 & RTX 4060',
                'slug' => 'pc-gaming-esports-pro-ryzen-5-7600-rtx-4060',
                'type' => 'prebuilt',
                'brand' => 'LD Custom Builds',
                'price' => 16250000,
                'stock' => 10,
                'description' => 'Paket PC Gaming siap pakai terbaik untuk kompetisi Esports (Valorant, CS2, Dota 2, Apex Legends) pada refresh rate 165Hz+ dengan efisiensi daya luar biasa.',
                'specifications' => [
                    'tipe_sistem' => 'Pre-built Esports & Mid-Range Gaming',
                    'processor' => 'AMD Ryzen 5 7600 (6 Cores, 12 Threads, up to 5.1 GHz AM5)',
                    'motherboard' => 'ASUS PRIME B650M-A WIFI II DDR5',
                    'kartu_grafis' => 'MSI GeForce RTX 4060 VENTUS 2X 8GB GDDR6',
                    'ram' => 'TeamGroup T-Force Delta RGB 16GB (2x8GB) DDR5 5600MHz',
                    'storage' => 'Kingston NV2 1TB PCIe 4.0 NVMe SSD',
                    'power_supply' => 'FSP HV PRO 650W 80 Plus Bronze',
                    'pendingin' => 'Thermalright Assassin King 120 SE ARGB Air Cooler',
                    'casing' => 'Montech AIR 100 ARGB Micro-ATX Black',
                    'sistem_operasi' => 'Windows 11 Home 64-bit Activated',
                    'garansi' => '2 Tahun Garansi Servis Toko + Garansi Distributor Resmi',
                ],
                'image_url' => 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop',
                'images' => [
                    'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop',
                ],
                'is_active' => true,
                'weight_grams' => 9500,
            ],
            [
                'category_slug' => 'pc-siap-pakai',
                'name' => 'PC Office & Business Pro - Intel Core i5-12400',
                'slug' => 'pc-office-business-pro-i5-12400',
                'type' => 'prebuilt',
                'brand' => 'LD Custom Builds',
                'price' => 7850000,
                'stock' => 12,
                'description' => 'PC kantor dan produktivitas harian yang hening, hemat daya, dan responsif untuk olah dokumen, presentasi, browsing multi-tab, dan meeting virtual.',
                'specifications' => [
                    'tipe_sistem' => 'Pre-built Office & Business Workstation',
                    'processor' => 'Intel Core i5-12400 (6 Cores, 12 Threads, UHD Graphics 730)',
                    'motherboard' => 'ASRock H610M-HDV/M.2 DDR4',
                    'kartu_grafis' => 'Integrated Intel UHD Graphics 730',
                    'ram' => '16GB (2x8GB) DDR4 3200MHz',
                    'storage' => '512GB M.2 NVMe SSD',
                    'power_supply' => 'Aerocool United Power 500W 80 Plus White',
                    'pendingin' => 'Intel Stock Cooler',
                    'casing' => 'Paradox Gaming Mini Tower Case',
                    'sistem_operasi' => 'Windows 11 Home 64-bit',
                    'garansi' => '1 Tahun Garansi Toko & Servis',
                ],
                'image_url' => 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop',
                'images' => [
                    'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop',
                ],
                'is_active' => true,
                'weight_grams' => 6000,
            ],

            // ==========================================
            // Kategori 2: Part PC (Dijual Terpisah)
            // ==========================================

            // Processors
            [
                'category_slug' => 'processor',
                'name' => 'AMD Ryzen 7 7800X3D Processor AM5',
                'slug' => 'amd-ryzen-7-7800x3d-processor-am5',
                'type' => 'part',
                'brand' => 'AMD',
                'price' => 6850000,
                'stock' => 8,
                'description' => 'Prosesor gaming tercepat di dunia saat ini berkat teknologi 3D V-Cache berkapasitas 96MB L3 cache, menawarkan FPS tertinggi di berbagai game kompetitif dan AAA.',
                'specifications' => [
                    'socket' => 'AM5',
                    'jumlah_core' => 8,
                    'jumlah_thread' => 16,
                    'base_clock' => '4.2 GHz',
                    'boost_clock' => 'Up to 5.0 GHz',
                    'total_l3_cache' => '96 MB (AMD 3D V-Cache)',
                    'tdp' => '120W',
                    'dukungan_memori' => 'DDR5 hingga 5200MHz (EXPO Supported)',
                    'grafis_terintegrasi' => 'AMD Radeon Graphics (2 CU)',
                    'garansi' => '3 Tahun Garansi Resmi Distributor AMD Indonesia',
                ],
                'image_url' => 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop',
                'images' => [
                    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop',
                ],
                'is_active' => true,
                'weight_grams' => 450,
            ],
            [
                'category_slug' => 'processor',
                'name' => 'Intel Core i7-14700K 20-Core Processor LGA1700',
                'slug' => 'intel-core-i7-14700k-processor-lga1700',
                'type' => 'part',
                'brand' => 'Intel',
                'price' => 6990000,
                'stock' => 12,
                'description' => 'Prosesor generasi ke-14 Raptor Lake Refresh dengan konfigurasi 20 Core (8 P-Core + 12 E-Core), sempurna untuk gaming dan video rendering intensif.',
                'specifications' => [
                    'socket' => 'LGA1700',
                    'jumlah_core' => '20 (8 P-Cores + 12 E-Cores)',
                    'jumlah_thread' => 28,
                    'max_turbo_frequency' => 'Up to 5.6 GHz',
                    'intel_smart_cache' => '33 MB L3',
                    'tdp_daya' => '125W Base / 253W Max Turbo',
                    'dukungan_memori' => 'DDR5 5600 MT/s & DDR4 3200 MT/s',
                    'garansi' => '3 Tahun Garansi Resmi Intel Indonesia',
                ],
                'image_url' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop',
                'images' => [
                    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop',
                ],
                'is_active' => true,
                'weight_grams' => 450,
            ],

            // GPU
            [
                'category_slug' => 'kartu-grafis',
                'name' => 'ASUS TUF Gaming GeForce RTX 4070 Ti SUPER 16GB GDDR6X',
                'slug' => 'asus-tuf-gaming-rtx-4070-ti-super-16gb',
                'type' => 'part',
                'brand' => 'ASUS',
                'price' => 15800000,
                'stock' => 6,
                'description' => 'VGA Card bertenaga arsitektur NVIDIA Ada Lovelace dengan VRAM 16GB GDDR6X dan pendinginan 3 kipas Axial-tech berdaya tahan militer TUF Gaming.',
                'specifications' => [
                    'graphic_engine' => 'NVIDIA GeForce RTX 4070 Ti SUPER',
                    'vram' => '16GB GDDR6X',
                    'memory_bus' => '256-bit',
                    'cuda_cores' => '8448',
                    'boost_clock' => '2640 MHz (OC Mode)',
                    'interface' => 'PCI Express 4.0 16x',
                    'output_display' => '2x HDMI 2.1a, 3x DisplayPort 1.4a',
                    'rekomendasi_psu' => '750 Watt',
                    'konektor_daya' => '1x 16-pin (12VHPWR)',
                    'garansi' => '3 Tahun Garansi Resmi ASUS Indonesia',
                ],
                'image_url' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop',
                'images' => [
                    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop',
                ],
                'is_active' => true,
                'weight_grams' => 1800,
            ],
            [
                'category_slug' => 'kartu-grafis',
                'name' => 'MSI GeForce RTX 4060 VENTUS 2X Black 8G OC',
                'slug' => 'msi-geforce-rtx-4060-ventus-2x-black-8g-oc',
                'type' => 'part',
                'brand' => 'MSI',
                'price' => 5250000,
                'stock' => 15,
                'description' => 'Kartu grafis hemat daya dan ringkas dengan dual fan TORX Fan 4.0, ideal untuk resolusi 1080p gaming dengan dukungan teknologi DLSS 3 Frame Generation.',
                'specifications' => [
                    'graphic_engine' => 'NVIDIA GeForce RTX 4060',
                    'vram' => '8GB GDDR6',
                    'memory_bus' => '128-bit',
                    'boost_clock' => '2490 MHz',
                    'interface' => 'PCI Express 4.0 x8',
                    'rekomendasi_psu' => '550 Watt',
                    'garansi' => '3 Tahun Garansi Resmi MSI Indonesia',
                ],
                'image_url' => 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop',
                'images' => [
                    'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop',
                ],
                'is_active' => true,
                'weight_grams' => 900,
            ],

            // Motherboard
            [
                'category_slug' => 'motherboard',
                'name' => 'ASUS TUF GAMING B650-PLUS WIFI AMD AM5 ATX',
                'slug' => 'asus-tuf-gaming-b650-plus-wifi',
                'type' => 'part',
                'brand' => 'ASUS',
                'price' => 3850000,
                'stock' => 9,
                'description' => 'Motherboard tangguh dengan 12+2 DrMOS power stages, PCIe 5.0 M.2 slot, WiFi 6, dan Realtek 2.5Gb Ethernet untuk socket AMD Ryzen AM5.',
                'specifications' => [
                    'socket' => 'AMD Socket AM5',
                    'chipset' => 'AMD B650',
                    'form_factor' => 'ATX (30.5 cm x 24.4 cm)',
                    'slot_ram' => '4x DDR5 DIMM (Max 192GB, up to 7600+ MHz OC)',
                    'slot_ekspansi' => '1x PCIe 4.0/3.0 x16, 1x PCIe 4.0/3.0 x16 (x4 mode)',
                    'slot_m2' => '1x M.2 PCIe 5.0 x4, 2x M.2 PCIe 4.0 x4',
                    'konektivitas' => 'WiFi 6 + Bluetooth 5.2, 2.5Gb Ethernet',
                    'garansi' => '3 Tahun Garansi Resmi ASUS Indonesia',
                ],
                'image_url' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
                'images' => [
                    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
                ],
                'is_active' => true,
                'weight_grams' => 1400,
            ],

            // RAM
            [
                'category_slug' => 'ram',
                'name' => 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz CL30',
                'slug' => 'corsair-vengeance-rgb-ddr5-32gb-2x16gb-6000mhz-cl30',
                'type' => 'part',
                'brand' => 'Corsair',
                'price' => 2250000,
                'stock' => 20,
                'description' => 'Memori DDR5 berkecepatan tinggi dengan timing ketat CL30-36-36-76, didukung pencahayaan RGB dynamic ten-zone dan profil Intel XMP 3.0 / AMD EXPO.',
                'specifications' => [
                    'kapasitas' => '32GB (2 x 16GB Kit)',
                    'tipe_memori' => 'DDR5',
                    'kecepatan' => '6000 MHz',
                    'latensi_tested' => 'CL30-36-36-76',
                    'tegangan_volt' => '1.40V',
                    'fitur_khusus' => 'Dynamic Ten-Zone RGB Lighting, AMD EXPO & Intel XMP 3.0 Support',
                    'garansi' => 'Limited Lifetime Warranty (Seumur Hidup)',
                ],
                'image_url' => 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&auto=format&fit=crop',
                'images' => [
                    'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&auto=format&fit=crop',
                ],
                'is_active' => true,
                'weight_grams' => 200,
            ],

            // Storage
            [
                'category_slug' => 'storage',
                'name' => 'Samsung 990 PRO NVMe M.2 SSD 2TB PCIe 4.0',
                'slug' => 'samsung-990-pro-nvme-m2-ssd-2tb-pcie-40',
                'type' => 'part',
                'brand' => 'Samsung',
                'price' => 2950000,
                'stock' => 14,
                'description' => 'SSD NVMe PCIe 4.0 tercepat dari Samsung dengan kecepatan baca sekuensial hingga 7450 MB/s dan tulis 6900 MB/s, dirancang untuk gamer dan kreator profesional.',
                'specifications' => [
                    'kapasitas' => '2 TB (2000 GB)',
                    'form_factor' => 'M.2 (2280)',
                    'interface' => 'PCIe Gen 4.0 x4, NVMe 2.0',
                    'kecepatan_baca_sekuensial' => 'Up to 7,450 MB/s',
                    'kecepatan_tulis_sekuensial' => 'Up to 6,900 MB/s',
                    'tbw' => '1,200 TBW',
                    'garansi' => '5 Tahun Garansi Resmi Samsung Indonesia',
                ],
                'image_url' => 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop',
                'images' => [
                    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop',
                ],
                'is_active' => true,
                'weight_grams' => 80,
            ],

            // Power Supply
            [
                'category_slug' => 'power-supply',
                'name' => 'Corsair RM850e 850W 80 Plus Gold Fully Modular ATX 3.0',
                'slug' => 'corsair-rm850e-850w-80-plus-gold-fully-modular',
                'type' => 'part',
                'brand' => 'Corsair',
                'price' => 2100000,
                'stock' => 11,
                'description' => 'Catu daya ultra-quiet dengan sertifikasi 80 PLUS Gold dan Cybenetics Platinum, kepatuhan penuh ATX 3.0 dan PCIe 5.0 dengan kabel 12VHPWR bawaan.',
                'specifications' => [
                    'daya_output' => '850 Watt',
                    'efisiensi' => '80 PLUS Gold Certified',
                    'modular' => 'Fully Modular',
                    'standar' => 'ATX 3.0 & PCIe 5.0 Ready (12VHPWR Included)',
                    'ukuran_fan' => '120mm Rifle Bearing Fan with Zero RPM mode',
                    'proteksi' => 'OVP, OCP, OTP, SCP, UVP, OPP',
                    'garansi' => '7 Tahun Garansi Resmi Corsair',
                ],
                'image_url' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop',
                'images' => [
                    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop',
                ],
                'is_active' => true,
                'weight_grams' => 2200,
            ],

            // Casing
            [
                'category_slug' => 'casing',
                'name' => 'NZXT H5 Flow RGB Compact Mid-Tower Case Black',
                'slug' => 'nzxt-h5-flow-rgb-compact-mid-tower-case-black',
                'type' => 'part',
                'brand' => 'NZXT',
                'price' => 1450000,
                'stock' => 18,
                'description' => 'Casing Mid-Tower dengan panel mesh depan berlubang untuk sirkulasi udara maksimal, kipas bawah khusus pendingin GPU, dan panel tempered glass elegan.',
                'specifications' => [
                    'motherboard_support' => 'ATX, Micro-ATX, Mini-ITX',
                    'material' => 'SGCC Steel, Tempered Glass',
                    'kipas_bawaan' => '2x 140mm F140 RGB Core fans (Front), 2x 120mm fans',
                    'dukungan_radiator' => 'Hingga 280mm di depan, 240mm di atas',
                    'maks_panjang_gpu' => 'Hingga 365 mm',
                    'maks_tinggi_cpu_cooler' => 'Hingga 165 mm',
                    'port_io' => '1x USB 3.2 Gen 1 Type-A, 1x USB 3.2 Gen 2 Type-C, Headset Audio Jack',
                    'garansi' => '2 Tahun Garansi Resmi',
                ],
                'image_url' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop',
                'images' => [
                    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop',
                ],
                'is_active' => true,
                'weight_grams' => 7010,
            ],

            // Cooler
            [
                'category_slug' => 'cooler',
                'name' => 'DeepCool LT720 360mm High-Performance AIO Liquid Cooler',
                'slug' => 'deepcool-lt720-360mm-liquid-cpu-cooler',
                'type' => 'part',
                'brand' => 'DeepCool',
                'price' => 1890000,
                'stock' => 7,
                'description' => 'Liquid cooler all-in-one 360mm dengan pompa generasi ke-4 DeepCool, desain blok multidimensi geometric infinity mirror ARGB, dan kipas FK120 bertenaga tinggi.',
                'specifications' => [
                    'ukuran_radiator' => '402 x 120 x 27 mm (Aluminium)',
                    'jumlah_kipas' => '3x 120mm FK120 PWM Fans',
                    'kecepatan_kipas' => '500 - 2250 RPM +/- 10%',
                    'airflow_kipas' => '85.85 CFM',
                    'kebisingan_kipas' => '<= 32.9 dB(A)',
                    'kompatibilitas_socket' => 'Intel LGA2066/2011-v3/2011/1700/1200/1151/1150/1155, AMD sTRX4/sTR4/AM5/AM4',
                    'pencahayaan' => 'Addressable RGB LED (Pump block infinity mirror)',
                    'garansi' => '5 Tahun Garansi Resmi DeepCool',
                ],
                'image_url' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop',
                'images' => [
                    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop',
                ],
                'is_active' => true,
                'weight_grams' => 1850,
            ],
        ];

        foreach ($products as $data) {
            $categorySlug = $data['category_slug'];
            unset($data['category_slug']);

            $category = $categories[$categorySlug] ?? Category::where('slug', $categorySlug)->first();

            if ($category) {
                $data['category_id'] = $category->id;
                Product::updateOrCreate(
                    ['slug' => $data['slug']],
                    $data
                );
            }
        }

        // Seed products from PC Builder mock data
        $mocksPath = resource_path('js/mocks/products.json');
        if (file_exists($mocksPath)) {
            $mockProducts = json_decode(file_get_contents($mocksPath), true) ?: [];
            $categorySlugMap = [
                'processor' => 'processor',
                'motherboard' => 'motherboard',
                'vga' => 'kartu-grafis',
                'ram' => 'ram',
                'storage' => 'storage',
                'psu' => 'power-supply',
                'casing' => 'casing',
            ];

            foreach ($mockProducts as $mock) {
                $categorySlug = $categorySlugMap[$mock['category']] ?? $mock['category'];
                $category = $categories[$categorySlug] ?? Category::where('slug', $categorySlug)->first();
                if (! $category) {
                    continue;
                }

                $stock = ($mock['inStock'] ?? true) ? (str_contains(strtolower($mock['stock'] ?? ''), 'terbatas') ? 3 : 15) : 0;

                $specs = $mock['technicalSpecs'] ?? [];
                if (! empty($mock['cpuSocket'])) {
                    $specs['cpuSocket'] = $mock['cpuSocket'];
                    $specs['socket'] = $mock['cpuSocket'];
                }
                if (isset($mock['powerDraw'])) {
                    $specs['powerDraw'] = $mock['powerDraw'];
                }
                if (isset($mock['psuCapacity'])) {
                    $specs['psuCapacity'] = $mock['psuCapacity'];
                }
                if (! empty($mock['ramFormFactor'])) {
                    $specs['ramFormFactor'] = $mock['ramFormFactor'];
                    $specs['tipe_memori'] = $mock['ramFormFactor'];
                }
                if (! empty($mock['chipset'])) {
                    $specs['chipset'] = $mock['chipset'];
                }
                if (! empty($mock['tdp'])) {
                    $specs['tdp'] = $mock['tdp'];
                }
                if (! empty($mock['warranty'])) {
                    $specs['warranty'] = $mock['warranty'];
                }

                $images = [];
                if (! empty($mock['gallery']) && is_array($mock['gallery'])) {
                    foreach ($mock['gallery'] as $g) {
                        if (! empty($g['url'])) {
                            $images[] = $g['url'];
                        }
                    }
                }
                if (empty($images) && ! empty($mock['image'])) {
                    $images[] = $mock['image'];
                }

                Product::updateOrCreate(
                    ['slug' => $mock['slug']],
                    [
                        'category_id' => $category->id,
                        'name' => $mock['name'],
                        'type' => 'part',
                        'brand' => $mock['brand'] ?? 'Official',
                        'price' => $mock['price'],
                        'stock' => $stock,
                        'description' => $mock['description'] ?? '',
                        'specifications' => $specs,
                        'image_url' => $mock['image'] ?? null,
                        'images' => $images,
                        'is_active' => true,
                        'weight_grams' => 600,
                    ]
                );
            }
        }
    }
}
