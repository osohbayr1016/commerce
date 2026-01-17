import { NextResponse } from 'next/server';
import { createAppError, ErrorType, AppError } from '@/lib/errors';

/**
 * Create standardized error response for API routes
 */
export function createErrorResponse(
  error: unknown,
  statusCode?: number
): NextResponse<{ error: AppError }> {
  let appError: AppError;
  
  if (typeof error === 'object' && error !== null && 'type' in error) {
    appError = error as AppError;
  } else if (error instanceof Error) {
    appError = createAppError(
      ErrorType.SERVER,
      error.message,
      error,
      statusCode
    );
  } else {
    appError = createAppError(
      ErrorType.UNKNOWN,
      'An unexpected error occurred',
      error,
      statusCode
    );
  }
  
  return NextResponse.json(
    { error: appError },
    { status: appError.statusCode || statusCode || 500 }
  );
}

/**
 * Create standardized success response for API routes
 */
export function createSuccessResponse<T>(
  data: T,
  statusCode = 200
): NextResponse<{ data: T; success: true }> {
  return NextResponse.json(
    { data, success: true },
    { status: statusCode }
  );
}

/**
 * Validate required fields in request body
 */
export function validateRequired(
  body: Record<string, unknown>,
  required: string[]
): { valid: boolean; error?: AppError } {
  const missing = required.filter(field => !body[field]);
  
  if (missing.length > 0) {
    return {
      valid: false,
      error: createAppError(
        ErrorType.VALIDATION,
        `Missing required fields: ${missing.join(', ')}`,
        { missingFields: missing },
        400
      ),
    };
  }
  
  return { valid: true };
}

/**
 * API route error handler wrapper
 */
export function withErrorHandling<T = unknown>(
  handler: (request: Request, ...args: any[]) => Promise<NextResponse<T>>
) {
  return async (request: Request, ...args: any[]): Promise<NextResponse> => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      console.error('[API Error]', error);
      return createErrorResponse(error);
    }
  };
}
