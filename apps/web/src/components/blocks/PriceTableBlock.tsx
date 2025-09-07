import { PriceTableBlock as PriceTableBlockType } from '@codex/content';

interface PriceTableBlockProps {
  data: PriceTableBlockType;
}

export function PriceTableBlock({ data }: PriceTableBlockProps) {
  return (
    <section className="py-16 bg-transparent relative">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {(data.plans || []).map((plan, index) => (
            <div
              key={index}
              className={`
                relative bg-white rounded-2xl shadow-lg overflow-hidden
                ${plan.popular 
                  ? 'ring-2 ring-primary-500 transform scale-105' 
                  : 'border border-gray-200'
                }
              `}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary-500 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-lg text-gray-500 ml-1">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {plan.description}
                  </p>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg 
                        className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      <span className="text-gray-700 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="text-center">
                  <a
                    href={plan.cta.href}
                    className={`
                      inline-flex items-center justify-center w-full px-6 py-3 
                      text-base font-medium rounded-lg transition-colors
                      ${plan.popular
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }
                    `}
                  >
                    {plan.cta.label}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        {data.note && (
          <div className="text-center mt-12">
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              {data.note}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}