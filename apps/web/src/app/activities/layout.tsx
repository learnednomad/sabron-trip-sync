import { MainLayout } from '@/components/Layout/MainLayout';

export default function ActivitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
