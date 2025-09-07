import { TestimonialBlock as TestimonialBlockType } from '@codex/content';

interface TestimonialBlockProps {
  data: TestimonialBlockType;
}

export function TestimonialBlock({ data }: TestimonialBlockProps) {
  return (
    <section className="py-16 sm:py-20 bg-transparent relative">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {data.heading && (
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              {data.heading.split(' ').slice(0, -2).join(' ')}{' '}
              <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                {data.heading.split(' ').slice(-2).join(' ')}
              </span>
            </h2>
          </div>
        )}
        
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-white/95 backdrop-blur-xl border border-gray-200/60 shadow-2xl rounded-3xl p-8 sm:p-12 hover:shadow-3xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-primary-100/20 rounded-3xl"></div>
            <div className="absolute top-6 left-8 w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
              </svg>
            </div>
            
            <blockquote className="relative text-center pt-8">
              <div className="text-xl sm:text-2xl lg:text-3xl leading-relaxed font-medium text-gray-900 mb-8 sm:mb-10 italic">
                "{data.quote}"
              </div>
              
              <footer className="flex flex-col sm:flex-row items-center justify-center sm:space-x-6 space-y-4 sm:space-y-0">
                {data.author?.avatar && (
                  <div className="relative">
                    <img
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-lg"
                      src={data.author.avatar}
                      alt={data.author?.name || 'Author'}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                )}
                
                <div className="text-center sm:text-left">
                  <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                    {data.author?.name || data.author}
                  </div>
                  {(data.author?.role || data.author?.company) && (
                    <div className="text-sm sm:text-base text-primary-600 font-medium">
                      {data.author?.role}
                      {data.author?.role && data.author?.company && ' at '}
                      {data.author?.company}
                    </div>
                  )}
                  
                  {data.rating && (
                    <div className="flex items-center justify-center sm:justify-start mt-2">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < data.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </footer>
            </blockquote>
            
            <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-b-3xl opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
}