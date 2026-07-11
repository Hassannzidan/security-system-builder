/**
 * Shared enumerations used across the web and api applications.
 */

export enum ProductCategory {
  Camera = 'camera',
  Sensor = 'sensor',
  Alarm = 'alarm',
  Controller = 'controller',
  Accessory = 'accessory',
}

export enum ProductStatus {
  Active = 'active',
  Draft = 'draft',
  Discontinued = 'discontinued',
}

export enum ApiErrorCode {
  BadRequest = 'BAD_REQUEST',
  ValidationError = 'VALIDATION_ERROR',
  NotFound = 'NOT_FOUND',
  Internal = 'INTERNAL_ERROR',
}
