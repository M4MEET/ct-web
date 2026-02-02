import { RichTextBlock as RichTextBlockType } from '@codex/content';

interface RichTextBlockProps {
  data: RichTextBlockType;
}

// Simple server-safe HTML sanitization using regex
// Removes script tags, event handlers, and dangerous elements
function sanitizeHTML(html: string): string {
  if (!html) return '';

  return html
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove iframe, object, embed tags
    .replace(/<(iframe|object|embed|form|input|textarea|select)[^>]*>.*?<\/\1>/gis, '')
    .replace(/<(iframe|object|embed|form|input|textarea|select)[^>]*\/?>/gi, '')
    // Remove event handlers (onclick, onload, onerror, etc.)
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s*on\w+\s*=\s*[^\s>]+/gi, '')
    // Remove javascript: and data: URLs in href/src
    .replace(/href\s*=\s*["']?\s*javascript:[^"'\s>]*/gi, 'href="#"')
    .replace(/src\s*=\s*["']?\s*javascript:[^"'\s>]*/gi, 'src=""')
    .replace(/href\s*=\s*["']?\s*data:[^"'\s>]*/gi, 'href="#"')
    .replace(/src\s*=\s*["']?\s*data:(?!image)[^"'\s>]*/gi, 'src=""');
}

export function RichTextBlock({ data }: RichTextBlockProps) {
  if (!data) {
    return null;
  }
  
  return (
    <section className="py-16 bg-transparent relative">
      <div className="relative max-w-6xl mx-auto px-6">
        {data.heading && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.heading}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
          </div>
        )}
        
        {data.content && (
          <div className="bg-transparent">
            <div 
              className="prose prose-lg prose-gray max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h1:text-3xl prose-h1:mb-6 prose-h1:leading-tight
                prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-gray-800
                prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-gray-700
                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-em:text-gray-700
                prose-a:text-primary-600 prose-a:no-underline hover:prose-a:text-primary-700 hover:prose-a:underline
                prose-ul:my-4 prose-li:my-1 prose-li:text-gray-600
                prose-ol:my-4 prose-ol:text-gray-600
                prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50 prose-blockquote:rounded-r-lg prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:my-6
                prose-blockquote:text-gray-700 prose-blockquote:font-medium prose-blockquote:not-italic
                prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4
                prose-hr:border-gray-200 prose-hr:my-8
                [&_section]:!bg-transparent [&_section]:!py-4 [&_section]:!my-0 
                [&_.bg-white]:!bg-white/95 [&_.bg-gray-50]:!bg-transparent
                [&_.shadow-sm]:!shadow-sm [&_.rounded-xl]:!rounded-lg [&_.rounded-2xl]:!rounded-lg
                [&_.p-8]:!p-4 [&_.gap-12]:!gap-6 [&_.mb-12]:!mb-6 [&_.py-16]:!py-4"
              dangerouslySetInnerHTML={{ 
                __html: sanitizeHTML(
                  (data.content || '')
                    // Apply styling transformations BEFORE sanitization
                    .replace(/<section[^>]*>/g, '<div>')
                    .replace(/<\/section>/g, '</div>')
                    .replace(/class="py-16 bg-gradient-to-r[^"]*"/g, 'class="py-4 bg-transparent"')
                    .replace(/class="py-16 bg-white"/g, 'class="py-4 bg-transparent"')
                    .replace(/class="py-16 bg-gray-50"/g, 'class="py-4 bg-transparent"')
                    .replace(/class="bg-white p-8 rounded-2xl shadow-sm"/g, 'class="bg-white/95 p-4 rounded-lg border border-gray-200 shadow-sm"')
                    .replace(/class="bg-white p-8 rounded-xl shadow-sm"/g, 'class="bg-white/95 p-4 rounded-lg border border-gray-200 shadow-sm"')
                    .replace(/class="max-w-6xl mx-auto px-6"/g, 'class="max-w-full px-0"')
                    .replace(/class="max-w-4xl mx-auto px-6"/g, 'class="max-w-full px-0"')
                    .replace(/class="grid lg:grid-cols-2 gap-12"/g, 'class="grid lg:grid-cols-2 gap-4"')
                    .replace(/class="grid md:grid-cols-2 gap-6"/g, 'class="grid md:grid-cols-2 gap-4"')
                    .replace(/class="grid md:grid-cols-3 gap-8"/g, 'class="grid md:grid-cols-3 gap-4"')
                    .replace(/bg-gradient-to-br from-orange-50 to-orange-100/g, 'bg-white/95 backdrop-blur-xl border border-gray-200/50')
                    .replace(/bg-gradient-to-br from-blue-50 to-blue-100/g, 'bg-white/95 backdrop-blur-xl border border-gray-200/50')
                    .replace(/bg-gradient-to-br from-blue-50 to-indigo-100/g, 'bg-white/95 backdrop-blur-xl border border-gray-200/50')
                    .replace(/bg-orange-500/g, 'bg-primary-500')
                    .replace(/bg-blue-500/g, 'bg-primary-500')
                    .replace(/bg-indigo-500/g, 'bg-primary-500')
                    .replace(/bg-orange-200/g, 'bg-orange-200')
                    .replace(/bg-blue-200/g, 'bg-blue-200')
                    .replace(/bg-indigo-200/g, 'bg-indigo-200')
                    .replace(/px-2 py-1 rounded/g, 'px-3 py-1 rounded-full font-medium')
                    .replace(/cloud@codexterminal\.com/g, 'info@codexterminal.com')
                    .replace(/mailto:cloud@codexterminal\.com/g, 'mailto:info@codexterminal.com')
                    .replace(/href="\/contact\?service=cloud"/g, 'href="/contact"')
                    .replace(/Get Free Cloud Assessment/g, 'Get Free Assessment')
                )
              }}
            />
          </div>
        )}
        
        {data.cta && (
          <div className="text-center mt-12">
            <a
              href={data.cta.href}
              className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25 hover:scale-105 border border-primary-400/20"
            >
              <span className="relative z-10 flex items-center justify-center">
                {data.cta.label}
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}