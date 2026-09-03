import React, { useState } from 'react';
import api from '../../config/axios';

interface LoginFormProps {
  onSuccess: (user: any, token: string) => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/login', formData);
      const data = response.data;

      localStorage.setItem('sapa_token', data.access_token);
      localStorage.setItem('sapa_user', JSON.stringify(data.user));
      onSuccess(data.user, data.access_token);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Credenciales incorrectas o servidor no disponible';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 bg-[#18191d] p-8 rounded-2xl border border-[#26282e] shadow-2xl">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center text-gray-950 font-black text-2xl mx-auto mb-3 shadow-lg shadow-amber-500/20">
          PA
        </div>
        <h2 className="text-xl font-bold text-gray-100">Iniciar Sesión en SAPA</h2>
        <p className="text-gray-400 text-xs mt-1">Acceso seguro para personal de Distribuidora Pozo Azul</p>
      </div>

      {error && (
        <div className="bg-[#241416] border border-[#481c1d] text-red-300 text-xs font-semibold p-3.5 rounded-xl mb-4 flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="usuario@pozoazul.com"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#22242a] border border-[#2d3038] text-white focus:outline-none focus:border-amber-500 text-sm transition-all placeholder:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Contraseña
          </label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#22242a] border border-[#2d3038] text-white focus:outline-none focus:border-amber-500 text-sm transition-all placeholder:text-gray-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-150 disabled:opacity-50 mt-2 flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin"></div>
              <span>Verificando...</span>
            </>
          ) : (
            'Ingresar al Sistema'
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-[#26282e] text-center">
        <p className="text-xs text-gray-400 font-medium">
          ¿No tienes cuenta aún?
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="ml-1.5 font-bold text-amber-400 hover:text-amber-300 underline"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}
