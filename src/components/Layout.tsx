
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent
} from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const Layout: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen bg-background flex flex-col w-full">
        <Header />
        <div className="flex-1 flex w-full">
          <AppSidebar />
          <main className="flex-1 transition-all duration-300 ease-in-out p-6">
            <div className="max-w-7xl mx-auto animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
