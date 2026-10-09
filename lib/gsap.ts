import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/**
 * Single place where GSAP plugins are registered. Import `gsap`, `ScrollTrigger`
 * and `SplitText` from here inside client components.
 */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: 'power3.out', duration: 0.9 });
}

export { gsap, ScrollTrigger, SplitText };
