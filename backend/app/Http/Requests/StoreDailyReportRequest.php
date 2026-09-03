<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDailyReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'flock_id' => ['required', 'exists:flocks,id'],
            'report_date' => ['required', 'date'],
            
            // 1. Movimiento de Aves
            'bird_movement' => ['required', 'array'],
            'bird_movement.initial_birds' => ['required', 'integer', 'min:0'],
            'bird_movement.mortality' => ['required', 'integer', 'min:0'],
            'bird_movement.entries' => ['required', 'integer', 'min:0'],

            // 2. Producción
            'egg_production' => ['required', 'array'],
            'egg_production.jumbo' => ['required', 'integer', 'min:0'],
            'egg_production.large' => ['required', 'integer', 'min:0'],
            'egg_production.medium' => ['required', 'integer', 'min:0'],
            'egg_production.small' => ['required', 'integer', 'min:0'],
            'egg_production.broken' => ['required', 'integer', 'min:0'],

            // 3. Consumo de Alimento
            'feed_consumptions' => ['nullable', 'array'],
            'feed_consumptions.*.feed_inventory_id' => ['required', 'exists:feed_inventories,id'],
            'feed_consumptions.*.quantity_sacks_consumed' => ['required', 'integer', 'min:1'],

            // 4. Despachos (Logística)
            'dispatch' => ['required', 'array'],
            'dispatch.boxes_shipped' => ['required', 'integer', 'min:0'],
            'dispatch.live_birds_shipped' => ['required', 'integer', 'min:0'],
            'dispatch.manure_sacks' => ['required', 'integer', 'min:0'],
            'dispatch.invoice_number' => ['required', 'string', 'max:255'],

            // 5. Sanidad
            'health' => ['required', 'array'],
            'health.vaccines_applied' => ['nullable', 'string', 'min:5'],
            'health.infrastructure_notes' => ['nullable', 'string'],
        ];
    }

    /**
     * Custom messages for validation.
     */
    public function messages(): array
    {
        return [
            'flock_id.required' => 'El lote es obligatorio.',
            'flock_id.exists' => 'El lote seleccionado no existe.',
            'report_date.required' => 'La fecha del reporte es obligatoria.',
            'report_date.date' => 'La fecha debe ser una fecha válida.',
            
            'bird_movement.required' => 'La sección de movimiento de aves es obligatoria.',
            'bird_movement.initial_birds.required' => 'La cantidad inicial de aves es obligatoria.',
            'bird_movement.initial_birds.integer' => 'La cantidad inicial de aves debe ser un número entero.',
            'bird_movement.initial_birds.min' => 'La cantidad inicial de aves no puede ser negativa.',
            'bird_movement.mortality.required' => 'La mortalidad de aves es obligatoria.',
            'bird_movement.mortality.integer' => 'La mortalidad debe ser un número entero.',
            'bird_movement.mortality.min' => 'La mortalidad no puede ser negativa.',
            'bird_movement.entries.required' => 'Los ingresos de aves son obligatorios.',
            'bird_movement.entries.integer' => 'Los ingresos deben ser un número entero.',
            'bird_movement.entries.min' => 'Los ingresos no pueden ser negativos.',

            'egg_production.required' => 'La sección de producción de huevos es obligatoria.',
            'egg_production.jumbo.min' => 'La cantidad de huevos Jumbo no puede ser negativa.',
            'egg_production.large.min' => 'La cantidad de huevos Grandes no puede ser negativa.',
            'egg_production.medium.min' => 'La cantidad de huevos Medianos no puede ser negativa.',
            'egg_production.small.min' => 'La cantidad de huevos Pequeños no puede ser negativa.',
            'egg_production.broken.min' => 'La cantidad de huevos Rotos no puede ser negativa.',

            'feed_consumptions.*.feed_inventory_id.required' => 'El lote de inventario de alimento es obligatorio.',
            'feed_consumptions.*.feed_inventory_id.exists' => 'El lote de inventario de alimento seleccionado no existe.',
            'feed_consumptions.*.quantity_sacks_consumed.required' => 'La cantidad de sacos consumidos es obligatoria.',
            'feed_consumptions.*.quantity_sacks_consumed.integer' => 'La cantidad de sacos debe ser un número entero.',
            'feed_consumptions.*.quantity_sacks_consumed.min' => 'La cantidad de sacos consumidos debe ser al menos 1.',

            'dispatch.required' => 'La sección de despachos es obligatoria.',
            'dispatch.boxes_shipped.min' => 'La cantidad de cajas despachadas no puede ser negativa.',
            'dispatch.live_birds_shipped.min' => 'La cantidad de aves vivas despachadas no puede ser negativa.',
            'dispatch.manure_sacks.min' => 'La cantidad de sacos de gallinaza no puede ser negativa.',
            'dispatch.invoice_number.required' => 'El número de nota de entrega es obligatorio.',

            'health.required' => 'La sección de sanidad es obligatoria.',
            'health.vaccines_applied.min' => 'Las vacunas aplicadas deben tener al menos 5 caracteres.',
        ];
    }
}
