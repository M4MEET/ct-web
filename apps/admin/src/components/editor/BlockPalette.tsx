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
      className="group bg-white border border-gray-200 rounded-lg p-3 cursor-grab hover:shadow-lg hover:border-primary-300 hover:bg-primary-50/30 transition-all duration-200 transform hover:scale-105"
    >
      <div className="text-xl mb-2 group-hover:scale-110 transition-transform duration-200">{blockType.icon}</div>
      <h3 className="font-semibold text-sm mb-1 text-gray-900 group-hover:text-primary-700">{blockType.label}</h3>
      <p className="text-xs text-gray-600 group-hover:text-gray-700 leading-relaxed">{blockType.description}</p>
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

  const categoryIcons = {
    content: '📝',
    layout: '📐',
    media: '🖼️',
    forms: '📋',
  };

  const categoryColors = {
    content: 'bg-blue-50 text-blue-700 border-blue-200',
    layout: 'bg-purple-50 text-purple-700 border-purple-200',
    media: 'bg-green-50 text-green-700 border-green-200',
    forms: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  return (
    <div className="w-72 bg-white border-r border-gray-200 shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Block Palette</h2>
            <p className="text-sm text-gray-600">Drag to add blocks</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto h-full pb-6">
        <div className="p-6 space-y-8">
          {Object.entries(categories).map(([category, blocks]) => (
            <div key={category} className="">
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${categoryColors[category as keyof typeof categoryColors]}`}>
                  <span className="mr-1">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </div>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
              
              {/* Blocks Grid */}
              <div className="grid grid-cols-2 gap-3">
                {blocks.map((blockType) => (
                  <BlockTypeItem key={blockType.type} blockType={blockType} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}