export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
}

export interface UserAnalytics {
  totalUsers: number;
  totalPageViews: number;
  // mostActiveUsers?: Array<{ id: string; name: string; total_views: number }>;
  recentUsers: Array<{
    id: string | number;
    name: string;
    email: string;
    created_at: string;
  }>;
  analytics?: unknown[];
} 