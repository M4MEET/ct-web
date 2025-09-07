import { Suspense } from 'react';
import { PagesPageContent } from './PagesPageContent';

export default function PagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading pages...</div>
        </div>
      </div>
    }>
      <PagesPageContent />
    </Suspense>
  );
}