<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['daily_report_id', 'boxes_shipped', 'live_birds_shipped', 'manure_sacks', 'invoice_number'])]
class DailyDispatch extends Model
{
    /** @use HasFactory<\Database\Factories\DailyDispatchFactory> */
    use HasFactory;

    public function dailyReport(): BelongsTo
    {
        return $this->belongsTo(DailyReport::class);
    }
}
