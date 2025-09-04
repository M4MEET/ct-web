'use client';

import { useDraggable } from '@dnd-kit/core';
import { AnyBlock } from '@codex/content';
import { v4 as uuidv4 } from 'uuid';

interface BlockTypeDefinition {
  type: string;
  label: string;
  icon: string;
  description: string;
  category: 'content' | 'layout' | 'media' | 'forms';
}

const blockTypes: BlockTypeDefinition[] = [
  {
    type: 'hero',
    label: 'Hero Section',
    icon: '🦸',
    description: 'Large banner with headline, text, and CTA buttons',
    category: 'content',
  },
  {
    type: 'featureGrid',
    label: 'Feature Grid',
    icon: '⚡',
    description: 'Grid of features with icons and descriptions',
    category: 'layout',
  },
  {
    type: 'testimonial',
    label: 'Testimonial',
    icon: '💬',
    description: 'Customer testimonial with photo and quote',
    category: 'content',
  },
  {
    type: 'logoCloud',
    label: 'Logo Cloud',
    icon: '🏢',
    description: 'Grid of client or partner logos',
    category: 'content',
  },
  {
    type: 'metrics',
    label: 'Metrics',
    icon: '📊',
    description: 'Display key statistics or numbers',
    category: 'content',
  },
  {
    type: 'richText',
    label: 'Rich Text',
    icon: '📝',
    description: 'Formatted text with headings and paragraphs',
    category: 'content',
  },
  {
    type: 'faq',
    label: 'FAQ',
    icon: '❓',
    description: 'Frequently asked questions',
    category: 'content',
  },
  {
    type: 'priceTable',
    label: 'Pricing Table',
    icon: '💰',
    description: 'Comparison table of pricing plans',
    category: 'content',
  },
  {
    type: 'comparison',
    label: 'Comparison',
    icon: '⚖️',
    description: 'Side-by-side comparison table',
    category: 'layout',
  },
  {
    type: 'contactForm',
    label: 'Contact Form',
    icon: '📨',
    description: 'Contact or lead generation form',
    category: 'forms',
  },
  {
    type: 'media',
    label: 'Media',
    icon: '🖼️',
    description: 'Image or video content',
    category: 'media',
  },
];

interface BlockTypeItemProps {
  blockType: BlockTypeDefinition;
}

function BlockTypeItem({ blockType }: BlockTypeItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `block-type-${blockType.type}`,
    data: {
      type: 'blockType',
      blockType: blockType.type,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-grab hover:shadow-md transition-shadow"
    >
      <div className="text-2xl mb-2">{blockType.icon}</div>
      <h3 className="font-medium text-sm mb-1">{blockType.label}</h3>
      <p className="text-xs text-gray-600">{blockType.description}</p>
    </div>
  );
}

export function BlockPalette() {
  const categories = {
    content: blockTypes.filter(b => b.category === 'content'),
    layout: blockTypes.filter(b => b.category === 'layout'),
    media: blockTypes.filter(b => b.category === 'media'),
    forms: blockTypes.filter(b => b.category === 'forms'),
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
      <h2 className="font-semibold mb-4">Block Palette</h2>
      
      {Object.entries(categories).map(([category, blocks]) => (
        <div key={category} className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide mb-3">
            {category}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {blocks.map((blockType) => (
              <BlockTypeItem key={blockType.type} blockType={blockType} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}