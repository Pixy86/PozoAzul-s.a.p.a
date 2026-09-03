<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'zone', 'capacity', 'status', 'last_emptied_date'])]
class Shed extends Model
{
    /** @use HasFactory<\Database\Factories\ShedFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'last_emptied_date' => 'date',
        ];
    }

    public function flocks(): HasMany
    {
        return $this->hasMany(Flock::class);
    }
}
