'use client';

import { finePointerQuery } from '@/lib/motion';
import { useMediaQuery } from './useMediaQuery';

/** True on devices with a mouse / trackpad. Touch devices return false. */
export const useFinePointer = (): boolean => useMediaQuery(finePointerQuery, false);
