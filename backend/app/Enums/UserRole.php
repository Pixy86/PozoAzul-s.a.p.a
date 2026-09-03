<?php

declare(strict_types=1);

namespace App\Enums;

enum UserRole: string
{
    case DIRECTIVO = 'DIRECTIVO';
    case EJECUTIVO = 'EJECUTIVO';
    case OPERATIVO = 'OPERATIVO';
    case ADMINISTRATIVO = 'ADMINISTRATIVO';
}
