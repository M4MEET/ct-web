'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  attachments: File[];
}

interface ContactFormProps {
  initialService?: string;
}

export function ContactForm({ initialService }: ContactFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('contact.form');
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: initialService || '',
    message: '',
    attachments: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: files
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const submissionData = new FormData();
      submissionData.append('name', formData.name);
      submissionData.append('email', formData.email);
      submissionData.append('phone', formData.phone || '');
      submissionData.append('company', formData.company || '');
      submissionData.append('service', formData.service || '');
      submissionData.append('message', formData.message);
      submissionData.append('formType', 'contact');
      
      // Add attachments
      formData.attachments.forEach((file) => {
        submissionData.append('attachments', file);
      });
      
      // Add enhanced metadata
      const urlParams = new URLSearchParams(window.location.search);
      const metadata = {
        // Basic info
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        
        // Page context
        currentUrl: window.location.href,
        currentPath: window.location.pathname,
        
        // UTM parameters for marketing attribution
        utmSource: urlParams.get('utm_source') || null,
        utmMedium: urlParams.get('utm_medium') || null,
        utmCampaign: urlParams.get('utm_campaign') || null,
        utmTerm: urlParams.get('utm_term') || null,
        utmContent: urlParams.get('utm_content') || null,
        
        // Other tracking parameters
        gclid: urlParams.get('gclid') || null, // Google Ads
        fbclid: urlParams.get('fbclid') || null, // Facebook Ads
        
        // Browser/device info
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        
        // Referrer analysis
        referrerDomain: document.referrer ? new URL(document.referrer).hostname : null,
        isDirectTraffic: !document.referrer,
        
        // Session info
        sessionId: sessionStorage.getItem('session_id') || null,
        sessionStart: sessionStorage.getItem('session_start') || null,
        sessionDuration: parseInt(sessionStorage.getItem('session_duration') || '0'),
        
        // Page view history
        pageViews: JSON.parse(sessionStorage.getItem('page_views') || '[]'),
        
        // Additional context
        timeOnPage: Date.now(), // Will be calculated on server relative to session start
      };
      submissionData.append('metadata', JSON.stringify(metadata));

      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        body: submissionData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitMessage({
          type: 'success',
          text: `Thank you for your message! We'll get back to you soon. Reference: ${result.submissionId}`
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: initialService || '',
          message: '',
          attachments: []
        });
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(result.message || 'Something went wrong');
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('title')}</h2>
      
      {submitMessage && (
        <div className={`mb-6 p-4 rounded-lg ${
          submitMessage.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Two column grid for compact layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Your name"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="+1 (555) 123-4567"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Your company name"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
            Service Interest
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            disabled={isSubmitting}
          >
            <option value="">Select a service</option>
            <option value="shopware">Shopware Development</option>
            <option value="marketing">Digital Marketing</option>
            <option value="cloud">Cloud Infrastructure</option>
            <option value="web-development">Web Development</option>
            <option value="consulting">Technical Consulting</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Project Details * (minimum 10 characters)
          </label>
          <textarea
            id="message"
            name="message"
            required
            minLength={10}
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Tell us about your project requirements, timeline, and any specific questions..."
            disabled={isSubmitting}
          ></textarea>
          {formData.message.length < 10 && formData.message.length > 0 && (
            <p className="text-xs text-red-600 mt-1">
              Message must be at least 10 characters long ({formData.message.length}/10)
            </p>
          )}
        </div>

        {/* File Attachments */}
        <div>
          <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-1">
            Attachments
          </label>
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              id="attachments"
              multiple
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              JPG, PNG, GIF, PDF, DOC, DOCX (max 10MB each)
            </p>
            
            {/* Selected Files Display */}
            {formData.attachments.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700">Selected Files:</p>
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {file.type.startsWith('image/') ? '🖼️' : file.type === 'application/pdf' ? '📄' : '📎'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{file.name}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                      disabled={isSubmitting}
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  );
}