import React, { useState } from 'react';
import api from '../../config/axios';

interface EditUserProps {
  user: any;
  onUpdateSuccess: (updatedUser: any) => void;
}

export default function EditUserForm({ user, onUpdateSuccess }: EditUserProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'OPERATIVO',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await api.put('/user', formData);
      const data = response.data;

      localStorage.setItem('sapa_user', JSON.stringify(data.user));
      setSuccess('Usuario actualizado correctamente.');
      onUpdateSuccess(data.user);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al actualizar el usuario';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-6 bg-[#18191d] p-8 rounded-2xl border border-[#26282e] shadow-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center font-bold text-xl">
          ⚙️
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-100">Editar Perfil de Usuario</h2>
          <p className="text-xs text-gray-400">Modifica tus datos de acceso o información de rol</p>
        </div>
      </div>

      {error && (
        <div className="bg-[#241416] border border-[#481c1d] text-red-300 text-xs font-semibold p-3.5 rounded-xl mb-4 flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-[#14241b] border border-[#1c482c] text-emerald-300 text-xs font-semibold p-3.5 rounded-xl mb-4 flex items-center gap-2">
          <span>✅</span>
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Nombre Completo
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#22242a] border border-[#2d3038] text-white focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#22242a] border border-[#2d3038] text-white focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Rol en la Empresa
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#22242a] border border-[#2d3038] text-white focus:outline-none focus:border-amber-500 text-sm"
          >
            <option value="DIRECTIVO">Directivo</option>
            <option value="EJECUTIVO">Ejecutivo</option>
            <option value="OPERATIVO">Operativo</option>
            <option value="ADMINISTRATIVO">Administrativo</option>
          </select>
        </div>

        <div className="border-t border-[#26282e] pt-4 mt-2">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Nueva Contraseña <span className="text-gray-500 font-normal">(Dejar en blanco para no cambiar)</span>
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#22242a] border border-[#2d3038] text-white focus:outline-none focus:border-amber-500 text-sm placeholder:text-gray-600"
          />
        </div>

        {formData.password && (
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              value={formData.password_confirmation}
              onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#22242a] border border-[#2d3038] text-white focus:outline-none focus:border-amber-500 text-sm placeholder:text-gray-600"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-150 disabled:opacity-50 mt-4 text-sm"
        >
          {loading ? 'Guardando Cambios...' : 'Guardar Cambios de Perfil'}
        </button>
      </form>
    </div>
  );
}
