'use client';

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

  // Update parent when form values change
  React.useEffect(() => {
    onChange(watchedValues);
  }, [watchedValues, onChange]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Eyebrow Text</label>
        <input
          {...register('eyebrow')}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="Optional eyebrow text"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Headline *</label>
        <input
          {...register('headline')}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="Your main headline"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Subcopy</label>
        <textarea
          {...register('subcopy')}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          rows={3}
          placeholder="Supporting text"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Primary CTA</label>
        <div className="space-y-2">
          <input
            {...register('primaryCTA.label')}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            placeholder="Button text"
          />
          <input
            {...register('primaryCTA.href')}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            placeholder="Button URL"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Secondary CTA</label>
        <div className="space-y-2">
          <input
            {...register('secondaryCTA.label')}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            placeholder="Button text"
          />
          <input
            {...register('secondaryCTA.href')}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            placeholder="Button URL"
          />
        </div>
      </div>
    </div>
  );
}

// Form component for Feature Grid blocks
function FeatureGridBlockForm({ block, onChange }: { block: FeatureGridBlock; onChange: (updates: Partial<FeatureGridBlock>) => void }) {
  const { register, watch } = useForm({
    defaultValues: block,
  });

  const watchedValues = watch();

  React.useEffect(() => {
    onChange(watchedValues);
  }, [watchedValues, onChange]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input
          {...register('heading')}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="Optional section heading"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Columns</label>
        <select
          {...register('columns', { valueAsNumber: true })}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value={2}>2 Columns</option>
          <option value={3}>3 Columns</option>
          <option value={4}>4 Columns</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Features</label>
        {block.items.map((item, index) => (
          <div key={index} className="border p-3 rounded-md mb-3 space-y-2">
            <input
              {...register(`items.${index}.title`)}
              className="w-full p-2 border border-gray-200 rounded text-sm"
              placeholder="Feature title"
            />
            <textarea
              {...register(`items.${index}.body`)}
              className="w-full p-2 border border-gray-200 rounded text-sm"
              rows={2}
              placeholder="Feature description"
            />
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => {
            const newItem = { title: '', body: '' };
            onChange({
              items: [...block.items, newItem],
            });
          }}
          className="w-full p-2 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:border-gray-400"
        >
          + Add Feature
        </button>
      </div>
    </div>
  );
}

// Generic form for simple blocks
function GenericBlockForm({ block, onChange }: BlockFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Visible</label>
        <input
          type="checkbox"
          checked={block.visible}
          onChange={(e) => onChange({ visible: e.target.checked })}
          className="rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">CSS Class</label>
        <input
          value={block.className || ''}
          onChange={(e) => onChange({ className: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="Optional CSS classes"
        />
      </div>
      
      <div className="bg-yellow-50 p-3 rounded-md">
        <p className="text-sm text-yellow-800">
          Advanced editor for {block.type} blocks coming soon!
        </p>
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

// Add React import at the top
import React from 'react';