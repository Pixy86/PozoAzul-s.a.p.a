<?php

declare(strict_types=1);

namespace App\Services;

class MillingService
{
    /**
     * Calculate milling yield and determine if an alert should be triggered.
     *
     * @param float $rawMaterialKg
     * @param float $pelletizedKg
     * @return array{alert: bool, merma_percentage: float}
     */
    public function calculateYield(float $rawMaterialKg, float $pelletizedKg): array
    {
        if ($rawMaterialKg <= 0) {
            return [
                'alert' => false,
                'merma_percentage' => 0.0,
            ];
        }

        $mermaPercentage = (($rawMaterialKg - $pelletizedKg) / $rawMaterialKg) * 100;
        
        // Redondear a 2 decimales para la consistencia
        $mermaPercentage = round($mermaPercentage, 2);

        return [
            'alert' => $mermaPercentage > 10.00,
            'merma_percentage' => $mermaPercentage,
        ];
    }
}
