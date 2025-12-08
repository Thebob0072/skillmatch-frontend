import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { godService, type GodStats } from '../../services/godService';

const GodDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState<GodStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await godService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load God stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">👑</div>
          <p className="text-white text-xl">Loading God Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black">
      {/* Divine Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent animate-pulse pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent animate-pulse pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-8xl mb-4 animate-float drop-shadow-[0_0_50px_rgba(255,215,0,1)]">👑</div>
          <h1 className="text-6xl font-black mb-4">
            <span style={{
              background: 'linear-gradient(to right, #ffd700, #ffed4e, #ffd700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))',
              display: 'inline-block'
            }}>
              GOD MODE
            </span>
          </h1>
          <p className="text-2xl text-gray-300 font-bold mb-2">
            Welcome, <span className="text-neon-gold">{user?.username}</span>
          </p>
          <p className="text-gray-400">Complete System Control & Override</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link 
            to="/god/users"
            className="bg-gradient-to-br from-neon-gold/20 to-yellow-600/20 backdrop-blur-xl border-2 border-neon-gold p-6 rounded-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,215,0,0.4)] hover:shadow-[0_0_60px_rgba(255,215,0,0.6)] block"
          >
            <div className="text-5xl mb-3">👥</div>
            <div className="text-xl font-black text-white">User Control</div>
            <p className="text-sm text-gray-400 mt-2">Manage all users</p>
          </Link>

          <button className="bg-gradient-to-br from-red-500/20 to-red-900/20 backdrop-blur-xl border-2 border-neon-red p-6 rounded-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,0,85,0.4)] hover:shadow-[0_0_60px_rgba(255,0,85,0.6)]">
            <div className="text-5xl mb-3">🔨</div>
            <div className="text-xl font-black text-white">Ban Hammer</div>
            <p className="text-sm text-gray-400 mt-2">Instant user control</p>
          </button>

          <button className="bg-gradient-to-br from-green-500/20 to-green-900/20 backdrop-blur-xl border-2 border-green-500 p-6 rounded-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(0,255,0,0.4)] hover:shadow-[0_0_60px_rgba(0,255,0,0.6)]">
            <div className="text-5xl mb-3">💰</div>
            <div className="text-xl font-black text-white">Financials</div>
            <p className="text-sm text-gray-400 mt-2">All transactions</p>
          </button>

          <button className="bg-gradient-to-br from-blue-500/20 to-blue-900/20 backdrop-blur-xl border-2 border-blue-500 p-6 rounded-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(0,150,255,0.4)] hover:shadow-[0_0_60px_rgba(0,150,255,0.6)]">
            <div className="text-5xl mb-3">📊</div>
            <div className="text-xl font-black text-white">Analytics</div>
            <p className="text-sm text-gray-400 mt-2">Deep insights</p>
          </button>
        </div>

        {/* System Stats */}
        {stats && (
          <div className="bg-black/50 backdrop-blur-2xl border-2 border-neon-gold/50 rounded-3xl p-8 shadow-[0_0_60px_rgba(255,215,0,0.3)] mb-12">
            <h2 className="text-3xl font-black text-neon-gold mb-6 flex items-center gap-3">
              <span>📈</span>
              System Statistics
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-neon-purple/20 to-transparent rounded-xl border border-neon-purple/30">
                <div className="text-4xl font-black text-neon-purple mb-2">
                  {stats.total_users.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Total Users</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-neon-pink/20 to-transparent rounded-xl border border-neon-pink/30">
                <div className="text-4xl font-black text-neon-pink mb-2">
                  {stats.total_providers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Providers</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-neon-blue/20 to-transparent rounded-xl border border-neon-blue/30">
                <div className="text-4xl font-black text-neon-blue mb-2">
                  {stats.total_clients.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Clients</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-neon-gold/20 to-transparent rounded-xl border border-neon-gold/30">
                <div className="text-4xl font-black text-neon-gold mb-2">
                  {stats.total_admins.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Admins</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-transparent rounded-xl border border-green-500/30">
                <div className="text-4xl font-black text-green-400 mb-2">
                  {stats.total_bookings.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Bookings</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-neon-gold/20 to-transparent rounded-xl border border-neon-gold/30">
                <div className="text-3xl font-black text-neon-gold mb-2">
                  ฿{stats.total_revenue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Total Revenue</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-orange-500/20 to-transparent rounded-xl border border-orange-500/30">
                <div className="text-4xl font-black text-orange-400 mb-2">
                  {stats.pending_verification.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Pending Verification</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-xl border border-cyan-500/30">
                <div className="text-4xl font-black text-cyan-400 mb-2">
                  {stats.active_users_24h.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Active 24h</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-green-400/20 to-transparent rounded-xl border border-green-400/30">
                <div className="text-4xl font-black text-green-300 mb-2">
                  {stats.new_users_today.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">New Today</div>
              </div>
            </div>
          </div>
        )}

        {/* God Powers */}
        <div className="bg-black/50 backdrop-blur-2xl border-2 border-neon-gold/50 rounded-3xl p-8 shadow-[0_0_60px_rgba(255,215,0,0.3)]">
          <h2 className="text-3xl font-black text-neon-gold mb-6 flex items-center gap-3">
            <span>⚡</span>
            God Powers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-900/30 to-transparent border border-neon-purple/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>👥</span>
                User Management
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Create/Delete any user</li>
                <li>• Modify roles & tiers</li>
                <li>• Instant verification override</li>
                <li>• View all private data</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-900/30 to-transparent border border-neon-red/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🔒</span>
                Security Control
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Ban/Unban instantly</li>
                <li>• View all login sessions</li>
                <li>• Force logout all users</li>
                <li>• Access logs & audit trail</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-transparent border border-green-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>💳</span>
                Financial Override
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Process refunds instantly</li>
                <li>• Adjust wallet balances</li>
                <li>• Override payment status</li>
                <li>• Generate financial reports</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-transparent border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>⚙️</span>
                System Configuration
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Modify platform settings</li>
                <li>• Enable maintenance mode</li>
                <li>• Configure payment gateways</li>
                <li>• Backup & restore database</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-8 bg-gradient-to-r from-red-900/30 to-orange-900/30 backdrop-blur-xl border-2 border-neon-red/50 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">⚠️</div>
            <div>
              <h4 className="text-neon-red font-black text-lg mb-2">God Mode Warning</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                You have <strong>unlimited power</strong> over this system. All actions are logged and audited. 
                Use these powers responsibly. With great power comes great responsibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GodDashboardPage;
