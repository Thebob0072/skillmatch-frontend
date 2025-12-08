import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

interface ServicePackage {
  package_id?: number;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
}

export const ServicePackageManager: React.FC = () => {
  const { t } = useTranslation();
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [newPackage, setNewPackage] = useState<ServicePackage>({
    name: '',
    description: '',
    duration_minutes: 60,
    price: 1500,
    is_active: true,
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/provider/services');
      setPackages(response.data || []);
    } catch (err) {
      setError(t('services.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPackage = async () => {
    if (!newPackage.name || newPackage.price <= 0) {
      setError(t('services.validationError'));
      return;
    }

    try {
      setIsSaving(true);
      const response = await api.post('/provider/services', newPackage);
      setPackages([...packages, response.data]);
      setNewPackage({
        name: '',
        description: '',
        duration_minutes: 60,
        price: 1500,
        is_active: true,
      });
      setSuccess(t('services.addSuccess'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(t('services.addError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePackage = async (pkg: ServicePackage) => {
    try {
      setIsSaving(true);
      await api.put(`/provider/services/${pkg.package_id}`, pkg);
      setPackages(packages.map(p => p.package_id === pkg.package_id ? pkg : p));
      setEditingId(null);
      setSuccess(t('services.updateSuccess'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(t('services.updateError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePackage = async (packageId: number) => {
    if (!confirm(t('services.deleteConfirm'))) return;

    try {
      await api.delete(`/provider/services/${packageId}`);
      setPackages(packages.filter(p => p.package_id !== packageId));
      setSuccess(t('services.deleteSuccess'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(t('services.deleteError'));
    }
  };

  const handleToggleActive = async (pkg: ServicePackage) => {
    const updated = { ...pkg, is_active: !pkg.is_active };
    await handleUpdatePackage(updated);
  };

  const durationOptions = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 240, label: '4 hours' },
    { value: 360, label: '6 hours' },
    { value: 480, label: 'Overnight (8 hrs)' },
    { value: 720, label: '12 hours' },
    { value: 1440, label: '24 hours' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-neon-pink border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">
            <span className="bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
              💼 {t('services.title')}
            </span>
          </h1>
          <p className="text-gray-400">{t('services.subtitle')}</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-400">
            {error}
            <button onClick={() => setError(null)} className="ml-2">✕</button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-xl text-green-400">
            {success}
          </div>
        )}

        {/* Add New Package */}
        <div className="bg-black/50 backdrop-blur-xl rounded-2xl border-2 border-neon-purple/30 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">➕ {t('services.addNew')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">{t('services.name')}</label>
              <input
                type="text"
                value={newPackage.name}
                onChange={e => setNewPackage({ ...newPackage, name: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:border-neon-purple focus:outline-none"
                placeholder="e.g., Dinner Date, Premium Companion"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">{t('services.description')}</label>
              <input
                type="text"
                value={newPackage.description}
                onChange={e => setNewPackage({ ...newPackage, description: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:border-neon-purple focus:outline-none"
                placeholder="Brief description of the service"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">{t('services.duration')}</label>
              <select
                value={newPackage.duration_minutes}
                onChange={e => setNewPackage({ ...newPackage, duration_minutes: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:border-neon-purple focus:outline-none"
              >
                {durationOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">{t('services.price')} (THB)</label>
              <input
                type="number"
                value={newPackage.price}
                onChange={e => setNewPackage({ ...newPackage, price: Number(e.target.value) })}
                min={500}
                step={100}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:border-neon-purple focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleAddPackage}
            disabled={isSaving || !newPackage.name}
            className="w-full py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-xl font-bold hover:shadow-[0_0_30px_rgba(255,16,240,0.5)] transition-all disabled:opacity-50"
          >
            {isSaving ? 'Adding...' : `+ ${t('services.addPackage')}`}
          </button>
        </div>

        {/* Package List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">📦 {t('services.yourPackages')}</h2>

          {packages.length === 0 ? (
            <div className="bg-black/30 rounded-2xl border border-gray-700 p-12 text-center">
              <span className="text-6xl block mb-4">📭</span>
              <p className="text-gray-400">{t('services.noPackages')}</p>
              <p className="text-gray-500 text-sm mt-2">{t('services.addFirstPackage')}</p>
            </div>
          ) : (
            packages.map(pkg => (
              <div
                key={pkg.package_id}
                className={`bg-black/30 rounded-2xl border p-6 transition-all ${
                  pkg.is_active 
                    ? 'border-neon-green/30 hover:border-neon-green/50' 
                    : 'border-gray-700 opacity-60'
                }`}
              >
                {editingId === pkg.package_id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={e => setPackages(packages.map(p => 
                          p.package_id === pkg.package_id ? { ...p, name: e.target.value } : p
                        ))}
                        className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none"
                      />
                      <input
                        type="text"
                        value={pkg.description}
                        onChange={e => setPackages(packages.map(p => 
                          p.package_id === pkg.package_id ? { ...p, description: e.target.value } : p
                        ))}
                        className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none"
                      />
                      <select
                        value={pkg.duration_minutes}
                        onChange={e => setPackages(packages.map(p => 
                          p.package_id === pkg.package_id ? { ...p, duration_minutes: Number(e.target.value) } : p
                        ))}
                        className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none"
                      >
                        {durationOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={e => setPackages(packages.map(p => 
                          p.package_id === pkg.package_id ? { ...p, price: Number(e.target.value) } : p
                        ))}
                        min={500}
                        className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdatePackage(pkg)}
                        className="px-4 py-2 bg-neon-green text-black rounded-lg font-bold hover:bg-neon-green/80"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                        {pkg.is_active ? (
                          <span className="px-2 py-1 bg-neon-green/20 text-neon-green text-xs rounded-full">Active</span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded-full">Inactive</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{pkg.description || 'No description'}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">
                          ⏱️ {durationOptions.find(d => d.value === pkg.duration_minutes)?.label || `${pkg.duration_minutes} min`}
                        </span>
                        <span className="text-neon-gold font-bold text-lg">
                          ฿{pkg.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(pkg)}
                        className={`p-2 rounded-lg transition-colors ${
                          pkg.is_active 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-neon-green/20 text-neon-green hover:bg-neon-green/30'
                        }`}
                        title={pkg.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {pkg.is_active ? '👁️' : '👁️‍🗨️'}
                      </button>
                      <button
                        onClick={() => setEditingId(pkg.package_id!)}
                        className="p-2 bg-neon-purple/20 text-neon-purple rounded-lg hover:bg-neon-purple/30"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.package_id!)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pricing Tips */}
        <div className="mt-8 bg-neon-gold/10 border border-neon-gold/30 rounded-2xl p-6">
          <h3 className="text-neon-gold font-bold mb-3">💡 {t('services.pricingTips')}</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>• Research competitor pricing in your area</li>
            <li>• Offer different packages for different budgets</li>
            <li>• Consider offering discounts for longer bookings</li>
            <li>• Update prices based on demand and availability</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServicePackageManager;
