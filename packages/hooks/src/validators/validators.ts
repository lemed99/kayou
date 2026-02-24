import type { FieldValidator } from './types';

export function required(msg = 'This field is required'): FieldValidator {
  return (value: unknown) => {
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      (typeof value === 'number' && Number.isNaN(value))
    )
      return msg;
    return undefined;
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function email(msg = 'Invalid email address'): FieldValidator {
  return (value: unknown) => {
    if (typeof value !== 'string' || value === '') return undefined;
    if (!EMAIL_RE.test(value)) return msg;
    return undefined;
  };
}

export function minLength(len: number, msg?: string): FieldValidator {
  const message = msg ?? `Must be at least ${len} characters`;
  return (value: unknown) => {
    if (typeof value !== 'string' || value === '') return undefined;
    if (value.length < len) return message;
    return undefined;
  };
}

export function maxLength(len: number, msg?: string): FieldValidator {
  const message = msg ?? `Must be at most ${len} characters`;
  return (value: unknown) => {
    if (typeof value !== 'string' || value === '') return undefined;
    if (value.length > len) return message;
    return undefined;
  };
}

export function pattern(regex: RegExp, msg = 'Invalid format'): FieldValidator {
  return (value: unknown) => {
    if (typeof value !== 'string' || value === '') return undefined;
    if (!regex.test(value)) return msg;
    return undefined;
  };
}

export function min(n: number, msg?: string): FieldValidator {
  const message = msg ?? `Must be at least ${n}`;
  return (value: unknown) => {
    if (typeof value !== 'number') return undefined;
    if (value < n) return message;
    return undefined;
  };
}

export function max(n: number, msg?: string): FieldValidator {
  const message = msg ?? `Must be at most ${n}`;
  return (value: unknown) => {
    if (typeof value !== 'number') return undefined;
    if (value > n) return message;
    return undefined;
  };
}
