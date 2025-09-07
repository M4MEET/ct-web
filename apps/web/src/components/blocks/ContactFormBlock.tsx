'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ContactFormBlock as ContactFormBlockType } from '@codex/content';
import { FileUpload } from '../FileUpload';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().max(0, 'Bot detected'), // Hidden field for bot detection
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormBlockProps {
  data: ContactFormBlockType;
}

export function ContactFormBlock({ data }: ContactFormBlockProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submissionId, setSubmissionId] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema)
  });

  const onSubmit = async (formData: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const submitData = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) submitData.append(key, value);
      });
      
      // Add files
      files.forEach((file) => {
        submitData.append('attachments', file);
      });
      
      // Add form type and metadata
      submitData.append('formType', 'contact');
      submitData.append('metadata', JSON.stringify({
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer
      }));

      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit form');
      }

      const result = await response.json();
      setSubmissionId(result.submissionId);
      setIsSubmitted(true);
      reset();
      setFiles([]);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
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
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                We've received your inquiry and will get back to you within 24 hours. Looking forward to working with you!
              </p>
              {submissionId && (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Reference ID:</span> {submissionId}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Please save this reference number for your records.
                  </p>
                </div>
              )}
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Hidden honeypot field */}
            <input 
              type="text" 
              {...register('honeypot')} 
              style={{ display: 'none' }} 
              tabIndex={-1} 
              autoComplete="off" 
            />
            
            {/* Name and Email */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Phone and Company */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register('phone')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  {...register('company')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Your company name"
                />
              </div>
            </div>

            {/* Service and Budget */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Interest
                </label>
                <select
                  id="service"
                  {...register('service')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="">Select a service</option>
                  <option value="web-development">Web Development</option>
                  <option value="mobile-app">Mobile App Development</option>
                  <option value="e-commerce">E-commerce Solutions</option>
                  <option value="cms-development">CMS Development</option>
                  <option value="api-integration">API Integration</option>
                  <option value="consulting">Technical Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <select
                  id="budget"
                  {...register('budget')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="">Select budget range</option>
                  <option value="under-5k">Under $5,000</option>
                  <option value="5k-15k">$5,000 - $15,000</option>
                  <option value="15k-50k">$15,000 - $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="over-100k">Over $100,000</option>
                  <option value="discuss">Let's discuss</option>
                </select>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                Project Timeline
              </label>
              <select
                id="timeline"
                {...register('timeline')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="">Select timeline</option>
                <option value="asap">ASAP</option>
                <option value="1-month">Within 1 month</option>
                <option value="2-3-months">2-3 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="6-months-plus">6+ months</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            
            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Project Details *
              </label>
              <textarea
                id="message"
                {...register('message')}
                rows={5}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                  errors.message ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Tell us about your project requirements, goals, and any specific features you need..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Optional)
              </label>
              <FileUpload 
                onFilesChange={setFiles}
                maxFiles={3}
                maxSize={10 * 1024 * 1024}
              />
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{submitError}</p>
              </div>
            )}
            
            {/* Submit Button */}
            <div className="flex items-center justify-center sm:justify-start text-primary-600 font-medium group-hover:text-primary-700 transition-colors mt-auto pt-3 sm:pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}