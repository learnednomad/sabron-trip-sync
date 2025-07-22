import { MainLayout } from '@/components/Layout/MainLayout';

const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <MainLayout>{children}</MainLayout>;
};

export default DashboardLayout;
