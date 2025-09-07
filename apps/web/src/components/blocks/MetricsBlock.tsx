import { MetricsBlock as MetricsBlockType } from '@codex/content';

interface MetricsBlockProps {
  data: MetricsBlockType;
}

export function MetricsBlock({ data }: MetricsBlockProps) {
  return (
    <section className="py-16 sm:py-20 bg-transparent relative">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {data.heading && (
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              {data.heading.split(' ').slice(0, -2).join(' ')}{' '}
              <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                {data.heading.split(' ').slice(-2).join(' ')}
              </span>
            </h2>
            {data.subtitle && (
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {data.subtitle}
              </p>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {data.items?.map((metric, index) => (
            <div key={index} className="group relative text-center bg-white/95 backdrop-blur-xl border border-gray-200/60 shadow-lg rounded-2xl p-6 sm:p-8 hover:shadow-xl hover:border-primary-200/80 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-primary-100/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                  {metric.value}
                </div>
                <div className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                  {metric.label}
                </div>
                {metric.helpText && (
                  <div className="text-sm text-gray-600 leading-relaxed">
                    {metric.helpText}
                  </div>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}