'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnyBlock, HeroBlock, FeatureGridBlock, TestimonialBlock } from '@codex/content';
import { z } from 'zod';

interface BlockFormProps {
  block: AnyBlock;
  onChange: (updates: Partial<AnyBlock>) => void;
}

// Form component for Hero blocks
function HeroBlockForm({ block, onChange }: { block: HeroBlock; onChange: (updates: Partial<HeroBlock>) => void }) {
  const { register, watch, setValue } = useForm({
    defaultValues: block,
  });

  const watchedValues = watch();
  const prevValues = useRef(block);

  // Update parent when form values change
  useEffect(() => {
    // Deep comparison to avoid unnecessary updates
    const hasChanged = JSON.stringify(watchedValues) !== JSON.stringify(prevValues.current);
    if (hasChanged) {
      prevValues.current = watchedValues;
      onChange(watchedValues);
    }
  }, [watchedValues.eyebrow, watchedValues.headline, watchedValues.subcopy, watchedValues.primaryCTA, watchedValues.secondaryCTA]);

  return (
    <div className="space-y-6">
      {/* Content Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Hero Content
        </h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="hero-eyebrow" className="block text-sm font-medium text-gray-700 mb-2">
              Eyebrow Text
            </label>
            <input
              id="hero-eyebrow"
              {...register('eyebrow')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Optional small text above headline"
            />
            <p className="text-xs text-gray-500 mt-1">Small text that appears above the main headline</p>
          </div>

          <div>
            <label htmlFor="hero-headline" className="block text-sm font-medium text-gray-700 mb-2">
              Headline <span className="text-red-500">*</span>
            </label>
            <input
              id="hero-headline"
              {...register('headline')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Your compelling main headline"
            />
            <p className="text-xs text-gray-500 mt-1">The main headline that grabs attention</p>
          </div>

          <div>
            <label htmlFor="hero-subcopy" className="block text-sm font-medium text-gray-700 mb-2">
              Subcopy
            </label>
            <textarea
              id="hero-subcopy"
              {...register('subcopy')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
              rows={3}
              placeholder="Supporting text that explains your value proposition"
            />
            <p className="text-xs text-gray-500 mt-1">Descriptive text that supports your headline</p>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Call-to-Action Buttons
        </h3>

        <div className="space-y-4">
          {/* Primary CTA */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-primary-900 mb-3">Primary Button</h4>
            <div className="space-y-2">
              <div>
                <label htmlFor="primary-cta-label" className="block text-xs font-medium text-gray-700 mb-1">
                  Button Text
                </label>
                <input
                  id="primary-cta-label"
                  {...register('primaryCTA.label')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Get Started"
                />
              </div>
              <div>
                <label htmlFor="primary-cta-href" className="block text-xs font-medium text-gray-700 mb-1">
                  Button Link
                </label>
                <input
                  id="primary-cta-href"
                  {...register('primaryCTA.href')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="/contact or https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Secondary CTA */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Secondary Button</h4>
            <div className="space-y-2">
              <div>
                <label htmlFor="secondary-cta-label" className="block text-xs font-medium text-gray-700 mb-1">
                  Button Text
                </label>
                <input
                  id="secondary-cta-label"
                  {...register('secondaryCTA.label')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Learn More"
                />
              </div>
              <div>
                <label htmlFor="secondary-cta-href" className="block text-xs font-medium text-gray-700 mb-1">
                  Button Link
                </label>
                <input
                  id="secondary-cta-href"
                  {...register('secondaryCTA.href')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="/about or https://example.com"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Form component for Feature Grid blocks
function FeatureGridBlockForm({ block, onChange }: { block: FeatureGridBlock; onChange: (updates: Partial<FeatureGridBlock>) => void }) {
  // Ensure block has safe defaults
  const safeBlock = {
    ...block,
    heading: block.heading || '',
    columns: block.columns || 3,
    items: block.items || [{ title: '', body: '' }],
  };

  const { register, watch, setValue, getValues } = useForm({
    defaultValues: safeBlock,
  });

  const watchedValues = watch();
  const prevValues = useRef(safeBlock);

  useEffect(() => {
    // Deep comparison to avoid unnecessary updates
    const hasChanged = JSON.stringify(watchedValues) !== JSON.stringify(prevValues.current);
    if (hasChanged) {
      prevValues.current = watchedValues;
      onChange(watchedValues);
    }
  }, [watchedValues.heading, watchedValues.columns, JSON.stringify(watchedValues.items), onChange]);

  const addFeature = () => {
    const currentItems = getValues('items') || [];
    const newItems = [...currentItems, { title: '', body: '' }];
    setValue('items', newItems);
    onChange({ items: newItems });
  };

  const removeFeature = (index: number) => {
    const currentItems = getValues('items') || [];
    const newItems = currentItems.filter((_, i) => i !== index);
    setValue('items', newItems);
    onChange({ items: newItems });
  };

  const safeItems = watchedValues.items || safeBlock.items || [];

  return (
    <div className="space-y-6">
      {/* Grid Configuration Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2M7 7h10" />
          </svg>
          Grid Configuration
        </h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="grid-heading" className="block text-sm font-medium text-gray-700 mb-2">
              Section Heading
            </label>
            <input
              id="grid-heading"
              {...register('heading')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Optional section heading"
            />
            <p className="text-xs text-gray-500 mt-1">Title that appears above the feature grid</p>
          </div>

          <div>
            <label htmlFor="grid-columns" className="block text-sm font-medium text-gray-700 mb-2">
              Grid Layout
            </label>
            <select
              id="grid-columns"
              {...register('columns', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value={2}>2 Columns</option>
              <option value={3}>3 Columns</option>
              <option value={4}>4 Columns</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Number of columns to display features in</p>
          </div>
        </div>
      </div>

      {/* Features Management Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Features ({safeItems.length})
          </h3>
          <button
            type="button"
            onClick={addFeature}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Feature
          </button>
        </div>

        <div className="space-y-3">
          {safeItems.map((item, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">Feature {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor={`feature-title-${index}`} className="block text-xs font-medium text-gray-700 mb-1">
                    Feature Title
                  </label>
                  <input
                    id={`feature-title-${index}`}
                    {...register(`items.${index}.title`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Feature title"
                  />
                </div>
                <div>
                  <label htmlFor={`feature-body-${index}`} className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id={`feature-body-${index}`}
                    {...register(`items.${index}.body`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                    rows={2}
                    placeholder="Feature description"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {safeItems.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <p className="text-sm font-medium text-gray-900 mb-1">No features added yet</p>
              <p className="text-xs text-gray-500">Click "Add Feature" to create your first feature</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Generic form for simple blocks
function GenericBlockForm({ block, onChange }: BlockFormProps) {
  return (
    <div className="space-y-6">
      {/* Block Visibility Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Block Visibility
        </h3>
        <div className="flex items-center gap-3">
          <input
            id="block-visible"
            type="checkbox"
            checked={block.visible ?? true}
            onChange={(e) => onChange({ visible: e.target.checked })}
            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
          />
          <label htmlFor="block-visible" className="text-sm font-medium text-gray-700">
            Show this block on the website
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Uncheck to hide this block from visitors while keeping it in the editor
        </p>
      </div>

      {/* Custom Styling Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
          Custom Styling
        </h3>
        <div>
          <label htmlFor="block-css-class" className="block text-sm font-medium text-gray-700 mb-2">
            CSS Classes
          </label>
          <input
            id="block-css-class"
            value={block.className || ''}
            onChange={(e) => onChange({ className: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder="e.g., mb-8 bg-gray-50 custom-class"
          />
          <p className="text-xs text-gray-500 mt-2">
            Add custom CSS classes for advanced styling (space-separated)
          </p>
        </div>
      </div>
      
      {/* Coming Soon Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Advanced Editor Coming Soon
            </h4>
            <p className="text-sm text-blue-800">
              A dedicated editor for <span className="font-medium capitalize">{block.type}</span> blocks is currently in development. 
              You can still control visibility and styling using the options above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlockForm({ block, onChange }: BlockFormProps) {
  // Render specific form based on block type
  switch (block.type) {
    case 'hero':
      return <HeroBlockForm block={block as HeroBlock} onChange={onChange} />;
    case 'featureGrid':
      return <FeatureGridBlockForm block={block as FeatureGridBlock} onChange={onChange} />;
    default:
      return <GenericBlockForm block={block} onChange={onChange} />;
  }
}