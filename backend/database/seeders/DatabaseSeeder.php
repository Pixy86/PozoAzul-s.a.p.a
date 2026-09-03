<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Shed;
use App\Models\Flock;
use App\Models\FeedInventory;
use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Crear Usuarios de los 4 roles
        User::updateOrCreate(['email' => 'directivo@pozoazul.com'], [
            'name' => 'Luis Directivo',
            'password' => bcrypt('password'),
            'role' => UserRole::DIRECTIVO->value,
        ]);

        User::updateOrCreate(['email' => 'ejecutivo@pozoazul.com'], [
            'name' => 'Maria Ejecutiva',
            'password' => bcrypt('password'),
            'role' => UserRole::EJECUTIVO->value,
        ]);

        User::updateOrCreate(['email' => 'operativo@pozoazul.com'], [
            'name' => 'Carlos Operativo',
            'password' => bcrypt('password'),
            'role' => UserRole::OPERATIVO->value,
        ]);

        User::updateOrCreate(['email' => 'administrativo@pozoazul.com'], [
            'name' => 'Ana Administrativa',
            'password' => bcrypt('password'),
            'role' => UserRole::ADMINISTRATIVO->value,
        ]);

        // 2. Crear Galpones (Sheds)
        $shed1 = Shed::create([
            'name' => 'Galpón Norte 01',
            'zone' => 'Norte',
            'capacity' => 10000,
            'status' => 'ACTIVE',
        ]);

        $shed2 = Shed::create([
            'name' => 'Galpón Sur 02',
            'zone' => 'Sur',
            'capacity' => 12000,
            'status' => 'SANITARY_VOID',
            'last_emptied_date' => Carbon::now()->subDays(5), // Hace 5 días (no cumple vacío de 14 días)
        ]);

        $shed3 = Shed::create([
            'name' => 'Galpón Este 03',
            'zone' => 'Este',
            'capacity' => 8000,
            'status' => 'SANITARY_VOID',
            'last_emptied_date' => Carbon::now()->subDays(20), // Hace 20 días (ya cumplió vacío de 14 días)
        ]);

        // 3. Crear Lotes (Flocks) en galpones activos
        Flock::create([
            'shed_id' => $shed1->id,
            'start_date' => Carbon::now()->subMonths(3),
            'initial_birds' => 8500,
            'current_birds' => 8420,
            'status' => 'ACTIVE',
        ]);

        // 4. Crear Alimentos (Feed Inventories)
        FeedInventory::create([
            'name' => 'Maíz Molido Extra',
            'zone' => 'A',
            'sacks_stock' => 150,
            'kg_stock' => 150 * 40,
            'entry_date' => Carbon::now()->subDays(10),
            'expiration_date' => Carbon::now()->addMonths(6),
        ]);

        FeedInventory::create([
            'name' => 'Soya Premium Alimento',
            'zone' => 'A',
            'sacks_stock' => 90,
            'kg_stock' => 90 * 40,
            'entry_date' => Carbon::now()->subDays(12),
            'expiration_date' => Carbon::now()->addMonths(5),
        ]);

        FeedInventory::create([
            'name' => 'Núcleo Vitamínico Aves',
            'zone' => 'B',
            'sacks_stock' => 25,
            'kg_stock' => 25 * 40,
            'entry_date' => Carbon::now()->subDays(4),
            'expiration_date' => Carbon::now()->addMonths(8),
        ]);

        FeedInventory::create([
            'name' => 'Alimento Peletizado Crecimiento',
            'zone' => 'C',
            'sacks_stock' => 200,
            'kg_stock' => 200 * 40,
            'entry_date' => Carbon::now()->subDays(15),
            'expiration_date' => Carbon::now()->addMonths(4),
        ]);
    }
}
