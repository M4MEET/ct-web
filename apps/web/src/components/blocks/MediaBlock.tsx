import { MediaBlock as MediaBlockType } from '@codex/content';

interface MediaBlockProps {
  data: MediaBlockType;
}

export function MediaBlock({ data }: MediaBlockProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {data.heading && (
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.heading}
            </h2>
            {data.subtitle && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {data.subtitle}
              </p>
            )}
          </div>
        )}
        
        <div className="rounded-lg overflow-hidden shadow-lg">
          {data.type === 'image' && (
            <img
              src={data.src}
              alt={data.alt || ''}
              className="w-full h-auto object-cover"
              style={{ maxHeight: data.maxHeight || 'auto' }}
            />
          )}
          
          {data.type === 'video' && (
            <video
              src={data.src}
              poster={data.poster}
              controls={data.controls !== false}
              autoPlay={data.autoplay}
              loop={data.loop}
              muted={data.muted}
              className="w-full h-auto"
              style={{ maxHeight: data.maxHeight || 'auto' }}
            >
              Your browser does not support the video tag.
            </video>
          )}
          
          {data.type === 'embed' && (
            <div 
              className="w-full"
              style={{ aspectRatio: data.aspectRatio || '16/9' }}
            >
              <iframe
                src={data.src}
                title={data.alt || 'Embedded content'}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
        
        {data.caption && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {data.caption}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}