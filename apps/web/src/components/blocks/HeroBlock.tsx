import { HeroBlock as HeroBlockType } from '@codex/content';

interface HeroBlockProps {
  data: HeroBlockType;
}

export function HeroBlock({ data }: HeroBlockProps) {
  if (!data) {
    return null;
  }

  return (
    <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {data.eyebrow && (
            <p className="text-primary-200 uppercase tracking-wide text-sm font-semibold mb-4">
              {data.eyebrow}
            </p>
          )}
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {data.headline}
          </h1>
          
          {data.subcopy && (
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              {data.subcopy}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {data.cta && (
              <a
                href={data.cta.href}
                className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                {data.cta.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}