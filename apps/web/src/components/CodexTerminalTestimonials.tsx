'use client';

import { useState, useEffect } from 'react';

const testimonials = [
  {
    quote: "CodeX Terminal transformed our Shopware store completely. Their custom plugins increased our conversion rate by 40% and their ongoing support is exceptional.",
    author: "Sarah Chen",
    role: "E-commerce Director",
    company: "TechGear Pro",
    avatar: "SC"
  },
  {
    quote: "The cloud infrastructure they built scaled seamlessly during our Black Friday traffic spike. 10x traffic, zero downtime. Absolutely incredible.",
    author: "Marcus Rodriguez",
    role: "CTO",
    company: "Fashion Forward",
    avatar: "MR"
  },
  {
    quote: "Their digital marketing strategy delivered a 300% ROI in just 6 months. The team combines technical expertise with genuine business understanding.",
    author: "Emily Johnson",
    role: "Marketing Director",
    company: "Wellness Brands",
    avatar: "EJ"
  }
];

export function CodexTerminalTestimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-codex-terminal-component relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 left-1/4 w-80 h-80 bg-gradient-to-br from-primary-300/70 to-primary-200/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-1/4 w-96 h-96 bg-gradient-to-tr from-primary-200/80 to-primary-100/60 rounded-full blur-3xl"></div>
      </div>
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Trusted by growing
            <span className="block bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              businesses worldwide
            </span>
          </h2>
        </div>

        {/* Main testimonial */}
        <div className="relative mb-16">
          <div className="bg-white rounded-3xl border border-gray-200/50 p-12 shadow-xl shadow-gray-900/5 backdrop-blur-sm">
            <div className="relative">
              {/* Quote mark */}
              <div className="absolute -top-2 -left-2 text-6xl text-primary-200/50 font-serif leading-none">
                "
              </div>
              
              <div className="relative z-10">
                <blockquote className="text-2xl sm:text-3xl font-light text-gray-900 leading-relaxed mb-8 transition-all duration-500">
                  {testimonials[activeTestimonial].quote}
                </blockquote>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                      {testimonials[activeTestimonial].avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">
                        {testimonials[activeTestimonial].author}
                      </div>
                      <div className="text-gray-600">
                        {testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company}
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation dots */}
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === activeTestimonial
                            ? 'bg-primary-500 scale-125'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white rounded-2xl border border-gray-200/50 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent mb-2">
              150%
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Average traffic increase
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200/50 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent mb-2">
              40%
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Conversion rate boost
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200/50 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent mb-2">
              300%
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Marketing ROI
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200/50 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent mb-2">
              99.9%
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Infrastructure uptime
            </div>
          </div>
        </div>

        {/* Technology logos */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 text-sm mb-8 uppercase tracking-wider font-medium">
            Powered by industry-leading technologies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Shopware</div>
            <div className="text-2xl font-bold text-gray-400">AWS</div>
            <div className="text-2xl font-bold text-gray-400">Google Cloud</div>
            <div className="text-2xl font-bold text-gray-400">Azure</div>
            <div className="text-2xl font-bold text-gray-400">Kubernetes</div>
            <div className="text-2xl font-bold text-gray-400">Docker</div>
          </div>
        </div>
      </div>
    </section>
  );
}