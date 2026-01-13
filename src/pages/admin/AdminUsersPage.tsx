import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

interface User {
  user_id: number;
  username: string;
  email: string;
  role: string;
  verification_status: string;
  subscription_tier_id: number;
  tier_name: string;
  created_at: string;
}

export function AdminUsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'provider' | 'client'>('all');

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users', {
        params: {
          search: search || undefined,
          role: filter !== 'all' ? filter : undefined,
        },
      });
      setUsers(response.data.users || []);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to load users');
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadUsers();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500 mb-6 sm:mb-8">
        {t('admin_users_title') || 'User Management'}
      </h1>

      {/* Search & Filters */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="ค้นหาชื่อผู้ใช้หรืออีเมล..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition"
          >
            🔍 ค้นหา
          </button>
        </div>

        <div className="flex gap-2">
          {(['all', 'provider', 'client'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === f
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {f === 'all' ? 'ทั้งหมด' : f === 'provider' ? 'ผู้ให้บริการ' : 'ลูกค้า'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">ID</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">ชื่อผู้ใช้</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">อีเมล</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">บทบาท</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">แพ็กเกจ</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">สถานะ</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">วันที่สร้าง</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    ไม่พบข้อมูลผู้ใช้
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.user_id} className="border-t border-gray-700 hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-white">{user.user_id}</td>
                    <td className="px-4 py-3 text-white font-medium">{user.username}</td>
                    <td className="px-4 py-3 text-gray-300">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.role === 'provider' 
                          ? 'bg-pink-500/20 text-pink-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {user.role === 'provider' ? 'ผู้ให้บริการ' : 'ลูกค้า'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{user.tier_name || 'General'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.verification_status === 'verified'
                          ? 'bg-green-500/20 text-green-400'
                          : user.verification_status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {user.verification_status === 'verified' ? 'ยืนยันแล้ว' : 
                         user.verification_status === 'pending' ? 'รอตรวจสอบ' : 'ยังไม่ยืนยัน'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {new Date(user.created_at).toLocaleDateString('th-TH')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {users.length > 0 && (
        <div className="mt-6 text-center text-gray-400">
          พบผู้ใช้ทั้งหมด {users.length} คน
        </div>
      )}
    </div>
  );
}

export default AdminUsersPage;
