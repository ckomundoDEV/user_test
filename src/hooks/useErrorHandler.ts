import { useState, useCallback } from 'react';
import { ERROR_MESSAGES } from '@/constants';

interface ErrorState {
  isOpen: boolean;
  message: string | null;
}

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorState>({
    isOpen: false,
    message: null
  });

  const showError = useCallback((message: string) => {
    setError({
      isOpen: true,
      message
    });
  }, []);

  const clearError = useCallback(() => {
    setError({
      isOpen: false,
      message: null
    });
  }, []);

  const handleApiError = useCallback((err: unknown, fallbackMessage?: string) => {
    let message: string;
    
    if (err instanceof Error) {
      message = err.message;
    } else if (typeof err === 'string') {
      message = err;
    } else {
      message = fallbackMessage || ERROR_MESSAGES.UNKNOWN_ERROR;
    }
    
    showError(message);
  }, [showError]);

  const handleNetworkError = useCallback(() => {
    showError(ERROR_MESSAGES.NETWORK_ERROR);
  }, [showError]);

  return {
    error: error.message,
    isErrorOpen: error.isOpen,
    showError,
    clearError,
    handleApiError,
    handleNetworkError
  };
};
