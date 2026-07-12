import { NextResponse } from 'next/server';
import { ZodError, type ZodSchema } from 'zod';
import { jsonError } from './api-response';
import { createRequestId, logger } from './logger';

type RouteContext = { params: Promise<Record<string, string>> };

type RouteHandler = (request: Request, context: RouteContext) => Promise<Response>;

export function withApiHandler(handler: RouteHandler, routeName?: string): RouteHandler {
  return async (request, context) => {
    const requestId = createRequestId();
    try {
      const response = await handler(request, context);
      response.headers.set('X-Request-Id', requestId);
      return response;
    } catch (err) {
      logger.error('Unhandled API error', {
        requestId,
        route: routeName ?? request.url,
        error: err instanceof Error ? err.message : String(err),
      });
      const res = jsonError('Sunucu hatasi', 500, requestId);
      res.headers.set('X-Request-Id', requestId);
      return res;
    }
  };
}

export async function parseValidatedBody<T>(request: Request, schema: ZodSchema<T>): Promise<{ data: T } | { error: Response }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { error: jsonError('Gecersiz JSON govdesi', 400) };
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    const message = formatZodError(result.error);
    return { error: jsonError(message, 422) };
  }
  return { data: result.data };
}

function formatZodError(error: ZodError): string {
  const first = error.issues[0];
  if (!first) return 'Dogrulama hatasi';
  return `${first.path.join('.')}: ${first.message}`;
}
