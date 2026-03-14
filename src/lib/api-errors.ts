import { NextResponse } from "next/server";

export interface ApiErrorBody {
  error: string;
  code?: string;
}

/**
 * Standard API error response. Use in all API routes for consistent shape.
 */
export function apiError(
  message: string,
  status: number,
  code?: string
): NextResponse<ApiErrorBody> {
  const body: ApiErrorBody = { error: message };
  if (code) body.code = code;
  return NextResponse.json(body, { status });
}
