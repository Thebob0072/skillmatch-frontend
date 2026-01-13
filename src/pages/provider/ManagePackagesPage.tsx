import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface ServicePackage {
  package_id: number;
  provider_id: number;
  package_name: string;
  description: string;
  duration: number;
  price: number;
  is_active: boolean;
  created_at: string;
}

export const ManagePackagesPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServicePackage>>({});

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/packages/${user?.user_id}`);
      setPackages(response.data.packages || []);
    } catch (err: unknown) {
      setError(err.response?.data?.error || 'Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg: ServicePackage) => {
    setEditingId(pkg.package_id);
    setEditForm(pkg);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    
    try {
      await api.put(`/packages/${editingId}`, editForm);
      await fetchPackages();
      setEditingId(null);
      setEditForm({});
    } catch (err: unknown) {
      alert(err.response?.data?.error || 'Failed to update package');
    }
  };

  const handleToggleActive = async (pkg: ServicePackage) => {
    try {
      await api.patch(`/packages/${pkg.package_id}/toggle`, {
        is_active: !pkg.is_active
      });
      await fetchPackages();
    } catch (err: unknown) {
      alert(err.response?.data?.error || 'Failed to toggle package status');
    }
  };

  const handleDelete = async (packageId: number) => {
    if (!confirm(t('package.delete_confirm', 'Are you sure you want to delete this package?'))) return;
    
    try {
      await api.delete(`/packages/${packageId}`);
      await fetchPackages();
    } catch (err: unknown) {
      alert(err.response?.data?.error || 'Failed to delete package');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-neon-pink border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              <span className="bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
                📦 {t('package.manage_title', 'Manage Packages')}
              </span>
            </h1>
            <p className="text-gray-400">{t('package.manage_subtitle', 'Create and manage your service packages')}</p>
          </div>
          <Link
            to="/provider/packages/create"
            className="px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold rounded-xl shadow-lg hover:shadow-neon-pink/50 transition whitespace-nowrap"
          >
            + {t('package.create_new', 'Create Package')}
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {packages.length === 0 ? (
          <div className="bg-black/40 rounded-2xl p-12 border border-gray-700 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-white mb-2">{t('package.no_packages', 'No Packages Yet')}</h3>
            <p className="text-gray-400 mb-6">{t('package.no_packages_desc', 'Create your first service package to start accepting bookings')}</p>
            <Link
              to="/provider/packages/create"
              className="inline-block px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold rounded-xl shadow-lg hover:shadow-neon-pink/50 transition"
            >
              + {t('package.create_first', 'Create First Package')}
            </Link>
          </div>
        ) : (
          /* Packages Grid */
          <div className="grid gap-6">
            {packages.map(pkg => (
              <div
                key={pkg.package_id}
                className={`bg-black/40 rounded-2xl p-6 border transition ${
                  pkg.is_active ? 'border-neon-pink/30' : 'border-gray-700 opacity-60'
                }`}
              >
                {editingId === pkg.package_id ? (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editForm.package_name || ''}
                      onChange={e => setEditForm({ ...editForm, package_name: e.target.value })}
                      className="w-full px-4 py-2 bg-black/60 border border-gray-600 rounded-xl text-white"
                      placeholder="Package Name"
                    />
                    <textarea
                      value={editForm.description || ''}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-4 py-2 bg-black/60 border border-gray-600 rounded-xl text-white resize-none"
                      rows={3}
                      placeholder="Description"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Duration (mins)</label>
                        <input
                          type="number"
                          value={editForm.duration || 0}
                          onChange={e => setEditForm({ ...editForm, duration: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 bg-black/60 border border-gray-600 rounded-xl text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Price (THB)</label>
                        <input
                          type="number"
                          value={editForm.price || 0}
                          onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                          className="w-full px-4 py-2 bg-black/60 border border-gray-600 rounded-xl text-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setEditingId(null); setEditForm({}); }}
                        className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition"
                      >
                        {t('common.cancel', 'Cancel')}
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold rounded-xl"
                      >
                        {t('common.save', 'Save')}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1">{pkg.package_name}</h3>
                          {pkg.description && (
                            <p className="text-gray-400 text-sm">{pkg.description}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          pkg.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                        }`}>
                          {pkg.is_active ? t('package.active', 'Active') : t('package.inactive', 'Inactive')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-neon-pink">⏱️ {pkg.duration} {t('package.mins', 'mins')}</span>
                        <span className="text-neon-purple font-bold text-lg">฿{pkg.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-semibold rounded-xl transition"
                      >
                        ✏️ {t('common.edit', 'Edit')}
                      </button>
                      <button
                        onClick={() => handleToggleActive(pkg)}
                        className={`px-4 py-2 font-semibold rounded-xl transition ${
                          pkg.is_active
                            ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
                            : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                        }`}
                      >
                        {pkg.is_active ? '⏸️ ' + t('package.deactivate', 'Deactivate') : '▶️ ' + t('package.activate', 'Activate')}
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.package_id)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-xl transition"
                      >
                        🗑️ {t('common.delete', 'Delete')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePackagesPage;
