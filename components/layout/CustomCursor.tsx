'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { finePointerQuery, reducedMotionQuery } from '@/lib/motion';

type CursorMode = 'default' | 'hover' | 'view' | 'hidden';

const INTERACTIVE = 'a, button, [role="button"], summary, label';
const TEXT_INPUTS = 'input, textarea, select';

/**
 * Minimal ring cursor for mouse users. The native cursor stays visible so text
 * selection and form interaction keep their familiar affordances.
 */
export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia(finePointerQuery);
    const reduced = window.matchMedia(reducedMotionQuery);
    if (!fine.matches || reduced.matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.32, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.32, ease: 'power3.out' });
    let visible = false;

    const setMode = (mode: CursorMode) => {
      el.dataset.mode = mode;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      xTo(event.clientX);
      yTo(event.clientY);
      if (!visible) {
        visible = true;
        gsap.set(el, { x: event.clientX, y: event.clientY });
        el.dataset.visible = 'true';
      }
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      const custom = target.closest<HTMLElement>('[data-cursor]');
      if (custom) {
        setMode((custom.dataset.cursor as CursorMode) || 'hover');
        return;
      }
      if (target.closest(TEXT_INPUTS)) {
        setMode('hidden');
        return;
      }
      setMode(target.closest(INTERACTIVE) ? 'hover' : 'default');
    };

    const onLeave = () => {
      el.dataset.visible = 'false';
      visible = false;
    };
    const onEnter = () => {
      el.dataset.visible = 'true';
      visible = true;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return (
    <div ref={ref} className="cursor hidden lg:block" data-mode="default" aria-hidden="true">
      <span className="cursor__label">VIEW</span>
    </div>
  );
}
