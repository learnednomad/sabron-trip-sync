import { NavigationEnhanced } from '@/components/navigation-enhanced';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sample user data - replace with actual auth state
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  };

  return (
    <>
      <NavigationEnhanced user={user} />
      <main className="pt-16">
        {children}
      </main>
    </>
  );
}