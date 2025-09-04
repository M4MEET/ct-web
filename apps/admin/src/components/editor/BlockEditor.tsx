'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { AnyBlock } from '@codex/content';
import { BlockPalette } from './BlockPalette';
import { SortableBlockItem } from './SortableBlockItem';
import { BlockForm } from './BlockForm';
import { BlockPreview } from './BlockPreview';
import { v4 as uuidv4 } from 'uuid';

interface BlockEditorProps {
  blocks: AnyBlock[];
  onChange: (blocks: AnyBlock[]) => void;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    // Handle dropping a new block type from palette
    if (active.data.current?.type === 'blockType') {
      const blockType = active.data.current.blockType;
      const newBlock = createEmptyBlock(blockType);
      
      const dropIndex = blocks.findIndex(block => block.id === over.id);
      const insertIndex = dropIndex >= 0 ? dropIndex : blocks.length;
      
      const newBlocks = [...blocks];
      newBlocks.splice(insertIndex, 0, newBlock);
      onChange(newBlocks);
    } 
    // Handle reordering existing blocks
    else if (active.id !== over.id) {
      const oldIndex = blocks.findIndex(block => block.id === active.id);
      const newIndex = blocks.findIndex(block => block.id === over.id);
      
      onChange(arrayMove(blocks, oldIndex, newIndex));
    }

    setActiveId(null);
  };

  const createEmptyBlock = (type: string): AnyBlock => {
    const baseBlock = {
      id: uuidv4(),
      type,
      visible: true,
    };

    switch (type) {
      case 'hero':
        return {
          ...baseBlock,
          type: 'hero' as const,
          headline: 'Your Headline Here',
        };
      case 'featureGrid':
        return {
          ...baseBlock,
          type: 'featureGrid' as const,
          columns: 3,
          items: [
            { title: 'Feature 1', body: 'Description for feature 1' },
          ],
        };
      case 'testimonial':
        return {
          ...baseBlock,
          type: 'testimonial' as const,
          quote: 'Add your testimonial quote here',
          author: { name: 'Customer Name' },
        };
      case 'richText':
        return {
          ...baseBlock,
          type: 'richText' as const,
          content: 'Add your content here...',
        };
      default:
        return {
          ...baseBlock,
          type: type as any,
        };
    }
  };

  const updateBlock = (blockId: string, updates: Partial<AnyBlock>) => {
    onChange(blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (blockId: string) => {
    onChange(blocks.filter(block => block.id !== blockId));
    setSelectedBlockId(null);
  };

  const selectedBlock = selectedBlockId 
    ? blocks.find(block => block.id === selectedBlockId) 
    : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full">
        <BlockPalette />
        
        <div className="flex-1 p-6">
          {/* Header with preview toggle */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Block Editor</h2>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showPreview 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>

          <div className={showPreview ? 'grid grid-cols-2 gap-6' : ''}>
            {/* Editor Column */}
            <div className={showPreview ? '' : 'max-w-4xl mx-auto'}>
            <SortableContext
              items={blocks.map(block => block.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {blocks.map((block) => (
                  <SortableBlockItem
                    key={block.id}
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => setSelectedBlockId(block.id)}
                    onDelete={() => deleteBlock(block.id)}
                  />
                ))}
                
                {blocks.length === 0 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <p className="text-gray-500 mb-2">No blocks yet</p>
                    <p className="text-sm text-gray-400">
                      Drag blocks from the palette to start building your content
                    </p>
                  </div>
                )}
              </div>
            </SortableContext>
            </div>
            
            {/* Preview Column */}
            {showPreview && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
                <BlockPreview blocks={blocks} />
              </div>
            )}
          </div>
        </div>

        {selectedBlock && (
          <div className="w-80 bg-white border-l border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Edit Block</h3>
              <button
                onClick={() => setSelectedBlockId(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <BlockForm
              block={selectedBlock}
              onChange={(updates) => updateBlock(selectedBlock.id, updates)}
            />
          </div>
        )}

        <DragOverlay>
          {activeId ? (
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
              Dragging block...
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}