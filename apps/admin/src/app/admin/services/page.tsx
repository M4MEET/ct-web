import { Suspense } from 'react';
import { ServicesPageContent } from './ServicesPageContent';

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading services...</div>
      </div>
    }>
      <ServicesPageContent />
    </Suspense>
  );
}