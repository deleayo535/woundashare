
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Upload, 
  Clipboard, 
  ClipboardList, 
  UserCog,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type SidebarProps = {
  open: boolean;
  toggleSidebar: () => void;
};

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick?: () => void;
};

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, active, onClick }) => {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={cn(
        "flex items-center px-4 py-2.5 rounded-md mb-1 transition-all duration-200",
        active ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
      )}
    >
      <Icon className={cn("mr-3 h-5 w-5", active ? "text-primary-foreground" : "text-muted-foreground")} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ open, toggleSidebar }) => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const closeSidebarIfMobile = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };
  
  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}
      
      <aside 
        className={cn(
          "bg-sidebar dark:bg-sidebar h-[calc(100vh-4rem)] z-30",
          "border-r border-sidebar-border transition-all duration-300 ease-in-out",
          "w-64 pb-4 flex flex-col", 
          isMobile ? "fixed top-16 left-0" : "sticky top-0",
          open ? "translate-x-0" : (isMobile ? "-translate-x-full" : "w-0 opacity-0")
        )}
      >
        <div className="px-4 py-2 flex justify-between items-center">
          <h2 className="font-semibold text-lg">Navigation</h2>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleSidebar}
              className="hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="px-3 py-2 flex-1 overflow-y-auto">
          <div className="space-y-1">
            <NavItem 
              to="/dashboard" 
              icon={Home} 
              label="Dashboard" 
              active={isActive("/dashboard")}
              onClick={closeSidebarIfMobile}
            />
            <NavItem 
              to="/upload-report" 
              icon={Upload} 
              label="Upload Report" 
              active={isActive("/upload-report")}
              onClick={closeSidebarIfMobile}
            />
            <NavItem 
              to="/my-reports" 
              icon={Clipboard} 
              label="My Reports" 
              active={isActive("/my-reports")}
              onClick={closeSidebarIfMobile}
            />
          </div>
          
          {isAdmin && (
            <>
              <Separator className="my-4" />
              <p className="px-4 text-xs font-semibold text-muted-foreground mb-2">
                ADMIN
              </p>
              <div className="space-y-1">
                <NavItem 
                  to="/admin" 
                  icon={ClipboardList} 
                  label="All Reports" 
                  active={isActive("/admin")}
                  onClick={closeSidebarIfMobile}
                />
                <NavItem 
                  to="/admin/users" 
                  icon={UserCog} 
                  label="Manage Users" 
                  active={isActive("/admin/users")}
                  onClick={closeSidebarIfMobile}
                />
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
