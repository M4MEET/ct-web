'use client';

import { useState } from 'react';
import { MediaUploader } from '@/components/media/MediaUploader';
import { MediaGallery } from '@/components/media/MediaGallery';

interface MediaAsset {
  id: string;
  kind: string;
  url: string;
  alt?: string;
  meta?: any;
  createdAt: string;
}

export default function MediaPage() {
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [view, setView] = useState<'gallery' | 'upload'>('gallery');

  const handleUpload = (asset: MediaAsset) => {
    setView('gallery');
    // The gallery will automatically refresh and show the new asset
  };

  const handleSelect = (asset: MediaAsset) => {
    setSelectedAsset(asset);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-gray-600 mt-2">Upload and manage your images, videos, and documents</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setView('gallery')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'gallery' 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Gallery
          </button>
          <button
            onClick={() => setView('upload')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'upload' 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Upload
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {view === 'upload' ? (
            <div className="space-y-6">
              <MediaUploader onUpload={handleUpload} />
              <div className="text-center">
                <button
                  onClick={() => setView('gallery')}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  ← Back to Gallery
                </button>
              </div>
            </div>
          ) : (
            <MediaGallery 
              onSelect={handleSelect}
              selectedId={selectedAsset?.id}
            />
          )}
        </div>

        {/* Asset Details Panel */}
        <div className="lg:col-span-1">
          {selectedAsset ? (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Asset Details</h3>
              
              {/* Preview */}
              <div className="mb-4">
                {selectedAsset.kind === 'image' ? (
                  <img
                    src={selectedAsset.url}
                    alt={selectedAsset.alt || 'Asset'}
                    className="w-full rounded-lg border"
                  />
                ) : selectedAsset.kind === 'video' ? (
                  <video
                    src={selectedAsset.url}
                    controls
                    className="w-full rounded-lg border"
                  />
                ) : (
                  <div className="w-full h-32 border rounded-lg flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 text-gray-400">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedAsset.meta?.originalName?.split('.').pop()?.toUpperCase()} File
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-gray-500 mb-1">File Name</label>
                  <div className="font-medium">
                    {selectedAsset.meta?.originalName || 'Untitled'}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-500 mb-1">Type</label>
                  <div className="font-medium capitalize">
                    {selectedAsset.kind} ({selectedAsset.meta?.type})
                  </div>
                </div>

                {selectedAsset.meta?.size && (
                  <div>
                    <label className="block text-gray-500 mb-1">File Size</label>
                    <div className="font-medium">
                      {(selectedAsset.meta.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-gray-500 mb-1">URL</label>
                  <div className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                    {selectedAsset.url}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-500 mb-1">Uploaded</label>
                  <div className="font-medium">
                    {new Date(selectedAsset.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedAsset.url);
                  }}
                  className="w-full bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 text-sm"
                >
                  Copy URL
                </button>
                <button
                  onClick={() => window.open(selectedAsset.url, '_blank')}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 text-sm"
                >
                  Open in New Tab
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border p-6 text-center text-gray-500">
              Select a media asset to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}