import { MainLayout } from '@/components/Layout/MainLayout';

const ActivitiesLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <MainLayout>{children}</MainLayout>;
};

export default ActivitiesLayout;
