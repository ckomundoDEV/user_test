/**
 * Format date to locale string
 */
export const formatDate = (dateString: string, locale = 'es-ES'): string => {
  try {
    return new Date(dateString).toLocaleDateString(locale);
  } catch {
    return 'Fecha inválida';
  }
};

/**
 * Format date and time to locale string
 */
export const formatDateTime = (dateString: string, locale = 'es-ES'): string => {
  try {
    return new Date(dateString).toLocaleString(locale);
  } catch {
    return 'Fecha inválida';
  }
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (text: string): string => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Generate initials from full name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};
