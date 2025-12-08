import api from './api';

export interface SystemStats {
  total_users: number;
  total_providers: number;
  total_clients: number;
  total_bookings: number;
  completed_bookings: number;
  total_revenue: number;
  active_users_24h: number;
  new_users_today: number;
  bookings_today: number;
  revenue_today: number;
  pending_verifications: number;
  average_rating: number;
}

export interface ServerInfo {
  version: string;
  environment: string;
  go_version: string;
  endpoints: {
    public: number;
    protected: number;
    admin: number;
    god: number;
  };
  features: string[];
}

export interface DatabaseStats {
  total_connections: number;
  acquired_connections: number;
  idle_connections: number;
  max_connections: number;
  acquire_count: number;
  empty_acquire_count: number;
  canceled_acquire_count: number;
}

// Get system-wide statistics
export const getSystemStats = async (): Promise<SystemStats> => {
  const response = await api.get<SystemStats>('/api/stats/system');
  return response.data;
};

// Get server information
export const getServerInfo = async (): Promise<ServerInfo> => {
  const response = await api.get<ServerInfo>('/api/info');
  return response.data;
};

// Get database statistics (admin only)
export const getDatabaseStats = async (): Promise<DatabaseStats> => {
  const response = await api.get<DatabaseStats>('/admin/stats/database');
  return response.data;
};
