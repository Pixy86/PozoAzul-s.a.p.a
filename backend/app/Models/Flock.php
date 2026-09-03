<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['shed_id', 'start_date', 'initial_birds', 'current_birds', 'status'])]
class Flock extends Model
{
    /** @use HasFactory<\Database\Factories\FlockFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
        ];
    }

    public function shed(): BelongsTo
    {
        return $this->belongsTo(Shed::class);
    }
}
