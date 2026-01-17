/**
 * Standardized Error Handling Utilities
 * 
 * Provides consistent error handling across the entire application:
 * - Type-safe error extraction
 * - Standardized error responses
 * - Error logging and monitoring
 * - User-friendly error messages
 */

export enum ErrorType {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: unknown;
  statusCode?: number;
  timestamp: string;
}

/**
 * Create a standardized app error
 */
export function createAppError(
  type: ErrorType,
  message: string,
  details?: unknown,
  statusCode?: number
): AppError {
  return {
    type,
    message,
    details,
    statusCode: statusCode || getDefaultStatusCode(type),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get default HTTP status code for error type
 */
function getDefaultStatusCode(type: ErrorType): number {
  const statusCodes: Record<ErrorType, number> = {
    [ErrorType.AUTHENTICATION]: 401,
    [ErrorType.AUTHORIZATION]: 403,
    [ErrorType.VALIDATION]: 400,
    [ErrorType.NOT_FOUND]: 404,
    [ErrorType.DATABASE]: 500,
    [ErrorType.NETWORK]: 503,
    [ErrorType.RATE_LIMIT]: 429,
    [ErrorType.SERVER]: 500,
    [ErrorType.UNKNOWN]: 500,
  };
  return statusCodes[type];
}

/**
 * Extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return 'Unknown error occurred';
  
  if (typeof error === 'string') return error;
  
  if (error instanceof Error) return error.message;
  
  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }
  }
  
  return 'An unexpected error occurred';
}

/**
 * Determine error type from error object
 */
export function getErrorType(error: unknown): ErrorType {
  const message = getErrorMessage(error).toLowerCase();
  
  if (message.includes('auth') || message.includes('unauthorized')) {
    return ErrorType.AUTHENTICATION;
  }
  if (message.includes('forbidden') || message.includes('permission')) {
    return ErrorType.AUTHORIZATION;
  }
  if (message.includes('invalid') || message.includes('validation')) {
    return ErrorType.VALIDATION;
  }
  if (message.includes('not found')) {
    return ErrorType.NOT_FOUND;
  }
  if (message.includes('database') || message.includes('query')) {
    return ErrorType.DATABASE;
  }
  if (message.includes('network') || message.includes('fetch')) {
    return ErrorType.NETWORK;
  }
  if (message.includes('rate limit') || message.includes('too many')) {
    return ErrorType.RATE_LIMIT;
  }
  
  return ErrorType.UNKNOWN;
}

/**
 * Convert unknown error to AppError
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }
  
  const message = getErrorMessage(error);
  const type = getErrorType(error);
  
  return createAppError(type, message, error);
}

/**
 * Check if error is AppError
 */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error &&
    'timestamp' in error
  );
}

/**
 * Get user-friendly error message (translated to Mongolian)
 */
export function getUserFriendlyMessage(error: AppError): string {
  const messages: Record<ErrorType, string> = {
    [ErrorType.AUTHENTICATION]: 'Нэвтрэх эрх баталгаажуулалт амжилтгүй. Дахин нэвтэрнэ үү.',
    [ErrorType.AUTHORIZATION]: 'Таньд энэ үйлдэл хийх эрх байхгүй байна.',
    [ErrorType.VALIDATION]: 'Оруулсан мэдээлэл буруу байна. Шалгаад дахин оролдоно уу.',
    [ErrorType.NOT_FOUND]: 'Хайсан мэдээлэл олдсонгүй.',
    [ErrorType.DATABASE]: 'Өгөгдлийн санд алдаа гарлаа. Дахин оролдоно уу.',
    [ErrorType.NETWORK]: 'Сүлжээний алдаа гарлаа. Интернет холболтоо шалгана уу.',
    [ErrorType.RATE_LIMIT]: 'Хэт олон хүсэлт илгээсэн байна. Түр хүлээгээд дахин оролдоно уу.',
    [ErrorType.SERVER]: 'Серверийн алдаа гарлаа. Удахгүй засварлагдах болно.',
    [ErrorType.UNKNOWN]: 'Тодорхойгүй алдаа гарлаа. Дахин оролдоно уу.',
  };
  
  return messages[error.type] || error.message;
}

/**
 * Log error (with optional external service integration)
 */
export function logError(error: AppError, context?: Record<string, unknown>): void {
  const isDev = process.env.NODE_ENV === 'development';
  
  const logData = {
    ...error,
    context,
    environment: process.env.NODE_ENV,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
  };
  
  if (isDev) {
    console.error('[AppError]', logData);
  }
  
  // TODO: Send to external error tracking service (Sentry, LogRocket, etc.)
  // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  //   Sentry.captureException(error, { extra: context });
  // }
}

/**
 * Handle error with logging and user notification
 */
export function handleError(
  error: unknown,
  context?: Record<string, unknown>
): AppError {
  const appError = toAppError(error);
  logError(appError, context);
  return appError;
}

/**
 * Async error wrapper for API routes
 */
export async function asyncHandler<T>(
  fn: () => Promise<T>
): Promise<{ data?: T; error?: AppError }> {
  try {
    const data = await fn();
    return { data };
  } catch (error) {
    return { error: handleError(error) };
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries - 1) {
        const delay = delayMs * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}
