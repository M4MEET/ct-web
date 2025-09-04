import { MetricsBlock as MetricsBlockType } from '@codex/content';

interface MetricsBlockProps {
  data: MetricsBlockType;
}

export function MetricsBlock({ data }: MetricsBlockProps) {
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {data.heading && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {data.heading}
            </h2>
            {data.subtitle && (
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                {data.subtitle}
              </p>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {data.metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {metric.value}
              </div>
              <div className="text-lg font-medium text-gray-300 mb-1">
                {metric.label}
              </div>
              {metric.description && (
                <div className="text-sm text-gray-400">
                  {metric.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}