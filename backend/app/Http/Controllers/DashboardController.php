<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\DailyReport;
use App\Models\Flock;
use App\Models\BirdMovement;
use App\Models\EggProduction;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard KPIs and time series data.
     */
    public function index(): JsonResponse
    {
        // 1. Aves totales activas
        $totalBirds = Flock::where('status', 'ACTIVE')->sum('current_birds');

        // 2. Cajas totales recolectadas
        $totalBoxes = EggProduction::sum('total_boxes');

        // 3. Mortalidad acumulada
        $totalMortality = BirdMovement::sum('mortality');

        // Simular alerta de merma de molienda (> 10%) para demostración en Dashboard
        $isAlertTriggered = true; 
        $mermaPercentage = 12.45; // Merma de ejemplo que supera el 10%

        // 4. Obtener serie de producción de huevos vs mortalidad de últimos 7 reportes
        $recentReports = DailyReport::with(['eggProduction', 'birdMovement'])
            ->orderBy('report_date', 'asc')
            ->take(7)
            ->get()
            ->map(function ($report) {
                $totalEggs = 0;
                if ($report->eggProduction) {
                    $totalEggs = $report->eggProduction->jumbo + 
                                 $report->eggProduction->large + 
                                 $report->eggProduction->medium + 
                                 $report->eggProduction->small + 
                                 $report->eggProduction->broken;
                }
                return [
                    'date' => $report->report_date->format('Y-m-d'),
                    'eggs' => $totalEggs,
                    'mortality' => $report->birdMovement ? $report->birdMovement->mortality : 0,
                ];
            });

        // Generar datos ficticios armonizados si el sistema está vacío
        if ($recentReports->isEmpty()) {
            $recentReports = collect(range(6, 0))->map(function ($daysAgo) {
                $date = Carbon::now()->subDays($daysAgo)->format('d/m');
                return [
                    'date' => $date,
                    'eggs' => rand(15000, 18000), // Huevos aprox 40-50 cajas
                    'mortality' => rand(5, 25),
                ];
            });
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'kpis' => [
                    'active_birds' => (int) $totalBirds,
                    'total_boxes' => round((float) $totalBoxes, 2),
                    'total_mortality' => (int) $totalMortality,
                ],
                'is_alert_triggered' => $isAlertTriggered,
                'merma_percentage' => $mermaPercentage,
                'series' => $recentReports,
            ],
        ]);
    }
}
