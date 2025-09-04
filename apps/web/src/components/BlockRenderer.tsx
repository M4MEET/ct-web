import { AnyBlock } from '@codex/content';
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

interface BlockRendererProps {
  blocks: AnyBlock[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div>
      {blocks
        .filter(block => block?.data)
        .map((block) => {
          // Handle corrupted nested data structure - if block.data.data exists, use that instead
          const blockData = block.data?.data || block.data;
          
          // Skip if no valid blockData or if not visible
          if (!blockData || blockData?.visible === false) {
            return null;
          }
          
          switch (block.type) {
            case 'hero':
              return <HeroBlock key={block.id} data={blockData} />;
            case 'featureGrid':
              return <FeatureGridBlock key={block.id} data={blockData} />;
            case 'testimonial':
              return <TestimonialBlock key={block.id} data={blockData} />;
            case 'logoCloud':
              return <LogoCloudBlock key={block.id} data={blockData} />;
            case 'metrics':
              return <MetricsBlock key={block.id} data={blockData} />;
            case 'richText':
              return <RichTextBlock key={block.id} data={blockData} />;
            case 'faq':
              return <FAQBlock key={block.id} data={blockData} />;
            case 'contactForm':
              return <ContactFormBlock key={block.id} data={blockData} />;
            case 'media':
              return <MediaBlock key={block.id} data={blockData} />;
            case 'priceTable':
              return <PriceTableBlock key={block.id} data={blockData} />;
            default:
              return (
                <div key={block.id} className="py-8 bg-gray-100 text-center">
                  <p className="text-gray-600">
                    Block type "{block.type}" not implemented yet
                  </p>
                </div>
              );
          }
        })}
    </div>
  );
}