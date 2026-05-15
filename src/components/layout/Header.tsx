import React from 'react';
import { 
  Bell, 
  Search, 
  Cpu, 
  Activity,
  User,
  ExternalLink,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ModuleType } from '@/src/types';
import { User as FirebaseUser, signOut } from 'firebase/auth';
import { auth } from '@/src/lib/firebase';
import { useModel } from '@/src/contexts/ModelContext';

interface HeaderProps {
  activeModule: ModuleType;
  inputSource: 'Upload' | 'Email' | 'Voice';
  setInputSource: (source: 'Upload' | 'Email' | 'Voice') => void;
  user: FirebaseUser | null;
  onLogout: () => void;
  toggleSidebar?: () => void;
}

export function Header({ activeModule, inputSource, setInputSource, user, onLogout, toggleSidebar }: HeaderProps) {
  const { defaultProvider, activeModel } = useModel();
  
  const getModuleName = () => {
    if (activeModule === 'supply-chain' || activeModule.startsWith('sc-')) return '智能供应链模块';
    if (activeModule === 'finance' || activeModule.startsWith('fin-')) return '智能财务模块';
    
    switch(activeModule) {
      case 'home': return '首页控制台';
      case 'sales': return '销售业务模块';
      case 'sales-contract': return '文档/图片上传';
      case 'sales-orders': return '合同管理中心';
      case 'sales-email': return '邮件自动化中心';
      case 'sales-voice': return '语言指令中心';
      case 'production': return '生产与制造模块';
      case 'procurement': return '采购与供应模块';
      case 'logs': return '自动化执行日志';
      case 'config': return '系统配置中心';
      case 'users': return '用户与权限管理';
      default: return 'AI 数字员工系统';
    }
  };

  return (
    <header className="h-[48px] bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 relative z-40 shrink-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden w-8 h-8 rounded border border-[#E2E8F0] flex items-center justify-center text-sap-gray-900 shadow-sm hover:bg-gray-50"
        >
          <Menu size={16} />
        </button>

        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-bold text-sap-gray-900 tracking-tight leading-tight truncate">{getModuleName()}</h2>
          </div>
        </div>


      </div>

      <div className="flex items-center gap-3 shrink-0 ml-4">
        <button className="hidden sm:flex w-8 h-8 rounded border border-[#E2E8F0] items-center justify-center text-gray-400 hover:text-sap-blue transition-all relative group bg-white shadow-sm">
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
        </button>

        <div className="hidden sm:block w-[1px] h-4 bg-[#E2E8F0] mx-1" />

        <button 
          onClick={onLogout}
          title="退出登录"
          className="flex items-center gap-2 group bg-white px-2 py-1 rounded border border-[#E2E8F0] hover:bg-red-50 hover:border-red-200 transition-all shadow-sm text-gray-500 hover:text-red-500"
        >
          <div className="flex flex-col items-end leading-none hidden md:flex justify-center">
            <span className="text-[12px] font-bold text-sap-gray-900 group-hover:text-red-600 uppercase tracking-tight">
              {user?.displayName || (user?.email?.split('@')[0]) || '管理员'}
            </span>
          </div>
          <div className="w-6 h-6 rounded bg-sap-blue/10 flex items-center justify-center text-sap-blue group-hover:bg-red-500 group-hover:text-white transition-all overflow-hidden font-bold text-[10px] uppercase shrink-0">
            {user?.displayName?.[0] || '管'}
          </div>
          <div className="flex items-center gap-1 pl-1 ml-1 border-l border-gray-200 group-hover:border-red-200 transition-colors">
             <LogOut size={14} />
             <span className="text-[11px] font-bold uppercase tracking-tight">退出</span>
          </div>
        </button>
      </div>
    </header>
  );
}
