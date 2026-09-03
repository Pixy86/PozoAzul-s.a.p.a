<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['daily_report_id', 'jumbo', 'large', 'medium', 'small', 'broken', 'total_boxes'])]
class EggProduction extends Model
{
    /** @use HasFactory<\Database\Factories\EggProductionFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'total_boxes' => 'decimal:2',
        ];
    }

    public function dailyReport(): BelongsTo
    {
        return $this->belongsTo(DailyReport::class);
    }
}
