'use client';

import { useState, useEffect } from 'react';
import { AnyBlock } from '@codex/content';

interface BlockPreviewProps {
  blocks: AnyBlock[];
  className?: string;
}

export function BlockPreview({ blocks, className = '' }: BlockPreviewProps) {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const generatePreview = async () => {
      if (!blocks || blocks.length === 0) {
        setPreviewHtml('<div class="text-center text-gray-500 py-8">No blocks to preview</div>');
        return;
      }

      setIsLoading(true);
      
      try {
        // Generate preview HTML by rendering blocks
        const previewBlocks = blocks
          .filter(block => block.visible !== false)
          .map(block => {
            switch (block.type) {
              case 'hero':
                return renderHeroBlock(block);
              case 'featureGrid':
                return renderFeatureGridBlock(block);
              case 'testimonial':
                return renderTestimonialBlock(block);
              case 'richText':
                return renderRichTextBlock(block);
              case 'faq':
                return renderFAQBlock(block);
              default:
                return `<div class="py-8 bg-gray-100 text-center">
                  <p class="text-gray-600">Block type "${block.type}" preview not implemented</p>
                </div>`;
            }
          });

        setPreviewHtml(previewBlocks.join(''));
      } catch (error) {
        console.error('Preview error:', error);
        setPreviewHtml('<div class="text-center text-red-500 py-8">Preview error</div>');
      } finally {
        setIsLoading(false);
      }
    };

    generatePreview();
  }, [blocks]);

  if (isLoading) {
    return (
      <div className={`bg-white border rounded-lg ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border rounded-lg overflow-hidden ${className}`}>
      <div className="bg-gray-50 px-4 py-2 border-b">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <span className="text-sm text-gray-600">Preview</span>
        </div>
      </div>
      <div 
        className="preview-content"
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />
    </div>
  );
}

// Helper functions to render blocks as HTML
function renderHeroBlock(block: any): string {
  return `
    <section class="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          ${block.eyebrow ? `<p class="text-blue-200 uppercase tracking-wide text-sm font-semibold mb-4">${block.eyebrow}</p>` : ''}
          <h1 class="text-4xl md:text-6xl font-bold mb-6">${block.headline || 'Headline'}</h1>
          ${block.subcopy ? `<p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">${block.subcopy}</p>` : ''}
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            ${block.primaryCTA ? `<a href="${block.primaryCTA.href}" class="bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">${block.primaryCTA.label}</a>` : ''}
            ${block.secondaryCTA ? `<a href="${block.secondaryCTA.href}" class="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">${block.secondaryCTA.label}</a>` : ''}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderFeatureGridBlock(block: any): string {
  const items = block.items || [];
  return `
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        ${block.heading ? `
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">${block.heading}</h2>
          </div>
        ` : ''}
        <div class="grid grid-cols-1 md:grid-cols-${block.columns || 3} gap-8">
          ${items.map((item: any) => `
            <div class="text-center p-6">
              ${item.icon ? `<div class="text-4xl mb-4">${item.icon}</div>` : ''}
              <h3 class="text-xl font-semibold text-gray-900 mb-3">${item.title || 'Title'}</h3>
              <p class="text-gray-600">${item.body || 'Description'}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderTestimonialBlock(block: any): string {
  return `
    <section class="py-16 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <blockquote class="text-center">
          <div class="text-2xl md:text-3xl leading-9 font-medium text-gray-900 mb-8">
            "${block.quote || 'Quote text'}"
          </div>
          <footer class="flex items-center justify-center space-x-4">
            <div class="text-left">
              <div class="text-lg font-medium text-gray-900">${block.author || 'Author Name'}</div>
              ${block.role || block.company ? `<div class="text-sm text-gray-600">${block.role || ''}${block.role && block.company ? ', ' : ''}${block.company || ''}</div>` : ''}
            </div>
          </footer>
        </blockquote>
      </div>
    </section>
  `;
}

function renderRichTextBlock(block: any): string {
  return `
    <section class="py-16 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        ${block.heading ? `
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">${block.heading}</h2>
          </div>
        ` : ''}
        <div class="prose prose-lg max-w-none">
          ${block.content || '<p>Rich text content</p>'}
        </div>
      </div>
    </section>
  `;
}

function renderFAQBlock(block: any): string {
  const items = block.items || [];
  return `
    <section class="py-16 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        ${block.heading ? `
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">${block.heading}</h2>
          </div>
        ` : ''}
        <div class="space-y-4">
          ${items.map((item: any) => `
            <div class="border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-3">${item.question || 'Question'}</h3>
              <p class="text-gray-600">${item.answer || 'Answer'}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}