import { Suspense } from 'react';
import { CaseStudiesPageContent } from './CaseStudiesPageContent';

export default function CaseStudiesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading case studies...</div>
      </div>
    }>
      <CaseStudiesPageContent />
    </Suspense>
  );
}