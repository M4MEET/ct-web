import { CodexTerminalHero } from '@/components/CodexTerminalHero';
import { CodexTerminalFeatures } from '@/components/CodexTerminalFeatures';
import { CodexTerminalTestimonials } from '@/components/CodexTerminalTestimonials';
import { CodexTerminalCTA } from '@/components/CodexTerminalCTA';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  return (
    <main className="min-h-screen">
      <CodexTerminalHero />
      <CodexTerminalFeatures />
      <CodexTerminalTestimonials />
      <CodexTerminalCTA />
    </main>
  );
}