'use client';

import Link from 'next/link';

const features = [
  {
    title: 'Shopware Excellence',
    description: 'Custom plugins, themes, and enterprise migrations built by certified Shopware experts.',
    icon: '🛍️',
    href: '/services/shopware',
    gradient: 'from-blue-500/20 to-primary-500/20',
    borderGradient: 'from-blue-500/30 to-primary-500/30'
  },
  {
    title: 'Digital Marketing',
    description: 'Data-driven SEO, PPC campaigns, and marketing automation that delivers measurable ROI.',
    icon: '📈',
    href: '/services/marketing',
    gradient: 'from-green-500/20 to-primary-500/20',
    borderGradient: 'from-green-500/30 to-primary-500/30'
  },
  {
    title: 'Cloud Infrastructure',
    description: 'Scalable AWS, Azure, and GCP solutions with DevOps automation and 24/7 monitoring.',
    icon: '☁️',
    href: '/services/cloud',
    gradient: 'from-purple-500/20 to-primary-500/20',
    borderGradient: 'from-purple-500/30 to-primary-500/30'
  }
];

export function CodexTerminalFeatures() {
  return (
    <section className="py-24 bg-codex-terminal-body relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-primary-200/70 to-primary-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-tr from-primary-300/60 to-primary-200/40 rounded-full blur-3xl"></div>
      </div>
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Everything you need to
            <span className="block bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              scale your business
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We combine technical expertise with strategic thinking to deliver solutions that don't just work—they excel.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group relative"
            >
              <div className={`
                relative p-8 rounded-3xl border border-gray-200/50 
                bg-gradient-to-br ${feature.gradient} 
                hover:shadow-xl hover:shadow-primary-500/5 
                transition-all duration-300 hover:-translate-y-1
                before:absolute before:inset-0 before:rounded-3xl 
                before:bg-gradient-to-br before:${feature.borderGradient} 
                before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
                before:-z-10 before:blur-sm
              `}>
                <div className="relative z-10">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-200">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                    Learn more
                    <svg
                      className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Process section */}
        <div className="bg-codex-terminal-component rounded-3xl p-12 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            Our proven process
          </h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Discovery</h4>
              <p className="text-sm text-gray-600">We understand your business goals and technical requirements</p>
              
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-primary-100 transform -translate-y-1/2"></div>
            </div>
            
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Strategy</h4>
              <p className="text-sm text-gray-600">We design a comprehensive solution architecture</p>
              
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-primary-100 transform -translate-y-1/2"></div>
            </div>
            
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Execute</h4>
              <p className="text-sm text-gray-600">We build and implement your solution with precision</p>
              
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-primary-100 transform -translate-y-1/2"></div>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg">
                4
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Scale</h4>
              <p className="text-sm text-gray-600">We optimize and support your growing success</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}