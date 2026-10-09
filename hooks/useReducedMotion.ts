'use client';

import { reducedMotionQuery } from '@/lib/motion';
import { useMediaQuery } from './useMediaQuery';

export const useReducedMotion = (): boolean => useMediaQuery(reducedMotionQuery, false);
