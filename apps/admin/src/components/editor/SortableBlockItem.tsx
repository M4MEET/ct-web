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
        return block.headline || 'Hero Section';
      case 'featureGrid':
        return block.heading || 'Feature Grid';
      case 'testimonial':
        return `Testimonial - ${block.author.name}`;
      case 'richText':
        return 'Rich Text Block';
      default:
        return `${block.type} Block`;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        border rounded-lg p-4 bg-white cursor-pointer transition-all
        ${isDragging ? 'opacity-50' : ''}
        ${isSelected ? 'ring-2 ring-primary-500 border-blue-300' : 'border-gray-200 hover:border-gray-300'}
        ${!block.visible ? 'opacity-60' : ''}
      `}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing p-1"
          >
            ⋮⋮
          </button>
          
          <span className="text-xl">{getBlockIcon(block.type)}</span>
          
          <div>
            <h3 className="font-medium text-sm">{getBlockTitle(block)}</h3>
            <p className="text-xs text-gray-500 capitalize">{block.type} block</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Toggle visibility
            }}
            className={`text-xs px-2 py-1 rounded ${
              block.visible 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {block.visible ? 'Visible' : 'Hidden'}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-500 hover:text-red-700 p-1"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}