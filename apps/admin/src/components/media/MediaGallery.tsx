'use client';

import { useState, useEffect } from 'react';

interface MediaAsset {
  id: string;
  kind: string;
  url: string;
  alt?: string;
  meta?: any;
  createdAt: string;
}

interface MediaGalleryProps {
  onSelect?: (asset: MediaAsset) => void;
  selectedId?: string;
  className?: string;
}

export function MediaGallery({ onSelect, selectedId, className = '' }: MediaGalleryProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/media');
      
      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }
      
      const data = await response.json();
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media');
    } finally {
      setIsLoading(false);
    }
  };

  const addAsset = (newAsset: MediaAsset) => {
    setAssets(prev => [newAsset, ...prev]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={fetchMedia}
          className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <div className="text-gray-500 mb-2">No media files yet</div>
        <div className="text-sm text-gray-400">
          Upload your first image, video, or document
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className={`
              relative group border rounded-lg overflow-hidden cursor-pointer
              transition-all duration-200 hover:shadow-md
              ${selectedId === asset.id 
                ? 'ring-2 ring-primary-500 border-primary-500' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => onSelect?.(asset)}
          >
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              {asset.kind === 'image' ? (
                <img
                  src={asset.url}
                  alt={asset.alt || 'Image'}
                  className="w-full h-full object-cover"
                />
              ) : asset.kind === 'video' ? (
                <div className="relative w-full h-full bg-black flex items-center justify-center">
                  <video
                    src={asset.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-2">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-2">
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
                  <div className="text-xs text-gray-600 font-medium">
                    {asset.meta?.originalName?.split('.').pop()?.toUpperCase()}
                  </div>
                </div>
              )}
            </div>
            
            {/* Overlay with details */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-end">
              <div className="w-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="text-xs truncate font-medium">
                  {asset.meta?.originalName || asset.alt || 'Untitled'}
                </div>
                <div className="text-xs opacity-75">
                  {asset.meta?.size && formatFileSize(asset.meta.size)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}