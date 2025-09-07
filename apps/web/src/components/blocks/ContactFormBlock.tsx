'use client';

import { useState } from 'react';
import { ContactFormBlock as ContactFormBlockType } from '@codex/content';

interface ContactFormBlockProps {
  data: ContactFormBlockType;
}

export function ContactFormBlock({ data }: ContactFormBlockProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
    return (
      <section className="py-24 bg-codex-terminal-component relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-32 left-1/4 w-80 h-80 bg-gradient-to-br from-primary-300/70 to-primary-200/50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 right-1/4 w-96 h-96 bg-gradient-to-tr from-primary-200/80 to-primary-100/60 rounded-full blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <div className="bg-white rounded-3xl border border-gray-200/50 p-12 shadow-xl shadow-gray-900/5 backdrop-blur-sm">
            <div className="relative">
              <div className="absolute -top-2 -left-2 text-6xl text-primary-400">✨</div>
              <div className="absolute -top-4 -right-4 text-4xl text-primary-300">🎉</div>
              <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Thank you for your message!
              </h3>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                We've received your inquiry and will get back to you within 24 hours. Looking forward to working with you!
              </p>
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary-400 rounded-full mr-2 animate-pulse"></div>
                  Message received
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary-300 rounded-full mr-2"></div>
                  Processing
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                  Response pending
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-transparent relative">
      <div className="relative mx-auto max-w-6xl px-3 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
            Ready to get<span className="block bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">started?</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Tell us about your project and we'll get back to you within 24 hours.
          </p>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Tell us about your project..."
              />
            </div>
            
            <div className="flex items-center justify-center sm:justify-start text-primary-600 font-medium group-hover:text-primary-700 transition-colors mt-auto pt-3 sm:pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}