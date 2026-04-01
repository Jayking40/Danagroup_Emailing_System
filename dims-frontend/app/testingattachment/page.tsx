'use client';

import { useState } from 'react';
import AttachmentUploader, { UploadedFile } from '@/components/mail/AttachmentUploader';
import AttachmentList, { Attachment } from '@/components/mail/AttachmentList';

export default function TestAttachmentsPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [errorLog, setErrorLog] = useState<string[]>([]);

  const handleFilesAdded = (files: UploadedFile[]) => {
    setUploadedFiles(files);

    // Convert to attachments
    const newAttachments = files.map((f) => ({
      id: f.id,
      name: f.file.name,
      size: f.file.size,
      type: f.file.type,
    }));
    setAttachments(newAttachments);
  };

  const handleError = (error: string) => {
    setErrorLog((prev) => [...prev, error]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Attachment Upload Test
          </h1>
          <p className="text-gray-600">
            Test the attachment uploader with drag-and-drop functionality
          </p>
        </div>

        <div className="space-y-6">
          {/* Upload Section */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Upload Files
            </h2>
            <AttachmentUploader
              onFilesAdded={handleFilesAdded}
              onError={handleError}
            />
          </div>

          {/* Attachments List Section */}
          {attachments.length > 0 && (
            <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
              <AttachmentList
                attachments={attachments}
                onRemove={handleRemoveAttachment}
              />
            </div>
          )}

          {/* Status Info */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  Files Uploaded:
                </span>{' '}
                {attachments.length}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  Total Size:
                </span>{' '}
                {(
                  attachments.reduce((acc, a) => acc + a.size, 0) /
                  1024 /
                  1024
                ).toFixed(1)}
                MB / 50MB
              </p>
              {uploadedFiles.some((f) => f.progress < 100) && (
                <p className="text-blue-600">
                  ⏳ Uploading... ({uploadedFiles.filter((f) => f.progress < 100).length} file(s))
                </p>
              )}
              {uploadedFiles.every((f) => f.progress === 100) &&
                uploadedFiles.length > 0 && (
                  <p className="text-green-600">✓ All files uploaded</p>
                )}
            </div>
          </div>

          {/* Error Log */}
          {errorLog.length > 0 && (
            <div className="rounded-lg bg-red-50 p-6 border border-red-200">
              <h2 className="text-lg font-semibold text-red-900 mb-3">
                Error Log
              </h2>
              <div className="space-y-1 text-sm text-red-800">
                {errorLog.map((error, idx) => (
                  <p key={idx}>• {error}</p>
                ))}
              </div>
            </div>
          )}

          {/* Test Instructions */}
          <div className="rounded-lg bg-blue-50 p-6 border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Test Instructions
            </h2>
            <ul className="space-y-2 text-sm text-blue-900 list-disc list-inside">
              <li>Drag and drop files into the upload zone</li>
              <li>Or click to browse and select files</li>
              <li>Supported: PDF, DOC, DOCX, XLS, XLSX, images</li>
              <li>Max 20MB per file, 50MB total</li>
              <li>Remove files by clicking the ✕ button</li>
              <li>Watch progress bars update during upload</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
