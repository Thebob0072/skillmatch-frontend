import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function CreateUserPage() {
  const { t } = useTranslation();
  const [role, setRole] = useState('client');

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500 mb-8">
        {t('create_user_title') || 'Create New User'}
      </h1>
      
      <div className="bg-gray-800 rounded-xl p-8 shadow-2xl">
        <form className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter username"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter email"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter password"
            />
          </div>
          
          {/* ⚠️ WARNING: GOD role (tier_id = 5) cannot be created via UI */}
          {/* GOD accounts must be manually created in database for security */}
          <div>
            <label className="block text-gray-300 mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="client">Client</option>
              <option value="provider">Companion</option>
              <option value="admin">Admin</option>
              {/* GOD tier excluded - database only */}
            </select>
          </div>
          
          {role === 'admin' && (
            <div>
              <label className="block text-gray-300 mb-2">Admin Tier</label>
              <select
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="1">General (Tier 1)</option>
                <option value="2">Silver (Tier 2)</option>
                <option value="3">Diamond (Tier 3)</option>
                <option value="4">Premium (Tier 4)</option>
                {/* Tier 5 (GOD) is NOT available - must be set in database */}
              </select>
              <p className="text-xs text-gray-400 mt-2">
                ⚠️ GOD tier (Tier 5) cannot be assigned via UI. Must be manually set in database.
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <input type="checkbox" id="verified" className="w-5 h-5" />
            <label htmlFor="verified" className="text-gray-300">Create as verified user</label>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateUserPage;
