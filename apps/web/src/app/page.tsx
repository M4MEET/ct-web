import { CodexTerminalHero } from '@/components/CodexTerminalHero';
import { CodexTerminalFeatures } from '@/components/CodexTerminalFeatures';
import { CodexTerminalTestimonials } from '@/components/CodexTerminalTestimonials';
import { CodexTerminalCTA } from '@/components/CodexTerminalCTA';

export default function HomePage() {
  return (
    <main className="pt-16 min-h-screen">
      <CodexTerminalHero />
      <CodexTerminalFeatures />
      <CodexTerminalTestimonials />
      <CodexTerminalCTA />
    </main>
  );
}