import { TestimonialBlock as TestimonialBlockType } from '@codex/content';

interface TestimonialBlockProps {
  data: TestimonialBlockType;
}

export function TestimonialBlock({ data }: TestimonialBlockProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {data.heading && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.heading}
            </h2>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto">
          <blockquote className="text-center">
            <div className="text-2xl md:text-3xl leading-9 font-medium text-gray-900 mb-8">
              "{data.quote}"
            </div>
            <footer className="flex items-center justify-center space-x-4">
              {data.avatar && (
                <img
                  className="w-12 h-12 rounded-full"
                  src={data.avatar}
                  alt={data.author}
                />
              )}
              <div className="text-left">
                <div className="text-lg font-medium text-gray-900">
                  {data.author}
                </div>
                {(data.role || data.company) && (
                  <div className="text-sm text-gray-600">
                    {data.role}
                    {data.role && data.company && ', '}
                    {data.company}
                  </div>
                )}
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}