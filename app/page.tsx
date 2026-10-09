import Hero from '@/components/sections/Hero';
import MarqueeSection from '@/components/sections/MarqueeSection';
import Approach from '@/components/sections/Approach';
import SelectedWork from '@/components/sections/SelectedWork';
import HorizontalGallery from '@/components/sections/HorizontalGallery';
import Services from '@/components/sections/Services';
import Statement from '@/components/sections/Statement';
import Contact from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeSection />
      <Approach />
      <SelectedWork />
      <HorizontalGallery />
      <Services />
      <Statement />
      <Contact />
    </>
  );
}
