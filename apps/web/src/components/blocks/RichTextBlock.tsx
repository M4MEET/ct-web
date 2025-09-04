import { RichTextBlock as RichTextBlockType } from '@codex/content';

interface RichTextBlockProps {
  data: RichTextBlockType;
}

export function RichTextBlock({ data }: RichTextBlockProps) {
  if (!data) {
    return null;
  }
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {data.heading && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.heading}
            </h2>
          </div>
        )}
        
        {data.content && (
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        )}
        
        {data.cta && (
          <div className="text-center mt-12">
            <a
              href={data.cta.href}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {data.cta.label}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}