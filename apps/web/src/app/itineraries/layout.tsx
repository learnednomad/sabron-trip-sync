import { MainLayout } from '@/components/Layout/MainLayout';

export default function ItinerariesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
