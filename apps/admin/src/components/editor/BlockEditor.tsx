'use client';

import { useState, useCallback } from 'react';
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
          heading: 'Features',
          columns: 3,
          items: [
            { title: 'Feature 1', body: 'Description for feature 1' },
            { title: 'Feature 2', body: 'Description for feature 2' },
            { title: 'Feature 3', body: 'Description for feature 3' },
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

  const updateBlock = useCallback((blockId: string, updates: Partial<AnyBlock>) => {
    onChange(blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
  }, [blocks, onChange]);

  const deleteBlock = useCallback((blockId: string) => {
    onChange(blocks.filter(block => block.id !== blockId));
    setSelectedBlockId(null);
  }, [blocks, onChange]);

  const selectedBlock = selectedBlockId 
    ? blocks.find(block => block.id === selectedBlockId) 
    : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full bg-gray-50">
        <BlockPalette />
        
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Block Editor</h2>
                  <p className="text-sm text-gray-600">Build your page with drag & drop blocks</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {blocks.length} block{blocks.length !== 1 ? 's' : ''}
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm ${
                    showPreview 
                      ? 'bg-primary-600 text-white shadow-md hover:bg-primary-700' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <div className={`h-full ${showPreview ? 'grid grid-cols-2' : ''}`}>
              {/* Editor Column */}
              <div className="h-full overflow-y-auto">
                <div className={`p-8 ${showPreview ? '' : 'max-w-5xl mx-auto'}`}>
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
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-16 text-center bg-white">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Building Your Page</h3>
                          <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Drag blocks from the left panel to create your content. Mix and match different block types to build the perfect page.
                          </p>
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                            Drag a block here to get started
                          </div>
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </div>
              </div>
              
              {/* Preview Column */}
              {showPreview && (
                <div className="h-full bg-white border-l border-gray-200 overflow-y-auto">
                  <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">See how your blocks will look on the live site</p>
                  </div>
                  <div className="p-6">
                    <BlockPreview blocks={blocks} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Properties Panel */}
        {selectedBlock && (
          <div className="w-96 bg-white border-l border-gray-200 shadow-lg flex flex-col">
            {/* Panel Header */}
            <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Block Settings</h3>
                    <p className="text-sm text-gray-600 capitalize">{selectedBlock.type} block</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBlockId(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <BlockForm
                block={selectedBlock}
                onChange={(updates) => updateBlock(selectedBlock.id, updates)}
              />
            </div>
          </div>
        )}

        <DragOverlay>
          {activeId ? (
            <div className="bg-white border-2 border-primary-300 rounded-xl p-4 shadow-2xl transform rotate-2">
              <div className="flex items-center gap-2 text-primary-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="font-medium">Moving block...</span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}