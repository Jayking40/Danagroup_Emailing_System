'use client';

import { formatDistanceToNow } from 'date-fns';
import { Pin } from 'lucide-react';

interface AnnouncementCardProps {
  id: string;
  title: string;
  body: string;
  author: string;
  subsidiary: string;
  department: string;
  type: string;
  date: Date;
  isPinned: boolean;
}

export default function AnnouncementCard({
  title,
  body,
  author,
  subsidiary,
  department,
  type,
  date,
  isPinned,
}: AnnouncementCardProps) {
  return (
    <div className={`border rounded-lg p-4 md:p-6 transition-all ${
      isPinned 
        ? 'bg-yellow-50 border-yellow-200 shadow-sm' 
        : 'bg-white border-gray-200 hover:shadow-md'
    }`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {isPinned && <Pin className="w-4 h-4 text-yellow-600" />}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
              {subsidiary}
            </span>
            <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded">
              {department}
            </span>
            <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">
              {type}
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 text-sm md:text-base mb-4 leading-relaxed">{body}</p>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between text-xs text-gray-500 gap-2">
        <div className="flex items-center gap-4">
          <span>By {author}</span>
          <span>{formatDistanceToNow(new Date(date), { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
}
