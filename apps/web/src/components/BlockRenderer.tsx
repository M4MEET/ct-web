import { AnyBlock, BlockType } from '@codex/content';
import { HeroBlock } from './blocks/HeroBlock';
import { FeatureGridBlock } from './blocks/FeatureGridBlock';
import { TestimonialBlock } from './blocks/TestimonialBlock';
import { LogoCloudBlock } from './blocks/LogoCloudBlock';
import { MetricsBlock } from './blocks/MetricsBlock';
import { RichTextBlock } from './blocks/RichTextBlock';
import { FAQBlock } from './blocks/FAQBlock';
import { ContactFormBlock } from './blocks/ContactFormBlock';
import { MediaBlock } from './blocks/MediaBlock';
import { PriceTableBlock } from './blocks/PriceTableBlock';

// Database block format (from Prisma)
interface DatabaseBlock {
  id: string;
  type: BlockType;
  data: any;
  order: number;
}

// Union type for both formats
type RenderableBlock = AnyBlock | DatabaseBlock;

interface BlockRendererProps {
  blocks: RenderableBlock[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div className="bg-codex-terminal-component min-h-screen relative">
      {/* Global floating gradient orbs background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top right orb - subtle gradient */}
        <div className="absolute top-[8%] right-[3%] w-80 h-80 sm:w-[400px] sm:h-[400px] bg-gradient-to-br from-primary-200/40 to-primary-300/30 rounded-full blur-3xl animate-pulse" 
             style={{ animationDelay: '0s' }}></div>
        
        {/* Left side orb - very subtle */}
        <div className="absolute top-[50%] left-[2%] w-72 h-72 sm:w-[350px] sm:h-[350px] bg-gradient-to-tr from-primary-100/35 to-primary-200/25 rounded-full blur-3xl animate-pulse" 
             style={{ animationDelay: '2s' }}></div>
        
        {/* Center large orb - main background element */}
        <div className="absolute top-[30%] right-[12%] w-96 h-96 sm:w-[550px] sm:h-[550px] bg-gradient-radial from-primary-200/30 to-primary-100/20 rounded-full blur-2xl animate-pulse" 
             style={{ animationDelay: '4s' }}></div>
        
        {/* Bottom right orb - gentle */}
        <div className="absolute top-[75%] right-[20%] w-64 h-64 sm:w-[300px] sm:h-[300px] bg-gradient-to-bl from-primary-300/35 to-primary-200/25 rounded-full blur-3xl animate-pulse" 
             style={{ animationDelay: '1s' }}></div>
        
        {/* Top left orb - subtle */}
        <div className="absolute top-[15%] left-[15%] w-56 h-56 sm:w-[280px] sm:h-[280px] bg-gradient-to-tr from-primary-200/30 to-primary-100/20 rounded-full blur-3xl animate-pulse" 
             style={{ animationDelay: '3s' }}></div>

      </div>
      
      <div className="relative z-10">
        {blocks
          .filter(block => block != null)
          .sort((a, b) => {
            // Sort by order if available (database format)
            const orderA = 'order' in a ? a.order : 0;
            const orderB = 'order' in b ? b.order : 0;
            return orderA - orderB;
          })
          .map((block) => {
            const normalizedBlock = normalizeBlockData(block);
            
            // Skip if not visible or invalid
            if (!normalizedBlock || normalizedBlock.visible === false) {
              return null;
            }
            
            const BlockComponent = getBlockComponent(normalizedBlock.type);
            
            if (!BlockComponent) {
              return (
                <div key={normalizedBlock.id} className="py-8 bg-gray-100 text-center">
                  <p className="text-gray-600">
                    Block type "{normalizedBlock.type}" not implemented yet
                  </p>
                  {process.env.NODE_ENV === 'development' && (
                    <pre className="mt-4 text-xs text-left bg-gray-200 p-2 rounded">
                      {JSON.stringify(normalizedBlock, null, 2)}
                    </pre>
                  )}
                </div>
              );
            }
            
            return <BlockComponent key={normalizedBlock.id} data={normalizedBlock} />;
          })}
      </div>
    </div>
  );
}

/**
 * Normalize block data from different formats into a consistent structure
 */
function normalizeBlockData(block: RenderableBlock): AnyBlock | null {
  try {
    // If it's already in the correct format (has type and id at root)
    if (isDirectBlock(block)) {
      return block;
    }

    // If it's a database block format
    if (isDatabaseBlock(block)) {
      // Extract the block data and ensure it has required fields
      const blockData = block.data;
      if (!blockData || typeof blockData !== 'object') {
        console.warn('Invalid block data:', block);
        return null;
      }

      // Try to find the deepest valid content by recursively checking for meaningful data
      const normalizedData = extractDeepestValidContent(blockData, block.id, block.type);
      
      // Debug logging for development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[BlockRenderer] Normalizing block ${block.id}:`, {
          originalData: blockData,
          normalizedData,
          hasValidContent: hasNonEmptyContent(normalizedData)
        });
      }
      
      return {
        ...normalizedData,
        id: normalizedData.id || block.id,
        type: normalizedData.type || block.type,
        visible: normalizedData.visible ?? true,
      };
    }

    // Fallback: try to extract block data if it's nested
    let data = block as any;
    let attempts = 0;
    
    while (data?.data && typeof data.data === 'object' && attempts < 5) {
      data = data.data;
      attempts++;
    }

    if (data && data.type && data.id) {
      return {
        ...data,
        visible: data.visible ?? true,
      };
    }

    console.warn('Could not normalize block data:', block);
    return null;
  } catch (error) {
    console.error('Error normalizing block data:', error, block);
    return null;
  }
}

/**
 * Recursively extract the deepest valid content from nested data structures
 */
function extractDeepestValidContent(data: any, fallbackId: string, fallbackType: string): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Check if current level has meaningful content (non-empty strings for text fields)
  const hasValidContent = hasNonEmptyContent(data);
  
  // If current level has valid content and required fields, use it
  if (hasValidContent && (data.type || data.id)) {
    return data;
  }

  // If there's nested data, check deeper levels
  if (data.data && typeof data.data === 'object') {
    const deeperContent = extractDeepestValidContent(data.data, fallbackId, fallbackType);
    
    // If deeper content has valid data, use it; otherwise fall back to current level
    if (deeperContent && hasNonEmptyContent(deeperContent)) {
      return deeperContent;
    }
  }

  // Fall back to current level data with fallback values
  return {
    ...data,
    id: data.id || fallbackId,
    type: data.type || fallbackType,
  };
}

/**
 * Check if the data object contains meaningful non-empty content
 */
function hasNonEmptyContent(data: any): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Check common text fields that indicate meaningful content
  const textFields = ['headline', 'title', 'content', 'quote', 'subcopy', 'eyebrow'];
  
  for (const field of textFields) {
    if (data[field] && typeof data[field] === 'string' && data[field].trim() !== '') {
      return true;
    }
  }

  // Check for arrays with content
  const arrayFields = ['items', 'features', 'badges', 'brands'];
  for (const field of arrayFields) {
    if (Array.isArray(data[field]) && data[field].length > 0) {
      return true;
    }
  }

  // Check for CTAs
  if (data.cta && data.cta.label && data.cta.label.trim() !== '') {
    return true;
  }
  if (data.primaryCTA && data.primaryCTA.label && data.primaryCTA.label.trim() !== '') {
    return true;
  }

  return false;
}

/**
 * Type guard to check if block is in direct format
 */
function isDirectBlock(block: RenderableBlock): block is AnyBlock {
  return 'type' in block && 'id' in block && !('data' in block);
}

/**
 * Type guard to check if block is in database format
 */
function isDatabaseBlock(block: RenderableBlock): block is DatabaseBlock {
  return 'data' in block && 'type' in block && 'order' in block;
}

/**
 * Get the appropriate React component for a block type
 */
function getBlockComponent(type: BlockType) {
  const components = {
    hero: HeroBlock,
    featureGrid: FeatureGridBlock,
    testimonial: TestimonialBlock,
    logoCloud: LogoCloudBlock,
    metrics: MetricsBlock,
    richText: RichTextBlock,
    faq: FAQBlock,
    contactForm: ContactFormBlock,
    media: MediaBlock,
    priceTable: PriceTableBlock,
    comparison: null, // Not implemented yet
  } as const;

  return components[type] || null;
}