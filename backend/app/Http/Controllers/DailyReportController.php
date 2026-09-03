<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreDailyReportRequest;
use App\Models\DailyReport;
use App\Models\Flock;
use App\Models\FeedInventory;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DailyReportController extends Controller
{
    /**
     * Store a newly created daily report.
     */
    public function store(StoreDailyReportRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $userId = null;
        if (auth()->check()) {
            $userId = auth()->id();
        } else {
            // Buscar primer usuario o crear uno por defecto para evitar fallos de llave foránea
            $user = User::first();
            if (!$user) {
                $user = User::create([
                    'name' => 'Usuario por Defecto',
                    'email' => 'admin@pozoazul.com',
                    'password' => bcrypt('password'),
                    'role' => UserRole::OPERATIVO->value,
                ]);
            }
            $userId = $user->id;
        }

        $flock = Flock::findOrFail($validated['flock_id']);

        $birdMovementData = $validated['bird_movement'];
        $eggProductionData = $validated['egg_production'];
        $feedConsumptions = $validated['feed_consumptions'] ?? [];
        $dispatchData = $validated['dispatch'];
        $healthData = $validated['health'];

        // 1. Calcular final_birds
        $finalBirds = $birdMovementData['initial_birds'] - $birdMovementData['mortality'] + $birdMovementData['entries'];
        if ($finalBirds < 0) {
            throw ValidationException::withMessages([
                'bird_movement.mortality' => ['La mortalidad no puede superar la cantidad de aves disponibles.'],
            ]);
        }

        // 2. Calcular total_boxes (Total huevos / 360)
        $totalEggs = $eggProductionData['jumbo'] + 
                     $eggProductionData['large'] + 
                     $eggProductionData['medium'] + 
                     $eggProductionData['small'] + 
                     $eggProductionData['broken'];
        $totalBoxes = round($totalEggs / 360, 2);

        DB::beginTransaction();

        try {
            // Guardar reporte principal
            $dailyReport = DailyReport::create([
                'flock_id' => $flock->id,
                'user_id' => $userId,
                'report_date' => $validated['report_date'],
            ]);

            // Guardar movimiento de aves
            $dailyReport->birdMovement()->create([
                'initial_birds' => $birdMovementData['initial_birds'],
                'mortality' => $birdMovementData['mortality'],
                'entries' => $birdMovementData['entries'],
                'final_birds' => $finalBirds,
            ]);

            // Actualizar lote
            $flock->current_birds = $finalBirds;
            if ($finalBirds === 0) {
                $flock->status = 'DEPLETED';
            }
            $flock->save();

            // Guardar producción
            $dailyReport->eggProduction()->create(array_merge($eggProductionData, [
                'total_boxes' => $totalBoxes,
            ]));

            // Procesar consumos de alimento y descontar stock
            foreach ($feedConsumptions as $consumption) {
                $feedInventory = FeedInventory::findOrFail($consumption['feed_inventory_id']);
                $sacksToConsume = (int) $consumption['quantity_sacks_consumed'];
                $kgToConsume = $sacksToConsume * 40;

                if ($feedInventory->sacks_stock < $sacksToConsume) {
                    throw ValidationException::withMessages([
                        'feed_consumptions' => ["Stock insuficiente de sacos para el alimento: {$feedInventory->name}."],
                    ]);
                }

                // Descontar
                $feedInventory->sacks_stock -= $sacksToConsume;
                // Evitar stock negativo en kg
                $feedInventory->kg_stock = max(0, floatval($feedInventory->kg_stock) - $kgToConsume);
                $feedInventory->save();

                // Registrar en la tabla pivote
                $dailyReport->feedInventories()->attach($feedInventory->id, [
                    'quantity_sacks_consumed' => $sacksToConsume,
                ]);
            }

            // Guardar despachos
            $dailyReport->dailyDispatch()->create($dispatchData);

            // Guardar sanidad
            $dailyReport->healthLog()->create($healthData);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'data' => $dailyReport->load(['birdMovement', 'eggProduction', 'dailyDispatch', 'healthLog', 'feedInventories']),
                'message' => 'Reporte diario registrado exitosamente.',
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
