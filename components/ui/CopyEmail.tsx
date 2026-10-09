'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  email: string;
  className?: string;
}

/** Shows the studio email; clicking copies it to the clipboard with feedback. */
export default function CopyEmail({ email, className }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-x-5 gap-y-3', className)}>
      <a
        href={`mailto:${email}`}
        className="link-underline font-heading text-h3 font-bold tracking-tight break-all"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-muted transition-colors duration-300 hover:border-fg hover:text-fg"
        aria-label={copied ? 'Email copied' : 'Copy email address'}
      >
        {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
        <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
}
