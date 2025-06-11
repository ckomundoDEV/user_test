export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
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
  mostActiveUsers: Array<{
    id: string;
    name: string;
    total_views: number;
  }>;
} 