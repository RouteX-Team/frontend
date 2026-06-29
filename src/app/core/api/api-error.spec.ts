import { HttpErrorResponse } from '@angular/common/http';
import { extractApiError } from './api-error';

describe('extractApiError', () => {
  it('returns the ProblemDetails detail when present', () => {
    const err = new HttpErrorResponse({ error: { detail: 'Route not found.' }, status: 404 });
    expect(extractApiError(err)).toBe('Route not found.');
  });

  it('falls back to the ProblemDetails title', () => {
    const err = new HttpErrorResponse({ error: { title: 'Conflict' }, status: 409 });
    expect(extractApiError(err)).toBe('Conflict');
  });

  it('reports an unreachable server for status 0', () => {
    const err = new HttpErrorResponse({ status: 0 });
    expect(extractApiError(err)).toContain('Cannot reach the server');
  });

  it('uses the provided fallback for non-HTTP errors', () => {
    expect(extractApiError(new Error('boom'), 'custom fallback')).toBe('custom fallback');
  });
});
