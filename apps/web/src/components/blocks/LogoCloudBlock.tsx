import { LogoCloudBlock as LogoCloudBlockType } from '@codex/content';

interface LogoCloudBlockProps {
  data: LogoCloudBlockType;
}

export function LogoCloudBlock({ data }: LogoCloudBlockProps) {
  if (!data) {
    return null;
  }
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {data.heading && (
          <div className="text-center mb-12">
            <h2 className="text-xl font-semibold text-gray-600 mb-8">
              {data.heading}
            </h2>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          {data.logos.map((logo, index) => (
            <div key={index} className="col-span-1 flex justify-center items-center">
              {logo.href ? (
                <a
                  href={logo.href}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="h-12 grayscale hover:grayscale-0 transition-all"
                    src={logo.src}
                    alt={logo.alt}
                  />
                </a>
              ) : (
                <img
                  className="h-12 grayscale"
                  src={logo.src}
                  alt={logo.alt}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}