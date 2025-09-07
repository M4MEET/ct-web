import { HeroBlock as HeroBlockType } from '@codex/content';

interface HeroBlockProps {
  data: HeroBlockType;
}

export function HeroBlock({ data }: HeroBlockProps) {
  if (!data) {
    return null;
  }

  return (
    <section className="relative bg-transparent pt-16 sm:pt-20 pb-6 sm:pb-8 min-h-[50vh] sm:min-h-[60vh]">
      <div className="relative mx-auto max-w-6xl px-3 sm:px-6">
        <div className="text-center">
          {data.eyebrow && (
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100/80 border border-primary-200/50 backdrop-blur-sm mb-6 sm:mb-8">
              <span className="text-primary-700 uppercase tracking-wider text-sm font-medium">
                {data.eyebrow}
              </span>
            </div>
          )}
          
          <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight px-2">
            <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              {data.headline}
            </span>
          </h1>
          
          {data.subcopy && (
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
              {data.subcopy}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-2">
            {data.cta && (
              <a
                href={data.cta.href}
                className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25 hover:scale-105 border border-primary-400/20 w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {data.cta.label}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">⚡</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            )}
            {data.secondaryCTA && (
              <a
                href={data.secondaryCTA.href}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg border-2 border-primary-400/50 bg-transparent text-primary-600 rounded-xl font-bold transition-all duration-300 hover:bg-primary-400/10 hover:border-primary-400 hover:shadow-lg hover:shadow-primary-400/20 hover:scale-105 w-full sm:w-auto"
              >
                <span className="flex items-center justify-center">
                  {data.secondaryCTA.label}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400/5 to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </a>
            )}
          </div>

          {data.badges && data.badges.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-8 sm:mt-12 px-2">
              {data.badges.map((badge, index) => (
                <div key={index} className="inline-flex items-center px-3 sm:px-4 py-2 bg-white/95 backdrop-blur-xl border border-gray-200/60 shadow-lg rounded-xl hover:shadow-xl hover:border-primary-200 transition-all duration-300">
                  {badge.icon && (
                    <span className="mr-2 text-primary-500">
                      {badge.icon}
                    </span>
                  )}
                  <span className="text-sm font-medium text-gray-600">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}