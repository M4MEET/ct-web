'use client';

import { useState } from 'react';
import { FAQBlock as FAQBlockType } from '@codex/content';

interface FAQBlockProps {
  data: FAQBlockType;
}

export function FAQBlock({ data }: FAQBlockProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {data.heading && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.heading}
            </h2>
            {data.subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {data.subtitle}
              </p>
            )}
          </div>
        )}
        
        <div className="space-y-4">
          {data.items.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => toggleItem(index)}
              >
                <span className="text-lg font-medium text-gray-900">
                  {item.question}
                </span>
                <span className="ml-4 flex-shrink-0">
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                      openItems.has(index) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              {openItems.has(index) && (
                <div className="px-6 pb-4">
                  <div className="text-gray-600">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}