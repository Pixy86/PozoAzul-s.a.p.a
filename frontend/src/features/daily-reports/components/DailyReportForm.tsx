import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../../config/axios';
import { dailyReportSchema } from '../validations/dailyReportSchema';
import type { DailyReportFormValues } from '../validations/dailyReportSchema';

interface Flock {
  id: number;
  shed_id: number;
  current_birds: number;
  shed?: {
    name: string;
  };
}

interface FeedInventory {
  id: number;
  name: string;
  zone: string;
  sacks_stock: number;
}

export default function DailyReportForm() {
  const [flocks, setFlocks] = useState<Flock[]>([]);
  const [feedInventories, setFeedInventories] = useState<FeedInventory[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DailyReportFormValues>({
    resolver: zodResolver(dailyReportSchema) as any,
    defaultValues: {
      flock_id: undefined,
      report_date: new Date().toISOString().split('T')[0],
      bird_movement: {
        initial_birds: 0,
        mortality: 0,
        entries: 0,
      },
      egg_production: {
        jumbo: 0,
        large: 0,
        medium: 0,
        small: 0,
        broken: 0,
      },
      feed_consumptions: [],
      dispatch: {
        boxes_shipped: 0,
        live_birds_shipped: 0,
        manure_sacks: 0,
        invoice_number: '',
      },
      health: {
        vaccines_applied: '',
        infrastructure_notes: '',
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'feed_consumptions',
  });

  const selectedFlockId = watch('flock_id');
  const watchMortality = watch('bird_movement.mortality') || 0;
  const watchEntries = watch('bird_movement.entries') || 0;
  const watchInitialBirds = watch('bird_movement.initial_birds') || 0;

  // Cargar lotes y alimentos desde la API
  useEffect(() => {
    async function loadData() {
      try {
        const [flocksRes, feedRes] = await Promise.all([
          api.get('/flocks').catch(() => ({ data: { data: [] } })),
          api.get('/feed-inventories').catch(() => ({ data: { data: [] } })),
        ]);
        
        setFlocks(flocksRes.data.data || []);
        setFeedInventories(feedRes.data.data || []);
      } catch (err) {
        console.error('Error cargando catálogos de base de datos:', err);
      } finally {
        setLoadingOptions(false);
      }
    }
    loadData();
  }, []);

  // Actualizar aves iniciales automáticamente al seleccionar el Lote
  useEffect(() => {
    if (selectedFlockId && flocks.length > 0) {
      const flock = flocks.find((f) => f.id === Number(selectedFlockId));
      if (flock) {
        setValue('bird_movement.initial_birds', flock.current_birds);
      }
    }
  }, [selectedFlockId, flocks, setValue]);

  // Calcular final_birds calculado localmente para mostrar en UI
  const calculatedFinalBirds = Math.max(0, Number(watchInitialBirds) - Number(watchMortality) + Number(watchEntries));

  // Calcular cajas estimadas locales para mostrar en UI (Huevos / 360)
  const watchJumbo = watch('egg_production.jumbo') || 0;
  const watchLarge = watch('egg_production.large') || 0;
  const watchMedium = watch('egg_production.medium') || 0;
  const watchSmall = watch('egg_production.small') || 0;
  const watchBroken = watch('egg_production.broken') || 0;
  const calculatedTotalEggs = Number(watchJumbo) + Number(watchLarge) + Number(watchMedium) + Number(watchSmall) + Number(watchBroken);
  const calculatedTotalBoxes = (calculatedTotalEggs / 360).toFixed(2);

  const onSubmit = async (data: DailyReportFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await api.post('/daily-reports', data);
      setSubmitStatus({
        type: 'success',
        message: response.data.message || 'Reporte diario registrado con éxito en el servidor.',
      });
      // Recargar datos y resetear
      const flocksRes = await api.get('/flocks').catch(() => ({ data: { data: [] } }));
      setFlocks(flocksRes.data.data || []);
      reset({
        flock_id: undefined,
        report_date: new Date().toISOString().split('T')[0],
        bird_movement: {
          initial_birds: 0,
          mortality: 0,
          entries: 0,
        },
        egg_production: {
          jumbo: 0,
          large: 0,
          medium: 0,
          small: 0,
          broken: 0,
        },
        feed_consumptions: [],
        dispatch: {
          boxes_shipped: 0,
          live_birds_shipped: 0,
          manure_sacks: 0,
          invoice_number: '',
        },
        health: {
          vaccines_applied: '',
          infrastructure_notes: '',
        },
      });
    } catch (error: any) {
      console.error(error);
      const backendMessage = error.response?.data?.message || 'Error al conectar con la API del servidor.';
      setSubmitStatus({
        type: 'error',
        message: backendMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Cabecera */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
          Reporte Diario de Producción
        </h2>
        <p className="text-gray-500 mt-2">
          Ingresa la información operacional correspondiente al día de hoy para actualizar inventarios, producción y sanidad.
        </p>
      </div>

      {submitStatus && (
        <div
          className={`mb-6 p-4 rounded-xl shadow-lg border transition-all duration-300 transform scale-100 flex items-center gap-3 ${
            submitStatus.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <span className="text-2xl">
            {submitStatus.type === 'success' ? '✅' : '❌'}
          </span>
          <div className="font-semibold">{submitStatus.message}</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Lote y Fecha */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Seleccionar Lote Avícola</label>
            {loadingOptions ? (
              <div className="h-10 w-full bg-gray-100 animate-pulse rounded-lg" />
            ) : (
              <select
                {...register('flock_id')}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition bg-white text-gray-800 font-medium"
              >
                <option value="">-- Selecciona un Lote --</option>
                {flocks.map((f) => (
                  <option key={f.id} value={f.id}>
                    Lote #{f.id} {f.shed ? `- Galpón: ${f.shed.name}` : ''} ({f.current_birds} aves)
                  </option>
                ))}
              </select>
            )}
            {errors.flock_id && (
              <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.flock_id.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Reporte</label>
            <input
              type="date"
              {...register('report_date')}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition bg-white text-gray-800 font-medium"
            />
            {errors.report_date && (
              <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.report_date.message}</p>
            )}
          </div>
        </div>

        {/* 1. Movimiento de Aves */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl font-bold">1</span>
            <h3 className="text-xl font-bold text-gray-800">Movimiento de Aves</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">AVES INICIALES</label>
              <input
                type="number"
                readOnly
                {...register('bird_movement.initial_birds')}
                className="w-full h-11 px-4 rounded-xl border border-gray-150 bg-gray-50 text-gray-500 font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">MORTALIDAD (DECESOS)</label>
              <input
                type="number"
                {...register('bird_movement.mortality')}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition bg-white text-gray-800 font-semibold"
              />
              {errors.bird_movement?.mortality && (
                <p className="text-rose-500 text-xs mt-1">{errors.bird_movement.mortality.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">INGRESOS (NUEVAS AVES)</label>
              <input
                type="number"
                {...register('bird_movement.entries')}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition bg-white text-gray-800 font-semibold"
              />
              {errors.bird_movement?.entries && (
                <p className="text-rose-500 text-xs mt-1">{errors.bird_movement.entries.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-2">AVES FINALES (CALCULADO)</label>
              <div className="w-full h-11 flex items-center px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold text-lg">
                {calculatedFinalBirds}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Producción de Huevos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="p-2.5 bg-sky-100 text-sky-700 rounded-xl font-bold">2</span>
            <h3 className="text-xl font-bold text-gray-800">Recolección y Producción</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">JUMBO</label>
              <input
                type="number"
                {...register('egg_production.jumbo')}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition bg-white text-gray-800"
              />
              {errors.egg_production?.jumbo && (
                <p className="text-rose-500 text-xs mt-1">{errors.egg_production.jumbo.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">GRANDE (LARGE)</label>
              <input
                type="number"
                {...register('egg_production.large')}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition bg-white text-gray-800"
              />
              {errors.egg_production?.large && (
                <p className="text-rose-500 text-xs mt-1">{errors.egg_production.large.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">MEDIANO</label>
              <input
                type="number"
                {...register('egg_production.medium')}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition bg-white text-gray-800"
              />
              {errors.egg_production?.medium && (
                <p className="text-rose-500 text-xs mt-1">{errors.egg_production.medium.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">PEQUEÑO</label>
              <input
                type="number"
                {...register('egg_production.small')}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition bg-white text-gray-800"
              />
              {errors.egg_production?.small && (
                <p className="text-rose-500 text-xs mt-1">{errors.egg_production.small.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">ROTOS</label>
              <input
                type="number"
                {...register('egg_production.broken')}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition bg-white text-gray-800"
              />
              {errors.egg_production?.broken && (
                <p className="text-rose-500 text-xs mt-1">{errors.egg_production.broken.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-sky-800 mb-2">TOTAL CAJAS (CALC.)</label>
              <div className="w-full h-11 flex items-center px-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 font-extrabold text-lg">
                {calculatedTotalBoxes}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Consumo de Alimento */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-amber-100 text-amber-700 rounded-xl font-bold">3</span>
              <h3 className="text-xl font-bold text-gray-800">Consumo de Alimento</h3>
            </div>
            <button
              type="button"
              onClick={() => append({ feed_inventory_id: 0, quantity_sacks_consumed: 1 })}
              className="px-4 py-2 bg-amber-500 text-white rounded-xl font-semibold shadow hover:bg-amber-600 transition flex items-center gap-2 text-sm"
            >
              <span>+ Añadir Alimento</span>
            </button>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-6 border-2 border-dashed border-gray-150 rounded-xl text-gray-400">
              No se han registrado consumos de alimento hoy.
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col md:flex-row md:items-end gap-6 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Tipo de Alimento (Lote)</label>
                    <select
                      {...register(`feed_consumptions.${index}.feed_inventory_id` as const)}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                    >
                      <option value="">-- Selecciona alimento --</option>
                      {feedInventories.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          {inv.name} - Zona {inv.zone} ({inv.sacks_stock} sacos disp.)
                        </option>
                      ))}
                    </select>
                    {errors.feed_consumptions?.[index]?.feed_inventory_id && (
                      <p className="text-rose-500 text-xs mt-1">
                        {errors.feed_consumptions[index]?.feed_inventory_id?.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full md:w-48">
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Sacos Consumidos (40kg c/u)</label>
                    <input
                      type="number"
                      {...register(`feed_consumptions.${index}.quantity_sacks_consumed` as const)}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                    />
                    {errors.feed_consumptions?.[index]?.quantity_sacks_consumed && (
                      <p className="text-rose-500 text-xs mt-1">
                        {errors.feed_consumptions[index]?.quantity_sacks_consumed?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="w-11 h-11 flex items-center justify-center bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl transition shadow-sm font-semibold"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Despachos y Logística */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="p-2.5 bg-violet-100 text-violet-700 rounded-xl font-bold">4</span>
            <h3 className="text-xl font-bold text-gray-800">Despachos y Logística</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">CAJAS DESPACHADAS</label>
              <input
                type="number"
                {...register('dispatch.boxes_shipped')}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition bg-white text-gray-800"
              />
              {errors.dispatch?.boxes_shipped && (
                <p className="text-rose-500 text-xs mt-1">{errors.dispatch.boxes_shipped.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">AVES VIVAS VENDIDAS</label>
              <input
                type="number"
                {...register('dispatch.live_birds_shipped')}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition bg-white text-gray-800"
              />
              {errors.dispatch?.live_birds_shipped && (
                <p className="text-rose-500 text-xs mt-1">{errors.dispatch.live_birds_shipped.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">SACOS DE GALLINAZA</label>
              <input
                type="number"
                {...register('dispatch.manure_sacks')}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition bg-white text-gray-800"
              />
              {errors.dispatch?.manure_sacks && (
                <p className="text-rose-500 text-xs mt-1">{errors.dispatch.manure_sacks.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">NÚMERO DE NOTA DE ENTREGA</label>
              <input
                type="text"
                {...register('dispatch.invoice_number')}
                placeholder="Ej. NA-00423"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition bg-white text-gray-800"
              />
              {errors.dispatch?.invoice_number && (
                <p className="text-rose-500 text-xs mt-1">{errors.dispatch.invoice_number.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* 5. Sanidad */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="p-2.5 bg-teal-100 text-teal-700 rounded-xl font-bold">5</span>
            <h3 className="text-xl font-bold text-gray-800">Sanidad e Infraestructura</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vacunas Aplicadas (Opcional)</label>
              <textarea
                rows={3}
                {...register('health.vaccines_applied')}
                placeholder="Ej. Vacuna Triple Aviar dosis de refuerzo."
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition bg-white text-gray-800"
              />
              {errors.health?.vaccines_applied && (
                <p className="text-rose-500 text-xs mt-1">{errors.health.vaccines_applied.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Novedades de Infraestructura (Opcional)</label>
              <textarea
                rows={3}
                {...register('health.infrastructure_notes')}
                placeholder="Ej. Mantenimiento del extractor del galpón 2 completado."
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition bg-white text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Botón de Envío */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-bold shadow-xl shadow-teal-500/20 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 text-lg"
          >
            {isSubmitting ? 'Guardando Reporte...' : 'Enviar Reporte Diario'}
          </button>
        </div>
      </form>
    </div>
  );
}
