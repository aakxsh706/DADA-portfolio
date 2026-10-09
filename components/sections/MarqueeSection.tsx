import AnimatedMarquee from '@/components/animations/AnimatedMarquee';

export default function MarqueeSection() {
  return (
    <section className="border-y border-line py-6 md:py-10" aria-label="Disciplines">
      <AnimatedMarquee
        items={['Design', 'Development', 'Interaction', 'Experience']}
        label="Design, development, interaction, experience"
        speed={70}
        className="font-heading text-[clamp(3rem,9vw,9.5rem)] font-bold uppercase leading-none tracking-[-0.04em]"
      />
    </section>
  );
}
