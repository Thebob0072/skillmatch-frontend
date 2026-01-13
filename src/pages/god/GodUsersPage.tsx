import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { godService } from '../../services/godService';
import type { UserListResponse } from '../../services/godService';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const GodUsersPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'admin' | 'provider' | 'client'>('all');

  useEffect(() => {
    loadUsers();
  }, [page, filter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await godService.listUsers({
        page,
        limit: 20,
        is_admin: filter === 'admin' ? true : undefined,
        search: search || undefined,
      });
      setUsers(data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to load users');
      }
      // Set empty users list on error
      setUsers({
        users: [],
        total: 0,
        page: 1,
        limit: 20,
        total_pages: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadUsers();
  };

  const handleDeleteUser = async (userId: number, username: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบ user "${username}"?\n\n⚠️ การกระทำนี้ไม่สามารถย้อนกลับได้!`)) {
      return;
    }

    try {
      await godService.deleteUser(userId);
      alert(`✅ ลบ user "${username}" สำเร็จ`);
      loadUsers();
    } catch (error: unknown) {
      alert(`❌ ลบ user ไม่สำเร็จ: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleBanUser = async (userId: number, username: string) => {
    const reason = prompt(`เหตุผลในการ ban "${username}":`);
    if (!reason) return;

    const daysInput = prompt('ระยะเวลา (วัน) หรือเว้นว่างสำหรับ permanent ban:');
    const duration_days = daysInput ? parseInt(daysInput) : undefined;

    try {
      await godService.banUser({ user_id: userId, reason, duration_days });
      alert(`🔨 Ban user "${username}" สำเร็จ`);
      loadUsers();
    } catch (error: unknown) {
      alert(`❌ Ban user ไม่สำเร็จ: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleMakeAdmin = async (userId: number, username: string, currentIsAdmin: boolean) => {
    const action = currentIsAdmin ? 'ถอด admin' : 'เลื่อนเป็น admin';
    if (!confirm(`คุณต้องการ${action} "${username}" หรือไม่?`)) return;

    try {
      await godService.updateUser({ user_id: userId, is_admin: !currentIsAdmin });
      alert(`✅ ${action} "${username}" สำเร็จ`);
      loadUsers();
    } catch (error: unknown) {
      alert(`❌ ${action} ไม่สำเร็จ: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleChangeTier = async (userId: number, username: string) => {
    const tierIdInput = prompt(
      `เปลี่ยน tier สำหรับ "${username}":\n\n` +
      '1 = General (฿0/month)\n' +
      '2 = Silver (฿9.99/month)\n' +
      '3 = Diamond (฿29.99/month)\n' +
      '4 = Premium (฿99.99/month)\n' +
      '5 = GOD (฿9999.99/month)\n\n' +
      'กรอก tier_id:'
    );

    if (!tierIdInput) return;
    const tier_id = parseInt(tierIdInput);

    if (tier_id < 1 || tier_id > 5) {
      alert('❌ tier_id ต้องอยู่ระหว่าง 1-5');
      return;
    }

    try {
      await godService.updateUser({ user_id: userId, tier_id });
      alert(`✅ เปลี่ยน tier ของ "${username}" สำเร็จ`);
      loadUsers();
    } catch (error: unknown) {
      alert(`❌ เปลี่ยน tier ไม่สำเร็จ: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading && !users) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">👑</div>
          <p className="text-white text-xl">{t('god_loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent animate-pulse pointer-events-none"></div>

      {/* Language Switcher - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black mb-2">
            <span style={{
              background: 'linear-gradient(to right, #ffd700, #ffed4e, #ffd700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))',
            }}>
              👥 {t('god_user_management')}
            </span>
          </h1>
          <p className="text-gray-400">{t('god_user_management_subtitle')}</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-black/50 backdrop-blur-2xl border-2 border-neon-gold/50 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by username or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-3 bg-black/50 border-2 border-neon-purple/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-gold"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-neon-gold to-yellow-600 text-black font-bold rounded-xl hover:scale-105 transition-all"
            >
              🔍 Search
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            {(['all', 'admin', 'provider', 'client'] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  filter === f
                    ? 'bg-neon-gold text-black'
                    : 'bg-black/30 text-gray-400 hover:bg-black/50'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        {users && (
          <div className="bg-black/50 backdrop-blur-2xl border-2 border-neon-gold/50 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neon-gold/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-neon-gold font-bold">ID</th>
                    <th className="px-4 py-3 text-left text-neon-gold font-bold">Username</th>
                    <th className="px-4 py-3 text-left text-neon-gold font-bold">Email</th>
                    <th className="px-4 py-3 text-left text-neon-gold font-bold">Tier</th>
                    <th className="px-4 py-3 text-left text-neon-gold font-bold">Admin</th>
                    <th className="px-4 py-3 text-left text-neon-gold font-bold">Status</th>
                    <th className="px-4 py-3 text-left text-neon-gold font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.users.map((u) => (
                    <tr key={u.user_id} className="border-t border-neon-gold/20 hover:bg-neon-gold/10 transition-colors">
                      <td className="px-4 py-3 text-white font-mono">{u.user_id}</td>
                      <td className="px-4 py-3 text-white font-bold">{u.username}</td>
                      <td className="px-4 py-3 text-gray-300">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          u.tier_name === 'GOD' ? 'bg-neon-gold/30 text-neon-gold' :
                          u.tier_name === 'Premium' ? 'bg-purple-500/30 text-purple-400' :
                          u.tier_name === 'Diamond' ? 'bg-blue-500/30 text-blue-400' :
                          'bg-gray-500/30 text-gray-400'
                        }`}>
                          {u.tier_name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {u.is_admin ? <span className="text-yellow-400">👑 Yes</span> : <span className="text-gray-500">No</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold ${
                          u.verification_status === 'verified' ? 'text-green-400' :
                          u.verification_status === 'pending' ? 'text-yellow-400' :
                          'text-gray-400'
                        }`}>
                          {u.verification_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleChangeTier(u.user_id, u.username)}
                            className="px-2 py-1 bg-blue-500/30 hover:bg-blue-500/50 text-blue-400 text-xs rounded transition-all"
                            title="Change Tier"
                          >
                            💎
                          </button>
                          <button
                            onClick={() => handleMakeAdmin(u.user_id, u.username, u.is_admin)}
                            className="px-2 py-1 bg-yellow-500/30 hover:bg-yellow-500/50 text-yellow-400 text-xs rounded transition-all"
                            title={u.is_admin ? 'Remove Admin' : 'Make Admin'}
                          >
                            👑
                          </button>
                          <button
                            onClick={() => handleBanUser(u.user_id, u.username)}
                            className="px-2 py-1 bg-red-500/30 hover:bg-red-500/50 text-red-400 text-xs rounded transition-all"
                            title="Ban User"
                          >
                            🔨
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.user_id, u.username)}
                            className="px-2 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-500 text-xs rounded transition-all"
                            title="Delete User"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-neon-gold/20 p-4 flex items-center justify-between">
              <p className="text-gray-400">
                Showing {users.users.length} of {users.total} users (Page {page}/{users.total_pages})
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-neon-gold/20 text-neon-gold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neon-gold/30 transition-all"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setPage(p => Math.min(users.total_pages, p + 1))}
                  disabled={page === users.total_pages}
                  className="px-4 py-2 bg-neon-gold/20 text-neon-gold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neon-gold/30 transition-all"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GodUsersPage;
