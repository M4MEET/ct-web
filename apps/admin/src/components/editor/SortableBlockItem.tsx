'use client';

import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AnyBlock } from '@codex/content';

interface SortableBlockItemProps {
  block: AnyBlock;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function SortableBlockItem({ 
  block, 
  isSelected, 
  onSelect, 
  onDelete 
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getBlockIcon = (type: string) => {
    const icons: Record<string, string> = {
      hero: '🦸',
      featureGrid: '⚡',
      testimonial: '💬',
      logoCloud: '🏢',
      metrics: '📊',
      richText: '📝',
      faq: '❓',
      priceTable: '💰',
      comparison: '⚖️',
      contactForm: '📨',
      media: '🖼️',
    };
    return icons[type] || '🔲';
  };

  const getBlockTitle = (block: AnyBlock) => {
    switch (block.type) {
      case 'hero':
        return (block as any).headline || 'Hero Section';
      case 'featureGrid':
        return (block as any).heading || 'Feature Grid';
      case 'testimonial':
        return `Testimonial - ${(block as any).author?.name || 'Anonymous'}`;
      case 'logoCloud':
        return (block as any).title || 'Logo Cloud';
      case 'richText':
        return 'Rich Text Block';
      case 'faq':
        return 'FAQ Section';
      case 'metrics':
        return 'Metrics Section';
      case 'priceTable':
        return 'Price Table';
      case 'comparison':
        return 'Comparison Table';
      case 'contactForm':
        return (block as any).heading || 'Contact Form';
      case 'media':
        return 'Media Block';
      default:
        return `${block.type} Block`;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group border rounded-xl p-5 bg-white cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md
        ${isDragging ? 'opacity-50 transform rotate-2' : ''}
        ${isSelected ? 'ring-2 ring-primary-500 border-primary-300 bg-primary-50/30' : 'border-gray-200 hover:border-gray-300'}
        ${!block.visible ? 'opacity-60' : ''}
      `}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Drag to reorder"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          
          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <span className="text-2xl">{getBlockIcon(block.type)}</span>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-base text-gray-900 group-hover:text-primary-700 transition-colors">{getBlockTitle(block)}</h3>
            <p className="text-sm text-gray-600 capitalize mt-1">{block.type} block</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Toggle visibility
            }}
            className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              block.visible 
                ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
            }`}
            title={block.visible ? 'Hide block' : 'Show block'}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {block.visible ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L17.121 17.121" />
              )}
            </svg>
            {block.visible ? 'Visible' : 'Hidden'}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete block"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}