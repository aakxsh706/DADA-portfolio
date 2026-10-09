import MagneticButton from '@/components/ui/MagneticButton';
import ArrowIcon from '@/components/ui/ArrowIcon';

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80svh] flex-col justify-center py-32">
      <p className="eyebrow mb-6">404</p>
      <h1 className="font-heading text-display-sm font-bold uppercase">
        This page doesn&apos;t exist<span className="text-accent">.</span>
      </h1>
      <p className="mt-6 max-w-md text-muted">
        The link may be outdated or the page may have moved. Head back to the homepage to keep
        exploring.
      </p>
      <div className="mt-10">
        <MagneticButton href="/" variant="outline">
          Back home
          <ArrowIcon />
        </MagneticButton>
      </div>
    </section>
  );
}
