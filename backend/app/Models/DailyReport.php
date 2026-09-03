<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['flock_id', 'user_id', 'report_date'])]
class DailyReport extends Model
{
    /** @use HasFactory<\Database\Factories\DailyReportFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'report_date' => 'date',
        ];
    }

    public function flock(): BelongsTo
    {
        return $this->belongsTo(Flock::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function birdMovement(): HasOne
    {
        return $this->hasOne(BirdMovement::class);
    }

    public function eggProduction(): HasOne
    {
        return $this->hasOne(EggProduction::class);
    }

    public function dailyDispatch(): HasOne
    {
        return $this->hasOne(DailyDispatch::class);
    }

    public function healthLog(): HasOne
    {
        return $this->hasOne(HealthLog::class);
    }

    public function feedInventories(): BelongsToMany
    {
        return $this->belongsToMany(FeedInventory::class, 'daily_report_feed_inventory')
            ->withPivot('quantity_sacks_consumed')
            ->withTimestamps();
    }
}
