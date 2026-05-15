import React from 'react';
import { ModuleType } from '@/src/types';
import { UserManagement } from './components/UserManagement';
import { BusinessUserManagement } from './components/BusinessUserManagement';
import { RoleManagement } from './components/RoleManagement';
import { OrgManagement } from './components/OrgManagement';
import { MenuManagement } from './components/MenuManagement';
import { DataAuthManagement } from './components/DataAuthManagement';

interface SystemModuleProps {
  activeSubModule: ModuleType;
}

export function SystemModule({ activeSubModule }: SystemModuleProps) {
  const renderContent = () => {
    switch (activeSubModule) {
      case 'sys-user':
        return <UserManagement />;
      case 'sys-biz-user':
        return <BusinessUserManagement />;
      case 'sys-role':
        return <RoleManagement />;
      case 'sys-org':
        return <OrgManagement />;
      case 'sys-menu':
        return <MenuManagement />;
      case 'sys-data-auth':
        return <DataAuthManagement />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F1F5F9] overflow-hidden">
      {renderContent()}
    </div>
  );
}
