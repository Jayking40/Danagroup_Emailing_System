'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB

export interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  error?: string;
}

interface AttachmentUploaderProps {
  onFilesAdded?: (files: UploadedFile[]) => void;
  onError?: (error: string) => void;
}

export default function AttachmentUploader({
  onFilesAdded,
  onError,
}: AttachmentUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [totalSize, setTotalSize] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `File type not allowed: ${file.name}`,
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File too large: ${file.name} (max 20MB)`,
      };
    }

    return { valid: true };
  };

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      let newTotalSize = totalSize;
      const newUploadedFiles: UploadedFile[] = [];
      let hasError = false;

      fileArray.forEach((file) => {
        const validation = validateFile(file);

        if (!validation.valid) {
          setErrorMessage(validation.error || 'File validation failed');
          onError?.(validation.error || 'File validation failed');
          hasError = true;
          return;
        }

        if (newTotalSize + file.size > MAX_TOTAL_SIZE) {
          const error = `Total attachment size exceeds 50MB limit`;
          setErrorMessage(error);
          onError?.(error);
          hasError = true;
          return;
        }

        newTotalSize += file.size;
        const id = `${Date.now()}-${Math.random()}`;

        newUploadedFiles.push({
          id,
          file,
          progress: 0,
        });

        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress > 90) progress = 90;

          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === id ? { ...f, progress: Math.min(progress, 90) } : f
            )
          );

          if (progress >= 90) {
            clearInterval(interval);
            setUploadedFiles((prev) =>
              prev.map((f) => (f.id === id ? { ...f, progress: 100 } : f))
            );
          }
        }, 300);
      });

      if (!hasError) {
        setErrorMessage('');
        setTotalSize(newTotalSize);
        setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);
        onFilesAdded?.([...uploadedFiles, ...newUploadedFiles]);
      }
    },
    [totalSize, uploadedFiles, onFilesAdded, onError]
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) {
        setTotalSize((s) => s - file.file.size);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-lg border-2 border-dashed p-8 transition-colors',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
        />

        <div className="flex flex-col items-center gap-3">
          <Upload className="h-8 w-8 text-gray-400" />
          <div className="text-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="font-semibold text-blue-600 hover:underline"
            >
              Click to upload
            </button>
            <p className="text-sm text-gray-600">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            PDF, DOC, XLS, images up to 20MB each (50MB total)
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {errorMessage}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
            >
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {file.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.file.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <div className="w-24">
                <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      file.progress === 100
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    )}
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Total: {(totalSize / 1024 / 1024).toFixed(1)}MB / 50MB
      </p>
    </div>
  );
}
