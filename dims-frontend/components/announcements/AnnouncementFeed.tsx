'use client';

import { useState, useMemo } from 'react';
import AnnouncementCard from './AnnouncementCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Announcement {
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

interface AnnouncementFeedProps {
  announcements: Announcement[];
  itemsPerPage?: number;
}

export default function AnnouncementFeed({ 
  announcements, 
  itemsPerPage = 10 
}: AnnouncementFeedProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    subsidiary: '',
    department: '',
    type: '',
  });

  // Get unique filter options
  const subsidiaries = [...new Set(announcements.map(a => a.subsidiary))];
  const departments = [...new Set(announcements.map(a => a.department))];
  const types = [...new Set(announcements.map(a => a.type))];

  // Filter and sort announcements
  const filteredAnnouncements = useMemo(() => {
    let filtered = announcements.filter(announcement => {
      const matchSubsidiary = !filters.subsidiary || announcement.subsidiary === filters.subsidiary;
      const matchDepartment = !filters.department || announcement.department === filters.department;
      const matchType = !filters.type || announcement.type === filters.type;
      return matchSubsidiary && matchDepartment && matchType;
    });

    // Sort: pinned first, then by date (newest first)
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [announcements, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAnnouncements = filteredAnnouncements.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to page 1 when filters change
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Filters */}
      <div className="mb-8 bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subsidiary
            </label>
            <select
              value={filters.subsidiary}
              onChange={(e) => handleFilterChange('subsidiary', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Subsidiaries</option>
              {subsidiaries.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Announcement Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {types.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="space-y-4 mb-8">
        {paginatedAnnouncements.length > 0 ? (
          paginatedAnnouncements.map(announcement => (
            <AnnouncementCard key={announcement.id} {...announcement} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No announcements found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  page === currentPage
                    ? 'bg-blue-500 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Info */}
      <div className="text-center mt-6 text-sm text-gray-600">
        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAnnouncements.length)} of {filteredAnnouncements.length} announcements
      </div>
    </div>
  );
}
