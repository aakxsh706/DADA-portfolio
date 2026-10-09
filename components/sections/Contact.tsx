import { MessageCircle } from 'lucide-react';
import { siteConfig, socialLinks, whatsappHref } from '@/data/site-config';
import AnimatedHeading from '@/components/animations/AnimatedHeading';
import SectionTransition from '@/components/animations/SectionTransition';
import CopyEmail from '@/components/ui/CopyEmail';
import ContactForm from '@/components/ui/ContactForm';
import MagneticButton from '@/components/ui/MagneticButton';
import Availability from '@/components/ui/Availability';
import FlipText from '@/components/ui/FlipText';

export default function Contact() {
  return (
    <section
      id="contact"
      className="theme-light section-y scroll-mt-20 bg-bg text-fg"
      aria-labelledby="contact-heading"
    >
      <SectionTransition index="04" label="Contact" className="mb-[clamp(4rem,8vw,8rem)]" />
      <div className="container-x">
        <AnimatedHeading as="h2" id="contact-heading" size="display" className="max-w-[12ch]">
          Have a project in mind? Let&apos;s make it happen.
        </AnimatedHeading>
      </div>

      <div className="container-x mt-[clamp(4rem,8vw,7rem)] grid gap-16 lg:grid-cols-12">
        <div className="flex flex-col gap-10 lg:col-span-5">
          <div>
            <p className="eyebrow mb-4">Email</p>
            <CopyEmail email={siteConfig.email} />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {whatsappHref ? (
              <MagneticButton href={whatsappHref} external variant="solid">
                <MessageCircle size={16} aria-hidden="true" />
                WhatsApp
              </MagneticButton>
            ) : null}
            <Availability />
          </div>

          {socialLinks.length > 0 ? (
            <div>
              <p className="eyebrow mb-4">Elsewhere</p>
              <ul className="flex flex-wrap gap-6">
                {socialLinks.map((social) => (
                  <li key={social.key}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-heading text-base font-bold uppercase tracking-wide"
                    >
                      <FlipText>{social.label}</FlipText>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="max-w-sm text-sm text-muted">
            Based in {siteConfig.location}, working with clients anywhere. Share a few details and
            we&apos;ll come back with first thoughts and next steps.
          </p>
        </div>

        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
