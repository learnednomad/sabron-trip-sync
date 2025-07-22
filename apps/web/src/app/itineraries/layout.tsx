import { MainLayout } from '@/components/Layout/MainLayout';

const ItinerariesLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <MainLayout>{children}</MainLayout>;
};

export default ItinerariesLayout;
