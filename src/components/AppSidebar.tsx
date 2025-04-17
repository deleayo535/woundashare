
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  Upload, 
  Clipboard, 
  ClipboardList, 
  UserCog,
} from 'lucide-react';
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from '@/components/ui/sidebar';

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const { t } = useTranslation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-3 py-2">
          <h2 className="font-semibold text-lg">Navigation</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard")} tooltip={t('navigation.dashboard')}>
                  <Link to="/dashboard">
                    <Home />
                    <span>{t('navigation.dashboard')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/upload-report")} tooltip={t('navigation.uploadReport')}>
                  <Link to="/upload-report">
                    <Upload />
                    <span>{t('navigation.uploadReport')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/my-reports")} tooltip={t('navigation.myReports')}>
                  <Link to="/my-reports">
                    <Clipboard />
                    <span>{t('navigation.myReports')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/admin")} tooltip={t('navigation.allReports')}>
                    <Link to="/admin">
                      <ClipboardList />
                      <span>{t('navigation.allReports')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/admin/users")} tooltip={t('navigation.manageUsers')}>
                    <Link to="/admin/users">
                      <UserCog />
                      <span>{t('navigation.manageUsers')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <div className="px-3 py-2 text-xs text-muted-foreground">
          {t('app.footer')}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
