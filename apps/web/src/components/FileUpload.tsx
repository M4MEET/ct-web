'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  className?: string;
}

export function FileUpload({
  onFilesChange,
  maxFiles = 3,
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  className = ''
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('');
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`File is too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB.`);
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('File type not supported. Please upload images, PDFs, or Word documents.');
      } else {
        setError('File upload failed. Please try again.');
      }
      return;
    }

    const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
    setFiles(newFiles);
    onFilesChange(newFiles);
  }, [files, maxFiles, maxSize, onFilesChange]);

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: maxFiles - files.length,
    maxSize,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('word')) return '📝';
    return '📎';
  };

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-400 bg-primary-50'
            : files.length >= maxFiles
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
        }`}
      >
        <input {...getInputProps()} disabled={files.length >= maxFiles} />
        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          {files.length >= maxFiles ? (
            <p className="text-gray-500">Maximum number of files reached</p>
          ) : isDragActive ? (
            <p className="text-primary-600">Drop the files here...</p>
          ) : (
            <div>
              <p className="text-gray-600">
                Drag & drop files here, or{' '}
                <span className="text-primary-600 font-medium">browse</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Max {maxFiles} files, up to {Math.round(maxSize / (1024 * 1024))}MB each
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supported: Images, PDF, Word documents
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">Selected files:</p>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getFileIcon(file.type)}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Remove file"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}