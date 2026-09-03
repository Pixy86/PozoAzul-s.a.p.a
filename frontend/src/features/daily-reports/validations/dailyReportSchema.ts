import { z } from 'zod';

export const dailyReportSchema = z.object({
  flock_id: z.coerce.number().int().min(1, 'El lote es obligatorio.'),
  report_date: z.string().min(1, 'La fecha del reporte es obligatoria.'),
  
  bird_movement: z.object({
    initial_birds: z.coerce.number().int().min(0, 'La cantidad inicial no puede ser negativa.'),
    mortality: z.coerce.number().int().min(0, 'La mortalidad no puede ser negativa.'),
    entries: z.coerce.number().int().min(0, 'Los ingresos no pueden ser negativos.'),
  }),
  
  egg_production: z.object({
    jumbo: z.coerce.number().int().min(0, 'No puede ser negativo.'),
    large: z.coerce.number().int().min(0, 'No puede ser negativo.'),
    medium: z.coerce.number().int().min(0, 'No puede ser negativo.'),
    small: z.coerce.number().int().min(0, 'No puede ser negativo.'),
    broken: z.coerce.number().int().min(0, 'No puede ser negativo.'),
  }),
  
  feed_consumptions: z.array(
    z.object({
      feed_inventory_id: z.coerce.number().int().min(1, 'Debe seleccionar un alimento.'),
      quantity_sacks_consumed: z.coerce.number().int().min(1, 'Debe ser al menos 1 saco.'),
    })
  ).default([]),
  
  dispatch: z.object({
    boxes_shipped: z.coerce.number().int().min(0, 'No puede ser negativo.'),
    live_birds_shipped: z.coerce.number().int().min(0, 'No puede ser negativo.'),
    manure_sacks: z.coerce.number().int().min(0, 'No puede ser negativo.'),
    invoice_number: z.string().min(1, 'El número de nota de entrega es obligatorio.'),
  }),
  
  health: z.object({
    vaccines_applied: z.string().optional().refine(
      (val) => !val || val.trim().length === 0 || val.trim().length >= 5,
      { message: 'Las vacunas aplicadas deben tener al menos 5 caracteres si se especifica.' }
    ),
    infrastructure_notes: z.string().optional(),
  }),
});

export type DailyReportFormValues = z.infer<typeof dailyReportSchema>;
