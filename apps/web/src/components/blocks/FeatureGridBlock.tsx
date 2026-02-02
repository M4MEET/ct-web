import Link from 'next/link';
import { FeatureGridBlock as FeatureGridBlockType } from '@codex/content';

interface FeatureGridBlockProps {
  data: FeatureGridBlockType;
}

export function FeatureGridBlock({ data }: FeatureGridBlockProps) {
  if (!data) {
    return null;
  }

  // Handle both 'features' and 'items' properties for backward compatibility
  const items = data.features || data.items || [];
  const columns = data.columns || 3;

  // Define grid classes based on column count
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  // Card component that wraps content in Link if href is provided
  const CardWrapper = ({ item, children }: { item: any; children: React.ReactNode }) => {
    if (item.link || item.href) {
      return (
        <Link
          href={item.link || item.href}
          className="group relative bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary-300 hover:-translate-y-1 p-4 sm:p-6 lg:p-8 h-full flex flex-col"
        >
          {children}
        </Link>
      );
    }
    return (
      <div className="group relative bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary-300 hover:-translate-y-1 p-4 sm:p-6 lg:p-8 h-full flex flex-col">
        {children}
      </div>
    );
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-transparent relative">
      <div className="relative mx-auto max-w-6xl px-3 sm:px-6">
        {data.heading && (
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              {data.heading.split(' ').slice(0, -2).join(' ')}<span className="block bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">{data.heading.split(' ').slice(-2).join(' ')}</span>
            </h2>
            {(data.subtitle || data.subheading) && (
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                {data.subtitle || data.subheading}
              </p>
            )}
          </div>
        )}

        <div className={`grid ${gridClasses} gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-16`}>
          {items.map((item: any, index: number) => (
            <CardWrapper key={index} item={item}>
              <div className="flex flex-col h-full space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  {item.icon && (
                    <span className="mb-2 sm:mb-0 sm:mr-4 text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-200 text-center sm:text-left">
                      {item.icon}
                    </span>
                  )}
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors text-center sm:text-left">
                    {item.title}
                  </h3>
                </div>
                <div className="text-sm sm:text-base text-gray-600 leading-relaxed flex-grow text-center sm:text-left">
                  {(item.description || item.body || '').split('\n').map((line: string, lineIndex: number) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return <div key={lineIndex} className="h-3"></div>;
                    
                    // Style contact information lines differently
                    if (trimmedLine.includes('📞') || trimmedLine.includes('✉️') || trimmedLine.includes('🕐') || trimmedLine.includes('📍')) {
                      const [icon, ...textParts] = trimmedLine.split(' ');
                      const text = textParts.join(' ');
                      return (
                        <div key={lineIndex} className={`flex items-start gap-2 ${lineIndex > 0 ? 'mt-2' : ''}`}>
                          <span className="text-base flex-shrink-0">{icon}</span>
                          <span className="font-medium text-gray-700">{text}</span>
                        </div>
                      );
                    }
                    
                    // Style country/timezone info
                    if (trimmedLine.includes('🇪🇺') || trimmedLine.includes('🇬🇧') || trimmedLine.includes('🌏') || trimmedLine.includes('🌍')) {
                      // Use proper emoji extraction with Array.from to handle multi-byte characters
                      const chars = Array.from(trimmedLine);
                      const emoji = chars[0];
                      const text = chars.slice(1).join('').trim();
                      return (
                        <div key={lineIndex} className={`flex items-center gap-2 ${lineIndex > 0 ? 'mt-2' : ''}`}>
                          <span className="text-base">{emoji}</span>
                          <span className="text-gray-700 font-medium">{text}</span>
                        </div>
                      );
                    }
                    
                    return (
                      <p key={lineIndex} className={lineIndex > 0 ? 'mt-2' : ''}>
                        {trimmedLine}
                      </p>
                    );
                  })}
                </div>
                
                {/* Service badges/tags if available */}
                {item.badges && (
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-4">
                    {item.badges.map((badge: string, badgeIndex: number) => (
                      <span 
                        key={badgeIndex}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium border border-primary-200 hover:bg-primary-200 transition-colors"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
                
                {(item.link || item.href) && (
                  <div className="flex items-center justify-center sm:justify-start text-primary-600 font-medium group-hover:text-primary-700 transition-colors mt-auto pt-3 sm:pt-4">
                    <span className="text-sm sm:text-base">Learn more</span>
                    <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                )}
              </div>
            </CardWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}