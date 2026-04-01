// types.ts
export interface AttachmentFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  uploaded: boolean;
  error?: string;
}