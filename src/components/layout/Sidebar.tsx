import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Home,
  Briefcase,
  Factory,
  ShoppingBag,
  Wallet,
  History, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Bot,
  BrainCircuit,
  Cpu,
  Library,
  FileText,
  Mail,
  Mic2,
  Users,
  FilePlus,
  Search,
  ShieldAlert,
  LineChart,
  Activity,
  Package,
  Truck,
  Building,
  TrendingUp,
  Cpu as CpuIcon,
  Inbox,
  CreditCard,
  PieChart,
  BarChart,
  Calendar,
  Landmark,
  FileQuestion,
  Receipt,
  Link2,
  Monitor,
  Network
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ModuleType } from '@/src/types';

interface SidebarProps {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface MenuItem {
  id: ModuleType;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
  subItems?: { id: ModuleType; label: string; icon: React.ElementType; disabled?: boolean }[];
}

const menuItems: MenuItem[] = [
  { id: 'home', label: '首页', icon: Home },
  { 
    id: 'sales', 
    label: '智能营销', 
    icon: Briefcase,
    subItems: [
      { id: 'sales-entry', label: 'AI 智能录单中心', icon: FilePlus },
      { id: 'sales-credit', label: 'AI 智能信用与准入', icon: ShieldAlert },
      { id: 'sales-inquiry', label: 'AI 智能查询助手', icon: Search },
      { id: 'sales-prospecting', label: 'AI 潜客拓客与营销', icon: LineChart },
      { id: 'sales-operations', label: 'AI 销售运营与协作', icon: Users },
    ]
  },
  { 
    id: 'supply-chain', 
    label: '智能供应链', 
    icon: Factory,
    subItems: [
      { id: 'sc-health', label: 'AI 智能主数据治理', icon: Activity },
      { id: 'sc-procurement', label: 'AI 智能采购决策', icon: ShoppingBag },
      { id: 'sc-outsourcing', label: 'AI 智能委外协同', icon: FileText },
      { id: 'sc-inventory', label: 'AI 智能库存大脑', icon: Package },
      { id: 'sc-logistics', label: 'AI 智能物流雷达', icon: Truck },
      { id: 'sc-supplier', label: 'AI 智能供应商云', icon: Building },
      { id: 'sc-forecast', label: 'AI 智能需求预测', icon: TrendingUp },
      { id: 'sc-manufacturing', label: 'AI 智能智造中心', icon: CpuIcon },
    ]
  },
  { 
    id: 'finance', 
    label: '智能财务', 
    icon: Wallet,
    subItems: [
      { id: 'fin-email', label: 'AI 电子邮件审计', icon: Inbox },
      { id: 'fin-receivable', label: 'AI 智能应收风控', icon: Receipt },
      { id: 'fin-payable', label: 'AI 智能应付校验', icon: CreditCard },
      { id: 'fin-reimbursement', label: 'AI 智能费用管理', icon: Wallet },
      { id: 'fin-cashflow', label: 'AI 智能资金头寸', icon: LineChart },
      { id: 'fin-analysis', label: 'AI 智能经营洞察', icon: PieChart },
      { id: 'fin-closing', label: 'AI 智能自动月结', icon: Calendar },
      { id: 'fin-budget', label: 'AI 智能预算控制', icon: BarChart },
      { id: 'fin-assets', label: 'AI 智能资产管理', icon: Landmark },
      { id: 'fin-tax', label: 'AI 智能税务合规', icon: FileQuestion },
    ]
  },
  { 
    id: 'logs', 
    label: '日志监控与管理', 
    icon: History,
    subItems: [
      { id: 'logs-operations', label: '全域业务操作监控', icon: Activity },
      { id: 'logs-ai', label: 'AI 调用监控与成本统计', icon: Bot },
    ]
  },
  { 
    id: 'config', 
    label: '配置中心', 
    icon: Settings,
    subItems: [
      { id: 'config-llm', label: '大模型配置', icon: Bot },
      { id: 'config-interfaces', label: '接口配置与管理', icon: Link2 },
      { id: 'config-monitor', label: '接口执行状况监控', icon: Monitor },
      { id: 'config-general', label: '常规设置', icon: Settings, disabled: true },
    ]
  },
  { 
    id: 'system', 
    label: '系统管理', 
    icon: Settings,
    subItems: [
      { id: 'sys-user', label: '用户管理', icon: Users },
      { id: 'sys-biz-user', label: '业务用户', icon: Users },
      { id: 'sys-role', label: '角色管理', icon: ShieldAlert },
      { id: 'sys-org', label: '组织管理', icon: Network },
      { id: 'sys-menu', label: '菜单管理', icon: Link2 },
      { id: 'sys-data-auth', label: '数据权限管理', icon: Search },
    ]
  },
];

export function Sidebar({ activeModule, setActiveModule, isOpen, setIsOpen }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['sales']);

  const toggleExpand = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? [] : [id]
    );
  };

  const isSubMenuActive = (item: MenuItem) => {
    return item.subItems?.some(sub => sub.id === activeModule);
  };

  return (
    <div 
      className={cn(
        "h-[100vh] bg-sap-gray-900 border-r border-[#E2E8F0] flex flex-col flex-shrink-0 transition-all duration-300 fixed lg:sticky top-0 z-50",
        isOpen ? "translate-x-0 w-[240px]" : "-translate-x-full lg:translate-x-0",
        collapsed ? "lg:w-[60px]" : "lg:w-[240px]"
      )}
    >
      <div className="h-[48px] flex items-center px-4 shrink-0 bg-sap-gray-900 border-b border-white/10">
        <div className="w-8 h-8 bg-sap-blue rounded flex items-center justify-center shrink-0">
          <BrainCircuit className="text-white w-5 h-5" strokeWidth={2} />
        </div>
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden whitespace-nowrap ml-3"
          >
            <h1 className="font-display font-bold text-[14px] text-white tracking-tight leading-tight">AI数字员工</h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide">企业智能化数据引擎</p>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 px-2 py-3 overflow-y-auto custom-scrollbar no-scrollbar text-[13px]">
        {menuItems.map((item) => {
          const isExpanded = expandedMenus.includes(item.id);
          const hasSubItems = !!item.subItems;
          const isActive = activeModule === item.id || isSubMenuActive(item);

          return (
            <div key={item.id} className="mb-0.5">
              <button
                onClick={() => {
                  if (hasSubItems && !collapsed) {
                     toggleExpand(item.id);
                  } else {
                     setActiveModule(item.id);
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-2 py-2 rounded transition-colors group relative text-left outline-none",
                  (activeModule === item.id && !hasSubItems) || (isActive && hasSubItems && collapsed)
                    ? "bg-sap-blue text-white" 
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                )}
                title={collapsed ? item.label : ""}
              >
                <item.icon className={cn("w-[18px] h-[18px] shrink-0", isActive ? "text-white" : "group-hover:text-sap-blue")} />
                {!collapsed && (
                  <>
                    <span className="font-medium truncate flex-1">{item.label}</span>
                    {hasSubItems && (
                      <div className="opacity-50">
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </div>
                    )}
                  </>
                )}
              </button>

              {/* Sub Items */}
              {hasSubItems && isExpanded && !collapsed && (
                <div className="mt-0.5 space-y-0.5 pl-7 pr-2">
                  {item.subItems?.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveModule(sub.id)}
                      className={cn(
                        "w-full flex items-center gap-2 py-1.5 px-2 rounded text-[12px] transition-colors group text-left",
                        activeModule === sub.id 
                          ? "bg-white/10 text-white font-bold" 
                          : "text-gray-400 hover:text-gray-200 hover:bg-white/5 font-medium"
                      )}
                    >
                      <sub.icon className={cn("w-3.5 h-3.5", activeModule === sub.id ? "text-white" : "text-gray-500")} />
                      <span className="truncate">{sub.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute bottom-[20px] -right-3 w-6 h-6 bg-white border border-[#E2E8F0] rounded flex lg:flex items-center justify-center text-sap-gray-900 shadow-sm focus:outline-none"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
}
