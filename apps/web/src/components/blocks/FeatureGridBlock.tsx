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

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {data.heading && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.heading}
            </h2>
            {data.subtitle && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {data.subtitle}
              </p>
            )}
          </div>
        )}
        
        <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-8`}>
          {items.map((item: any, index: number) => (
            <div key={index} className="text-center p-6">
              {item.icon && (
                <div className="text-4xl mb-4">
                  {item.icon}
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600">
                {item.description || item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}