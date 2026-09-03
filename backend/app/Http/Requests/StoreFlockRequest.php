<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Shed;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Contracts\Validation\Validator;

class StoreFlockRequest extends FormRequest
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
            'shed_id' => ['required', 'exists:sheds,id'],
            'start_date' => ['required', 'date'],
            'initial_birds' => ['required', 'integer', 'min:1'],
            'status' => ['nullable', 'string', 'in:ACTIVE,DEPLETED'],
        ];
    }

    /**
     * Add after-validation hook for sanitary void check.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $shedId = $this->input('shed_id');
            if (!$shedId) {
                return;
            }

            $shed = Shed::find($shedId);
            if ($shed && $shed->status === 'SANITARY_VOID') {
                $lastEmptiedDate = $shed->last_emptied_date;
                if ($lastEmptiedDate) {
                    $lastEmptied = Carbon::parse($lastEmptiedDate);
                    $startDate = Carbon::parse($this->input('start_date'));

                    if ($startDate->diffInDays($lastEmptied) < 14) {
                        $validator->errors()->add(
                            'shed_id',
                            'El galpón no ha cumplido los 14 días de vacío sanitario obligatorios.'
                        );
                    }
                }
            }
        });
    }

    /**
     * Custom messages for validation.
     */
    public function messages(): array
    {
        return [
            'shed_id.required' => 'El galpón es obligatorio.',
            'shed_id.exists' => 'El galpón seleccionado no existe.',
            'start_date.required' => 'La fecha de inicio es obligatoria.',
            'start_date.date' => 'La fecha de inicio debe ser una fecha válida.',
            'initial_birds.required' => 'La cantidad inicial de aves es obligatoria.',
            'initial_birds.integer' => 'La cantidad de aves debe ser un número entero.',
            'initial_birds.min' => 'La cantidad de aves debe ser al menos 1.',
        ];
    }
}
