import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import api from '../../config/axios';

interface DashboardData {
  kpis: {
    active_birds: number;
    total_boxes: number;
    total_mortality: number;
  };
  is_alert_triggered: boolean;
  merma_percentage: number;
  series: Array<{
    date: string;
    eggs: number;
    mortality: number;
  }>;
}

export default function ExecutiveDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await api.get('/dashboard');
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="h-28 bg-[#1e2026] border border-[#2a2d35] rounded-2xl"></div>
          <div className="h-28 bg-[#1e2026] border border-[#2a2d35] rounded-2xl"></div>
          <div className="h-28 bg-[#1e2026] border border-[#2a2d35] rounded-2xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="h-80 bg-[#1e2026] border border-[#2a2d35] rounded-2xl"></div>
          <div className="h-80 bg-[#1e2026] border border-[#2a2d35] rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full max-w-7xl mx-auto py-12 text-center text-gray-400">
        No se pudo obtener información del servidor.
      </div>
    );
  }

  // 1. Gráfica Radial Gauge (Order Status Style)
  const radialChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'radialBar',
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        track: {
          background: '#262830',
          strokeWidth: '97%',
        },
        dataLabels: {
          name: {
            show: true,
            color: '#9ca3af',
            fontSize: '13px',
            offsetY: 20,
          },
          value: {
            offsetY: -15,
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#f59e0b',
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        gradientToColors: ['#10b981'],
        stops: [0, 100],
      },
    },
    stroke: {
      dashArray: 4,
    },
    colors: ['#f59e0b'],
    labels: ['Efectividad Huevo'],
  };

  // 2. Gráfica de Barras Apiladas / Variación (Revenue per month style)
  const barChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent',
    },
    colors: ['#f59e0b', '#d97706'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: data.series.map((s) => s.date),
      labels: { style: { colors: '#9ca3af', fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: '#9ca3af', fontSize: '11px' } },
    },
    grid: {
      borderColor: '#262830',
      strokeDashArray: 4,
    },
    legend: {
      labels: { colors: '#d1d5db' },
      position: 'top',
      horizontalAlign: 'right',
    },
    tooltip: { theme: 'dark' },
  };

  const barChartSeries = [
    {
      name: 'Huevos Producidos',
      data: data.series.map((s) => s.eggs),
    },
    {
      name: 'Mortalidad (x100)',
      data: data.series.map((s) => s.mortality * 10),
    },
  ];

  // 3. Gráfica de Líneas Naranja/Amarillo (Total Customers style)
  const lineChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      background: 'transparent',
    },
    colors: ['#f59e0b'],
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
      size: 5,
      colors: ['#f59e0b'],
      strokeColors: '#18191d',
      strokeWidth: 2,
    },
    xaxis: {
      categories: data.series.map((s) => s.date),
      labels: { style: { colors: '#9ca3af', fontSize: '11px' } },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: { style: { colors: '#9ca3af', fontSize: '11px' } },
    },
    grid: {
      borderColor: '#262830',
      strokeDashArray: 4,
    },
    tooltip: { theme: 'dark' },
  };

  const lineChartSeries = [
    {
      name: 'Tendencia Histórica de Huevos',
      data: data.series.map((s) => s.eggs),
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Alerta de Merma estilo Filament */}
      {data.is_alert_triggered && (
        <div className="bg-[#241416] border border-[#481c1d] rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-lg">
              ⚠️
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-200">Alerta de Merma Excesiva en Molienda</h4>
              <p className="text-xs text-red-400 mt-0.5">
                La merma alcanzó el <strong className="text-red-300">{data.merma_percentage}%</strong> (Límite máximo: 10.00%).
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg text-xs font-bold uppercase">
            Requiere Revisión
          </span>
        </div>
      )}

      {/* TOP 3 CARDS DE KPI (Estilo Filament Dark con Mini-Sparklines) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* KPI 1 */}
        <div className="bg-[#18191d] border border-[#26282e] rounded-2xl p-5 relative overflow-hidden group hover:border-[#383b45] transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Aves Activas</span>
              <div className="text-2xl font-black text-white mt-1">
                {data.kpis.active_birds.toLocaleString()}
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 mt-2">
                <span>↑ 2.4%</span>
                <span className="text-gray-500 font-normal">vs periodo anterior</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              🐓
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#18191d] border border-[#26282e] rounded-2xl p-5 relative overflow-hidden group hover:border-[#383b45] transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Producción de Huevos</span>
              <div className="text-2xl font-black text-white mt-1">
                {data.kpis.total_boxes.toLocaleString()} <span className="text-sm text-gray-400 font-medium">cajas</span>
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 mt-2">
                <span>↑ 5.1%</span>
                <span className="text-gray-500 font-normal">rendimiento óptimo</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              🥚
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-[#18191d] border border-[#26282e] rounded-2xl p-5 relative overflow-hidden group hover:border-[#383b45] transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mortalidad Acumulada</span>
              <div className="text-2xl font-black text-white mt-1">
                {data.kpis.total_mortality.toLocaleString()} <span className="text-sm text-gray-400 font-medium">aves</span>
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 mt-2">
                <span>↓ 1.2%</span>
                <span className="text-gray-500 font-normal">dentro de margen</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm">
              📉
            </div>
          </div>
        </div>
      </div>

      {/* FILA 2 DE GRÁFICAS ESTILO FILAMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Gauges Status Chart (Columna 5/12) */}
        <div className="lg:col-span-5 bg-[#18191d] border border-[#26282e] rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-200">Estado de Producción Galpones</h3>
            <p className="text-xs text-gray-500 mt-0.5">Eficiencia de recolección semanal</p>
          </div>

          <div className="py-4 flex justify-center">
            <ReactApexChart
              options={radialChartOptions}
              series={[88.4]}
              type="radialBar"
              height={260}
            />
          </div>

          <div className="grid grid-cols-3 text-center border-t border-[#26282e] pt-4">
            <div>
              <span className="text-[11px] text-gray-500 font-bold uppercase block">Producido</span>
              <span className="text-base font-extrabold text-white mt-0.5 block">8,950</span>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 font-bold uppercase block">Entregado</span>
              <span className="text-base font-extrabold text-amber-400 mt-0.5 block">8,420</span>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 font-bold uppercase block">Merma/Rotos</span>
              <span className="text-base font-extrabold text-red-400 mt-0.5 block">530</span>
            </div>
          </div>
        </div>

        {/* Bar Chart (Columna 7/12) */}
        <div className="lg:col-span-7 bg-[#18191d] border border-[#26282e] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-200">Comparativa Diaria de Producción</h3>
              <p className="text-xs text-gray-500 mt-0.5">Relación entre unidades producidas y pérdidas</p>
            </div>
          </div>
          <ReactApexChart
            options={barChartOptions}
            series={barChartSeries}
            type="bar"
            height={280}
          />
        </div>
      </div>

      {/* FILA 3 DE GRÁFICA DE LÍNEA COMPLETA */}
      <div className="bg-[#18191d] border border-[#26282e] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-200">Histórico de Producción Continuo</h3>
            <p className="text-xs text-gray-500 mt-0.5">Seguimiento en el tiempo</p>
          </div>
        </div>
        <ReactApexChart
          options={lineChartOptions}
          series={lineChartSeries}
          type="line"
          height={260}
        />
      </div>
    </div>
  );
}
