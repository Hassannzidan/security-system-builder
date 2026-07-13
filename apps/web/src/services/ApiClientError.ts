/**
 * Error thrown by the API client when a request fails. Carries the envelope
 * `code` and the HTTP `statusCode` alongside the human-readable message so UI
 * code can branch on the failure without re-parsing Axios internals.
 */
export class ApiClientError extends Error {
  /** Machine-readable code from the error envelope, or a synthetic fallback. */
  readonly code: string;
  /** HTTP status, or 0 when the request never reached the server (network error). */
  readonly statusCode: number;

  constructor(params: { code: string; message: string; statusCode: number }) {
    super(params.message);
    this.name = 'ApiClientError';
    this.code = params.code;
    this.statusCode = params.statusCode;
    // Restore the prototype chain for `instanceof` under transpiled targets.
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}
