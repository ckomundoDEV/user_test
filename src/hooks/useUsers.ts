import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserPaginatedResponse, UserAnalytics, User, CreateUserDTO, PageSize } from '@/types/user';
import { userService } from '@/services/userService';
import { useErrorHandler } from './useErrorHandler';
import { LOADING_MESSAGES } from '@/constants';

interface UseUsersParams {
  q?: string;
  sort?: string;
  page?: number;
  pageSize?: PageSize;
}

export const useUsers = (params: UseUsersParams = {}) => {
  const queryClient = useQueryClient();
  const { handleApiError } = useErrorHandler();

  // Query key that includes all filter parameters
  const getUsersQueryKey = (params: UseUsersParams) => [
    'users', 
    params.q, 
    params.sort, 
    params.page, 
    params.pageSize
  ];

  // Fetch users with filters
  const {
    data: paginatedUsers,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: refetchUsers
  } = useQuery<UserPaginatedResponse, Error>({
    queryKey: getUsersQueryKey(params),
    queryFn: async () => userService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });

  // Fetch analytics
  const {
    data: analytics,
    isLoading: isLoadingAnalytics,
    error: analyticsError
  } = useQuery<UserAnalytics, Error>({
    queryKey: ['analytics'],
    queryFn: async () => userService.getAnalytics(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2
  });

  // Delete user mutation
  const {
    mutateAsync: deleteUser,
    isPending: isDeletingUser
  } = useMutation<void, Error, string>({
    mutationFn: async (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (error) => {
      handleApiError(error, 'Error al eliminar usuario');
    }
  });

  // Create/Update user mutation
  const {
    mutateAsync: saveUser,
    isPending: isSavingUser
  } = useMutation<User, Error, { userData: CreateUserDTO; userId?: string }>({
    mutationFn: async ({ userData, userId }) => {
      if (userId) {
        return userService.updateUser(userId, userData);
      }
      return userService.createUser(userData);
    },
    onSuccess: () => {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (error) => {
      handleApiError(error, 'Error al guardar usuario');
    }
  });

  // Helper function to create user
  const createUser = async (userData: CreateUserDTO) => {
    return saveUser({ userData });
  };

  // Helper function to update user
  const updateUser = async (userId: string, userData: CreateUserDTO) => {
    return saveUser({ userData, userId });
  };

  // Prefetch next page for better UX
  const prefetchNextPage = (nextParams: UseUsersParams) => {
    queryClient.prefetchQuery({
      queryKey: getUsersQueryKey(nextParams),
      queryFn: async () => userService.getUsers(nextParams),
      staleTime: 5 * 60 * 1000
    });
  };

  // Get current data
  const users = paginatedUsers?.items || [];
  const paginationMeta = paginatedUsers?.meta;

  // Loading states
  const isLoading = isLoadingUsers || isDeletingUser || isSavingUser;
  const isLoadingData = isLoadingUsers;

  // Error handling
  const hasError = usersError || analyticsError;

  return {
    // Data
    users,
    paginationMeta,
    analytics,
    
    // Loading states
    isLoading,
    isLoadingData,
    isLoadingUsers,
    isLoadingAnalytics,
    isDeletingUser,
    isSavingUser,
    
    // Error states
    hasError,
    usersError,
    analyticsError,
    
    // Actions
    createUser,
    updateUser,
    deleteUser,
    refetchUsers,
    prefetchNextPage,
    
    // Loading messages
    loadingMessage: isDeletingUser 
      ? LOADING_MESSAGES.DELETING_USER 
      : isSavingUser 
      ? LOADING_MESSAGES.UPDATING_USER 
      : LOADING_MESSAGES.LOADING_USERS
  };
};
