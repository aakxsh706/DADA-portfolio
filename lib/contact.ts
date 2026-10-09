/** Shared contact-form schema and validation (used by the client form and the API route). */

export interface ContactInput {
  name: string;
  email: string;
  projectType: string;
  budget?: string;
  message: string;
  /** Honeypot — must stay empty. */
  company?: string;
  /** Epoch ms when the form was rendered — used as a time trap. */
  startedAt?: number;
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export type ContactStatus =
  | { state: 'idle' }
  | { state: 'submitting' }
  | { state: 'success' }
  | { state: 'error'; message: string; code?: string };

export const limits = {
  name: 80,
  email: 120,
  projectType: 60,
  budget: 60,
  message: 2000,
} as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export const sanitize = (value: unknown, max: number): string =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '';

export const normalizeContact = (raw: Record<string, unknown>): ContactInput => ({
  name: sanitize(raw.name, limits.name),
  email: sanitize(raw.email, limits.email),
  projectType: sanitize(raw.projectType, limits.projectType),
  budget: sanitize(raw.budget, limits.budget),
  message: typeof raw.message === 'string' ? raw.message.trim().slice(0, limits.message) : '',
  company: typeof raw.company === 'string' ? raw.company : '',
  startedAt: typeof raw.startedAt === 'number' ? raw.startedAt : Number(raw.startedAt) || 0,
});

export const validateContact = (input: ContactInput): ContactErrors => {
  const errors: ContactErrors = {};
  if (input.name.length < 2) errors.name = 'Please tell us your name.';
  if (!emailPattern.test(input.email)) errors.email = 'Please enter a valid email address.';
  if (!input.projectType) errors.projectType = 'Please choose a project type.';
  if (input.message.length < 20) errors.message = 'Please share a little more detail (20+ characters).';
  if ((input.message.match(/https?:\/\//gi) ?? []).length > 3)
    errors.message = 'Please keep links to a minimum.';
  return errors;
};

export const hasErrors = (errors: ContactErrors): boolean => Object.keys(errors).length > 0;
