'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { siteConfig } from '@/data/site-config';
import {
  hasErrors,
  normalizeContact,
  validateContact,
  type ContactErrors,
  type ContactStatus,
} from '@/lib/contact';
import MagneticButton from './MagneticButton';
import ArrowIcon from './ArrowIcon';
import { cn } from '@/lib/utils';

type Field = 'name' | 'email' | 'projectType' | 'budget' | 'message';

const fieldLabel: Record<Field, string> = {
  name: 'Name',
  email: 'Email',
  projectType: 'Project type',
  budget: 'Budget range (optional)',
  message: 'Message',
};

/**
 * Contact form with client + server validation, honeypot and time-trap spam
 * checks, and honest delivery states. If no delivery provider is configured the
 * API answers 503 and the form offers a prefilled email instead of pretending.
 */
export default function ContactForm({ className }: { className?: string }) {
  const id = useId();
  const startedAt = useRef<number>(0);
  const [status, setStatus] = useState<ContactStatus>({ state: 'idle' });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [values, setValues] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    message: '',
  });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const update = (field: Field, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const mailtoFallback = () => {
    const subject = encodeURIComponent(`Project inquiry — ${values.projectType || 'Website'}`);
    const body = encodeURIComponent(
      `Name: ${values.name}\nEmail: ${values.email}\nProject type: ${values.projectType}\nBudget: ${values.budget || '—'}\n\n${values.message}`,
    );
    return `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const input = normalizeContact({
      ...values,
      company: String(data.get('company') ?? ''),
      startedAt: startedAt.current,
    });
    const clientErrors = validateContact(input);
    if (hasErrors(clientErrors)) {
      setErrors(clientErrors);
      const firstField = Object.keys(clientErrors)[0];
      form.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus();
      return;
    }

    setStatus({ state: 'submitting' });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        message?: string;
        errors?: ContactErrors;
      };
      if (response.ok && payload.ok) {
        setStatus({ state: 'success' });
        return;
      }
      if (payload.errors) setErrors(payload.errors);
      setStatus({
        state: 'error',
        code: payload.code,
        message:
          payload.message ||
          'Something went wrong while sending your message. Please try again or email us directly.',
      });
    } catch {
      setStatus({
        state: 'error',
        code: 'network',
        message: 'We could not reach the server. Please check your connection or email us directly.',
      });
    }
  };

  const describedBy = (field: Field) => (errors[field] ? `${id}-${field}-error` : undefined);

  return (
    <div className={cn('relative', className)}>
      <AnimatePresence mode="wait" initial={false}>
        {status.state === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-line p-8 md:p-12"
            role="status"
            aria-live="polite"
          >
            <p className="eyebrow mb-4 text-accent">Message sent</p>
            <h3 className="text-h3 font-heading uppercase">Thank you — we&apos;ll be in touch soon.</h3>
            <p className="mt-4 max-w-md text-muted">
              Your message has been delivered. We usually reply within one or two working days.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            onSubmit={submit}
            noValidate
            className="grid gap-10"
          >
            <div className="grid gap-10 md:grid-cols-2">
              <FormField id={`${id}-name`} label={fieldLabel.name} error={errors.name}>
                <input
                  id={`${id}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={80}
                  value={values.name}
                  onChange={(e) => update('name', e.target.value)}
                  className="field"
                  placeholder="Your name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describedBy('name')}
                />
              </FormField>
              <FormField id={`${id}-email`} label={fieldLabel.email} error={errors.email}>
                <input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={120}
                  value={values.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="field"
                  placeholder="you@company.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy('email')}
                />
              </FormField>
              <FormField
                id={`${id}-projectType`}
                label={fieldLabel.projectType}
                error={errors.projectType}
              >
                <select
                  id={`${id}-projectType`}
                  name="projectType"
                  required
                  value={values.projectType}
                  onChange={(e) => update('projectType', e.target.value)}
                  className="field"
                  aria-invalid={Boolean(errors.projectType)}
                  aria-describedby={describedBy('projectType')}
                >
                  <option value="" disabled>
                    Select a project type
                  </option>
                  {siteConfig.contactForm.projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField id={`${id}-budget`} label={fieldLabel.budget} error={errors.budget}>
                <select
                  id={`${id}-budget`}
                  name="budget"
                  value={values.budget}
                  onChange={(e) => update('budget', e.target.value)}
                  className="field"
                >
                  <option value="">Prefer not to say</option>
                  {siteConfig.contactForm.budgets.map((budget) => (
                    <option key={budget} value={budget}>
                      {budget}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField id={`${id}-message`} label={fieldLabel.message} error={errors.message}>
              <textarea
                id={`${id}-message`}
                name="message"
                required
                rows={4}
                maxLength={2000}
                value={values.message}
                onChange={(e) => update('message', e.target.value)}
                className="field resize-y"
                placeholder="Tell us about the project, timeline and goals."
                aria-invalid={Boolean(errors.message)}
                aria-describedby={describedBy('message')}
              />
            </FormField>

            {/* Honeypot: hidden from people, tempting for bots. */}
            <div className="hp" aria-hidden="true">
              <label htmlFor={`${id}-company`}>Company</label>
              <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <AnimatePresence>
              {status.state === 'error' ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="alert"
                  className="rounded-2xl border border-line-strong p-5 text-sm leading-relaxed"
                >
                  {status.code === 'not_configured' ? (
                    <>
                      <p className="font-medium text-fg">Direct delivery isn&apos;t configured yet.</p>
                      <p className="mt-1 text-muted">
                        This form needs an email provider key (see README). In the meantime, send
                        your message straight from your inbox:
                      </p>
                      <a
                        href={mailtoFallback()}
                        className="link-underline mt-3 inline-block font-heading text-sm font-bold uppercase tracking-[0.12em] text-accent"
                      >
                        Open prefilled email
                      </a>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-fg">{status.message}</p>
                      <a
                        href={mailtoFallback()}
                        className="link-underline mt-3 inline-block font-heading text-sm font-bold uppercase tracking-[0.12em] text-accent"
                      >
                        Email us instead
                      </a>
                    </>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="flex flex-wrap items-center justify-between gap-6">
              <p className="max-w-sm text-sm text-muted">
                We reply to every genuine inquiry. Your details are only used to answer you.
              </p>
              <MagneticButton
                type="submit"
                variant="accent"
                size="lg"
                disabled={status.state === 'submitting'}
              >
                {status.state === 'submitting' ? 'Sending…' : 'Start a project'}
                <ArrowIcon />
              </MagneticButton>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group/field relative">
      <label htmlFor={id} className="eyebrow mb-1 block transition-colors group-focus-within/field:text-fg">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error ? (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-sm text-[#ff8a8a]"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
