import { Outlet } from 'react-router-dom';
import { TopNavbar } from './TopNavbar';
import { AppSidebar } from './AppSidebar';
import { RoleSwitcher } from './RoleSwitcher';

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      <RoleSwitcher />
    </div>
  );
};
