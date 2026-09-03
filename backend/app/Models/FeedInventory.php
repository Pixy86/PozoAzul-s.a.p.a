<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['name', 'zone', 'sacks_stock', 'kg_stock', 'entry_date', 'expiration_date'])]
class FeedInventory extends Model
{
    /** @use HasFactory<\Database\Factories\FeedInventoryFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'kg_stock' => 'decimal:2',
            'entry_date' => 'date',
            'expiration_date' => 'date',
        ];
    }

    public function dailyReports(): BelongsToMany
    {
        return $this->belongsToMany(DailyReport::class, 'daily_report_feed_inventory')
            ->withPivot('quantity_sacks_consumed')
            ->withTimestamps();
    }
}
