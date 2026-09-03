import { useState, useEffect } from 'react';
import DailyReportForm from './features/daily-reports/components/DailyReportForm';
import ExecutiveDashboard from './features/dashboard/ExecutiveDashboard';
import LoginForm from './features/auth/LoginForm';
import RegisterForm from './features/auth/RegisterForm';
import EditUserForm from './features/auth/EditUserForm';

export default function App() {
  const [user, setUser] = useState<any>(() => {
    const storedUser = localStorage.getItem('sapa_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'form' | 'edit-user' | 'login' | 'register'>(
    user ? 'dashboard' : 'login'
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('sapa_token');
    localStorage.removeItem('sapa_user');
    setUser(null);
    setActiveTab('login');
  };

  const farmImages = [
    {
      url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1600&q=80',
      title: 'Gestión Avícola Digital de Alta Eficiencia',
      subtitle: 'Control de inventario de aves, producción diaria de huevos y trazabilidad biológica en una sola plataforma.',
    },
    {
      url: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1600&q=80',
      title: 'Tecnología y Producción Sostenible',
      subtitle: 'Monitoreo de bioseguridad, vacuidades sanitarias y rendimiento de galpones en tiempo real.',
    },
    {
      url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1600&q=80',
      title: 'Control Estricto de Almacén y Molienda',
      subtitle: 'Optimización de insumos en zonas A, B y C mediante metodologías PEPS/FIFO y alertas de merma.',
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!user) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % farmImages.length);
      }, 20000); // 20 segundos

      return () => clearInterval(interval);
    }
  }, [user, farmImages.length]);

  // Vistas públicas sin necesidad de estar logueado (Split 2 Columnas con Carrusel de 20s)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#121316] text-[#e1e1e6] font-sans flex flex-col md:flex-row">
        {/* Columna Izquierda: Carrusel de Imagenes de Granjas Avícolas */}
        <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-[#18191d] overflow-hidden items-end p-12 border-r border-[#26282e]">
          {farmImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentImageIndex ? 'opacity-60 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover mix-blend-luminosity"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121316] via-[#121316]/40 to-transparent"></div>

          <div className="relative z-10 space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider">
              <span>🌾</span>
              <span>Distribuidora Pozo Azul C.A.</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight transition-all">
              {farmImages[currentImageIndex].title}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-medium transition-all">
              {farmImages[currentImageIndex].subtitle}
            </p>

            {/* Indicadores de Puntos del Carrusel */}
            <div className="flex gap-2 pt-2">
              {farmImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex ? 'w-8 bg-amber-500' : 'w-2 bg-gray-600 hover:bg-gray-400'
                  }`}
                  title={`Ver imagen ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Panel de Login / Registro */}
        <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center p-6 md:p-12 bg-[#121316]">
          <div className="w-full max-w-md mx-auto">
            {/* Toggle entre Login y Register */}
            <div className="flex bg-[#18191d] border border-[#26282e] rounded-xl p-1 mb-8">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'login'
                    ? 'bg-amber-500 text-gray-950 shadow-md shadow-amber-500/10'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                🔐 Iniciar Sesión
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'register'
                    ? 'bg-amber-500 text-gray-950 shadow-md shadow-amber-500/10'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                ✍️ Crear Cuenta
              </button>
            </div>

            {activeTab === 'login' ? (
              <LoginForm
                onSuccess={handleAuthSuccess}
                onSwitchToRegister={() => setActiveTab('register')}
              />
            ) : (
              <RegisterForm
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={() => setActiveTab('login')}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vista autenticada del Sistema (Filament Admin Panel)
  return (
    <div className="min-h-screen bg-[#121316] text-[#e1e1e6] font-sans flex flex-col md:flex-row">
      {/* Sidebar Izquierdo Filament */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-[#18191d] border-r border-[#26282e] transition-all duration-300 flex flex-col justify-between ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div>
          {/* Branding Esquina Superior Izquierda */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#26282e]">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 min-w-[36px] bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-gray-950 font-black text-lg shadow-md shadow-amber-500/20">
                PA
              </div>
              {isSidebarOpen && (
                <div className="whitespace-nowrap">
                  <span className="font-extrabold text-base text-gray-100 tracking-tight block leading-none">
                    Pozo Azul
                  </span>
                  <span className="text-[10px] text-amber-500/90 font-bold uppercase tracking-wider">
                    SAPA v1.0
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#26282e] transition-colors"
              title={isSidebarOpen ? 'Colapsar menú' : 'Expandir menú'}
            >
              {isSidebarOpen ? '◀' : '▶'}
            </button>
          </div>

          {/* Menú de Navegación Protegido */}
          <nav className="p-3 space-y-1.5">
            {isSidebarOpen && (
              <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Panel Principal
              </div>
            )}

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#22242a]'
              }`}
            >
              <span className="text-lg">📊</span>
              {isSidebarOpen && <span>Dashboard</span>}
            </button>

            <button
              onClick={() => setActiveTab('form')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'form'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#22242a]'
              }`}
            >
              <span className="text-lg">📝</span>
              {isSidebarOpen && <span>Reporte Diario</span>}
            </button>

            {isSidebarOpen && (
              <div className="px-3 pt-4 pb-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Configuración
              </div>
            )}

            <button
              onClick={() => setActiveTab('edit-user')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'edit-user'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#22242a]'
              }`}
            >
              <span className="text-lg">⚙️</span>
              {isSidebarOpen && <span>Editar Usuario</span>}
            </button>
          </nav>
        </div>

        {/* Footer / Usuario Logueado */}
        <div className="p-3 border-t border-[#26282e]">
          <div className="flex items-center justify-between bg-[#22242a] p-2 rounded-xl border border-[#2d3038]">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                {user.name?.charAt(0) || 'U'}
              </div>
              {isSidebarOpen && (
                <div className="truncate">
                  <p className="text-xs font-bold text-gray-100 truncate">{user.name}</p>
                  <p className="text-[10px] text-amber-400 font-extrabold uppercase">{user.role}</p>
                </div>
              )}
            </div>
            {isSidebarOpen && (
              <button
                onClick={handleLogout}
                title="Cerrar Sesión"
                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                🚪
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL AUTENTICADA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#121316]">
        <header className="h-16 border-b border-[#26282e] bg-[#18191d] px-6 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-lg font-bold text-gray-100">
            {activeTab === 'dashboard' && 'Panel Ejecutivo de Control'}
            {activeTab === 'form' && 'Formulario de Reporte Diario'}
            {activeTab === 'edit-user' && 'Gestión de Perfil de Usuario'}
          </h1>

          <div className="flex items-center gap-2 bg-[#22242a] border border-[#2d3038] px-3 py-1.5 rounded-xl text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Sesión Activa: {user.email}</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {activeTab === 'dashboard' && <ExecutiveDashboard />}
          {activeTab === 'form' && <DailyReportForm />}
          {activeTab === 'edit-user' && (
            <EditUserForm user={user} onUpdateSuccess={(u) => setUser(u)} />
          )}
        </main>
      </div>
    </div>
  );
}
