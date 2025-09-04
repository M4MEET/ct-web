'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface MediaAsset {
  id: string;
  kind: string;
  url: string;
  alt?: string;
  meta?: any;
}

interface MediaUploaderProps {
  onUpload?: (asset: MediaAsset) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function MediaUploader({ 
  onUpload, 
  accept = 'image/*,video/*,.pdf',
  maxSize = 10 * 1024 * 1024, // 10MB
  className = ''
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const asset = await response.json();
      onUpload?.(asset);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
        setError(null);
      }, 2000);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm'],
      'application/pdf': ['.pdf'],
    },
    maxSize,
    multiple: false,
  });

  return (
    <div className={`relative ${className}`}>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive 
            ? 'border-primary-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="space-y-4">
            <div className="animate-spin mx-auto w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Uploading...</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            
            {isDragActive ? (
              <div className="text-primary-600">
                <div className="font-medium">Drop file here</div>
              </div>
            ) : (
              <div className="text-gray-600">
                <div className="font-medium">Click to upload or drag and drop</div>
                <div className="text-sm">
                  Images, videos, or PDFs up to {Math.round(maxSize / 1024 / 1024)}MB
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}

      {fileRejections.length > 0 && (
        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded text-sm text-orange-600">
          {fileRejections[0].errors[0].message}
        </div>
      )}
    </div>
  );
}