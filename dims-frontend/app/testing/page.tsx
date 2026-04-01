'use client';

import AnnouncementFeed from '@/components/announcements/AnnouncementFeed';

const mockAnnouncements = [
  {
    id: '1',
    title: 'Q2 2024 Results Announcement',
    body: 'We are excited to announce our strong Q2 performance with a 15% growth in revenue across all divisions. This marks our best quarter to date.',
    author: 'John Smith',
    subsidiary: 'MainCorp',
    department: 'Finance',
    type: 'Financial',
    date: new Date('2024-06-15'),
    isPinned: true,
  },
  {
    id: '2',
    title: 'New Office Policy on Remote Work',
    body: 'Effective July 1st, we are introducing a flexible hybrid work model allowing employees to work remotely up to 3 days per week.',
    author: 'Sarah Johnson',
    subsidiary: 'MainCorp',
    department: 'Human Resources',
    type: 'Policy',
    date: new Date('2024-06-10'),
    isPinned: true,
  },
  {
    id: '3',
    title: 'Product Launch: Enterprise Suite V3',
    body: 'Our engineering team has completed the development of Enterprise Suite V3 with enhanced security features and improved performance metrics.',
    author: 'Mike Chen',
    subsidiary: 'TechDivision',
    department: 'Engineering',
    type: 'Product',
    date: new Date('2024-06-05'),
    isPinned: false,
  },
  {
    id: '4',
    title: 'Annual Company Retreat',
    body: 'Join us for our annual company retreat on July 20-22 at the Mountain Resort. This is a great opportunity to connect with colleagues and celebrate our achievements.',
    author: 'Emma Wilson',
    subsidiary: 'MainCorp',
    department: 'Events',
    type: 'Event',
    date: new Date('2024-05-28'),
    isPinned: false,
  },
  {
    id: '5',
    title: 'Security Update Required',
    body: 'All employees must update their system security credentials by June 30th. Please follow the instructions sent to your email address.',
    author: 'Alex Rivera',
    subsidiary: 'TechDivision',
    department: 'IT',
    type: 'Security',
    date: new Date('2024-05-20'),
    isPinned: false,
  },
  {
    id: '6',
    title: 'Training Program: Leadership Development',
    body: 'We are launching a new leadership development program for managers and senior staff. Applications are now open for the fall cohort.',
    author: 'Lisa Brown',
    subsidiary: 'MainCorp',
    department: 'Human Resources',
    type: 'Training',
    date: new Date('2024-05-15'),
    isPinned: false,
  },
  {
    id: '7',
    title: 'Sustainability Initiative Launch',
    body: 'We are committed to reducing our carbon footprint. Starting June 1st, all offices will implement new sustainability practices.',
    author: 'David Green',
    subsidiary: 'Services',
    department: 'Operations',
    type: 'Initiative',
    date: new Date('2024-05-10'),
    isPinned: false,
  },
  {
    id: '8',
    title: 'Customer Success Team Expansion',
    body: 'We are hiring 10 new members for our customer success team. If interested, please submit your application through our career portal.',
    author: 'Rachel Martinez',
    subsidiary: 'Services',
    department: 'Human Resources',
    type: 'Hiring',
    date: new Date('2024-05-05'),
    isPinned: false,
  },
  {
    id: '9',
    title: 'API v2.0 Deprecation Notice',
    body: 'Please note that API v1.0 will be deprecated on August 31st. All clients should migrate to API v2.0 before this date.',
    author: 'James Park',
    subsidiary: 'TechDivision',
    department: 'Engineering',
    type: 'Technical',
    date: new Date('2024-04-30'),
    isPinned: false,
  },
  {
    id: '10',
    title: 'Benefits Plan Update',
    body: 'Our annual benefits plan review is complete. New benefits options will be available starting July 1st. Review the details in the attached document.',
    author: 'Patricia Lee',
    subsidiary: 'MainCorp',
    department: 'Human Resources',
    type: 'Benefits',
    date: new Date('2024-04-25'),
    isPinned: false,
  },
  {
    id: '11',
    title: 'Q3 Budget Approval',
    body: 'All department Q3 budgets have been approved. Department heads will receive detailed budget allocation documents by end of week.',
    author: 'Robert Davis',
    subsidiary: 'MainCorp',
    department: 'Finance',
    type: 'Financial',
    date: new Date('2024-04-20'),
    isPinned: false,
  },
  {
    id: '12',
    title: 'Office Renovation Project',
    body: 'Our main office will undergo renovations from June 1st to July 15th. Teams will work from home during this period.',
    author: 'Thomas Anderson',
    subsidiary: 'Services',
    department: 'Operations',
    type: 'Operations',
    date: new Date('2024-04-15'),
    isPinned: false,
  },
];

export default function AnnouncementsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Company Announcements</h1>
          <p className="text-gray-600">Stay informed about important company updates and news</p>
        </div>
        <AnnouncementFeed announcements={mockAnnouncements} itemsPerPage={10} />
      </div>
    </main>
  );
}
