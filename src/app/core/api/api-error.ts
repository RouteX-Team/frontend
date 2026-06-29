import { HttpErrorResponse } from '@angular/common/http';

/** Pulls a human-readable message out of an API ProblemDetails / HTTP error. */
export function extractApiError(err: unknown, fallback = 'Something went wrong.'): string {
  if (err instanceof HttpErrorResponse) {
    if (err.error && typeof err.error === 'object') {
      const body = err.error as { detail?: unknown; title?: unknown };
      if (typeof body.detail === 'string') return body.detail;
      if (typeof body.title === 'string') return body.title;
    }
    if (err.status === 0) return 'Cannot reach the server. Is the API running?';
    return `Request failed (${err.status}).`;
  }
  return fallback;
}
