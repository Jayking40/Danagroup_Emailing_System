// TODO: Implement App Shell Layout
// - Authenticated route wrapper
// - Renders Sidebar + TopBar + main content area
// - Providers: TanStack Query, Zustand, WebSocket
// - Redirects to /login if not authenticated

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
