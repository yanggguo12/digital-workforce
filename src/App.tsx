import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { HomeModule } from './components/modules/Home/HomeModule';
import { SupplyChainDashboard } from './components/modules/SupplyChain/SupplyChainDashboard';
import { FinanceDashboard } from './components/modules/Finance/FinanceDashboard';
import { SalesOrderModule } from './components/modules/SalesOrder/SalesOrderModule';
import { OrdersModule } from './components/modules/Orders/OrdersModule';
import { MailAutomationModule } from './components/modules/Mail/MailAutomationModule';
import { LogsModule } from './components/modules/Logs/LogsModule';
import { LLMConfig } from './components/modules/Config/LLMConfig';
import { ConfigModule } from './components/modules/Config/ConfigModule';
import { SystemModule } from './components/modules/System/SystemModule';
import { UsersModule } from './components/modules/UsersModule';
import SalesEntryModule from './components/modules/Sales/SalesEntryModule';
import SalesInquiryModule from './components/modules/Sales/SalesInquiryModule';
import SalesCreditModule from './components/modules/Sales/SalesCreditModule';
import SalesProspectingModule from './components/modules/Sales/SalesProspectingModule';
import SalesOperationsModule from './components/modules/Sales/SalesOperationsModule';
import { ModuleType } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import { LoginPage } from './components/auth/LoginPage';
import { User } from 'firebase/auth';
import { AIChat } from './components/ui/AIChat';
import { ModelProvider } from './contexts/ModelContext';

import { TabBar, TabData } from './components/layout/TabBar';

const MODULE_TITLES: Record<string, string> = {
  'home': '首页',
  'sales': '智能营销',
  'sales-entry': 'AI 智能录单中心',
  'sales-credit': 'AI 智能信用与准入',
  'sales-inquiry': 'AI 智能查询助手',
  'sales-prospecting': 'AI 潜客拓客与营销',
  'sales-operations': 'AI 销售运营与协作',
  'sales-orders': '合同管理中心',
  'sales-contract': '文档/图片上传',
  'sales-email': 'AI 邮件自动化', 
  'supply-chain': '智能供应链',
  'sc-health': 'AI 智能主数据治理',
  'sc-procurement': 'AI 智能采购决策',
  'sc-outsourcing': 'AI 智能委外协同',
  'sc-inventory': 'AI 智能库存大脑',
  'sc-logistics': 'AI 智能物流雷达',
  'sc-supplier': 'AI 智能供应商云',
  'sc-forecast': 'AI 智能需求预测',
  'sc-manufacturing': 'AI 智能智造中心',
  'finance': '智能财务',
  'fin-email': 'AI 电子邮件审计',
  'fin-receivable': 'AI 智能应收风控',
  'fin-payable': 'AI 智能应付校验',
  'fin-reimbursement': 'AI 智能费用管理',
  'fin-cashflow': 'AI 智能资金头寸',
  'fin-analysis': 'AI 智能经营洞察',
  'fin-closing': 'AI 智能自动月结',
  'fin-budget': 'AI 智能预算控制',
  'fin-assets': 'AI 智能资产管理',
  'fin-tax': 'AI 智能税务合规',
  'logs': '日志监控与管理',
  'logs-operations': '全域业务操作监控',
  'logs-ai': 'AI 调用监控与成本统计',
  'config': '配置中心',
  'config-llm': '大模型配置',
  'config-interfaces': '接口配置与管理',
  'config-monitor': '接口执行状况监控',
  'config-general': '常规设置',
  'system': '系统管理',
  'sys-user': '用户管理',
  'sys-biz-user': '业务用户',
  'sys-role': '角色管理',
  'sys-org': '组织管理',
  'sys-menu': '菜单管理',
  'sys-data-auth': '数据权限管理',
};

export default function App() {
  const [tabs, setTabs] = useState<TabData[]>([{ id: 'home', module: 'home', title: '首页' }]);
  const [activeTabId, setActiveTabId] = useState<string>('home');

  const [salesOrdersTab, setSalesOrdersTab] = useState<string>("全部条目");
  const [inputSource, setInputSource] = useState<'Upload' | 'Email' | 'Voice'>('Upload');
  const [resumeDraftData, setResumeDraftData] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Expose setInputSource to window for component access if needed
  useEffect(() => {
    (window as any).setInputSource = setInputSource;

    // Handle Auth
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const handleModuleChange = (module: ModuleType, payload?: any) => {
    if (module === 'sales-orders' && payload?.tab) {
      setSalesOrdersTab(payload.tab);
    } else if (module === 'sales-orders' && !payload) {
      setSalesOrdersTab("全部条目");
    }

    // Tab logic
    const existingTab = tabs.find(t => t.id === module);
    if (existingTab) {
      if (payload) {
        setTabs(currentTabs => currentTabs.map(t => 
          t.id === module ? { ...t, payload } : t
        ));
      }
      setActiveTabId(module);
    } else {
      const title = MODULE_TITLES[module] || module;
      const newTab = { id: module, module, title, payload };
      setTabs(currentTabs => [...currentTabs, newTab]);
      setActiveTabId(module);
    }

    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleCloseTab = (id: string) => {
    setTabs(currentTabs => {
      const newTabs = currentTabs.filter(t => t.id !== id);
      if (activeTabId === id && newTabs.length > 0) {
        // Find index of the closed tab in old array to select the neighboring tab appropriately
        const closedIndex = currentTabs.findIndex(t => t.id === id);
        const nextActiveIndex = closedIndex > 0 ? closedIndex - 1 : 0;
        setActiveTabId(newTabs[nextActiveIndex].id);
      }
      return newTabs;
    });
  };

  const handleResumeDraft = (data: any) => {
    setResumeDraftData(data);
    handleModuleChange('sales-entry');
  };

  const renderModuleNode = (tab: TabData) => {
    const mod = tab.module;
    switch (mod) {
      case 'home':
        return <HomeModule onNavigate={handleModuleChange} />;
      case 'sales-entry':
        return <SalesEntryModule 
                 initialData={resumeDraftData} 
                 onClearInitial={() => setResumeDraftData(null)}
                 onViewOrders={(viewTab?: string) => handleModuleChange('sales-orders', { tab: viewTab })} 
                 onResumeDraft={handleResumeDraft}
                 onNavigate={handleModuleChange}
               />;
      case 'sales-contract':
        return <SalesOrderModule 
                 inputSource="Upload" 
                 initialData={resumeDraftData} 
                 onClearInitial={() => setResumeDraftData(null)} 
                 onViewOrders={(viewTab?: string) => handleModuleChange('sales-orders', { tab: viewTab })} 
               />;
      case 'sales-inquiry':
        return <SalesInquiryModule />;
      case 'sales-credit':
        return <SalesCreditModule />;
      case 'sales-prospecting':
        return <SalesProspectingModule />;
      case 'sales-operations':
        return <SalesOperationsModule />
      case 'sales-orders':
        return <OrdersModule 
                 onResumeDraft={handleResumeDraft} 
                 initialTab={salesOrdersTab}
               />;
      case 'sales-email':
        return <MailAutomationModule onNavigate={handleModuleChange} />;
      case 'supply-chain':
      case 'sc-health':
      case 'sc-procurement':
      case 'sc-outsourcing':
      case 'sc-inventory':
      case 'sc-logistics':
      case 'sc-supplier':
      case 'sc-forecast':
      case 'sc-manufacturing':
        return <SupplyChainDashboard onNavigate={handleModuleChange} activeSubModule={mod} />;

      case 'finance':
      case 'fin-email':
      case 'fin-receivable':
      case 'fin-payable':
      case 'fin-reimbursement':
      case 'fin-cashflow':
      case 'fin-analysis':
      case 'fin-closing':
      case 'fin-budget':
      case 'fin-assets':
      case 'fin-tax':
        return <FinanceDashboard onNavigate={handleModuleChange} activeSubModule={mod} />;
      case 'logs':
      case 'logs-operations':
      case 'logs-ai':
        return <LogsModule activeSubModule={mod} />;
      case 'config-llm':
        return <LLMConfig />;
      case 'config-interfaces':
      case 'config-monitor':
        return <ConfigModule activeSubModule={mod} />;
      case 'system':
      case 'sys-user':
      case 'sys-biz-user':
      case 'sys-role':
      case 'sys-org':
      case 'sys-menu':
      case 'sys-data-auth':
        return <SystemModule activeSubModule={mod} />;
      case 'users':
        return <UsersModule />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center bg-white p-6 md:p-12 overflow-hidden h-full">
            <div className="max-w-md w-full text-center">
              <div className="w-20 h-20 bg-sap-blue/5 rounded-3xl flex items-center justify-center text-sap-blue mx-auto mb-8 animate-bounce">
                <span className="text-4xl">⚙️</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-sap-gray-900 mb-4 tracking-tight">
                模块正在开发中
              </h2>
              <p className="text-sm md:text-base text-gray-500 mb-8 font-medium">
                该模块目前正在建立与 SAP 后台分析服务的通信数据映射。
                请稍后查看实时同步情况。
              </p>
              <button 
                onClick={() => {
                  if (mod.startsWith('sc-')) handleModuleChange('supply-chain');
                  else if (mod.startsWith('fin-')) handleModuleChange('finance');
                  else handleModuleChange('home');
                }}
                className="px-8 py-3 bg-sap-gray-900 text-white font-bold rounded-2xl hover:bg-sap-blue transition-all active:scale-95"
              >
                返回驾驶舱中心
              </button>
            </div>
          </div>
        );
    }
  };

  const handleMockLogin = (username: string) => {
    const mockUser = {
      uid: 'admin-mock-id',
      displayName: '管理员',
      email: 'admin@sap-erp.digital',
      photoURL: null,
    } as any;
    setUser(mockUser);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Firebase logout failed:", e);
    } finally {
      setUser(null);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="fixed inset-0 z-[100] bg-sap-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full mx-auto mb-4" />
          <p className="text-sm font-medium tracking-wide">正在同步 SAP 身份校验...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleMockLogin} />;
  }

  return (
    <ModelProvider>
      <div className="flex h-screen w-full overflow-hidden selection:bg-sap-blue/20">
        {/* Sidebar - Collapsible */}
        <Sidebar 
          activeModule={activeTabId as ModuleType} 
          setActiveModule={handleModuleChange} 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
        />

        {/* Backdrop for mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-sap-gray-900/60 backdrop-blur-sm z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#f0f2f5] overflow-hidden relative">
          <Header 
            activeModule={activeTabId as ModuleType} 
            inputSource={inputSource} 
            setInputSource={setInputSource} 
            user={user}
            onLogout={handleLogout}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />

          <TabBar 
            tabs={tabs} 
            setTabs={setTabs} 
            activeTabId={activeTabId} 
            setActiveTabId={setActiveTabId} 
            closeTab={handleCloseTab} 
          />

          <div className="flex-1 flex flex-col relative w-full overflow-hidden bg-white">
            {/* 
              Multi-Tab Engine: render ALL tabs to keep their state alive.
              Use CSS standard display:none to hide them but keep alive.
              To avoid display:none causing layout calculations issues in rare charts,
              visibility/width 0 can be an alternative, but display:none is standard.
              With absolute inset-0 we make sure it overlays and takes full space.
            */}
            {tabs.map(tab => (
              <div
                key={tab.id}
                className="absolute inset-0 flex flex-col overflow-hidden"
                style={{
                  display: activeTabId === tab.id ? 'flex' : 'none',
                  transform: 'translate(0, 0)' // creates containing block for fixed positioning
                }}
              >
                {/* 
                  Instead of AnimatePresence here, we just render the node. 
                  Animations run on mount but since Keep-Alive is active, they only run once.
                */}
                <div className="flex-1 w-full h-full flex flex-col relative !overflow-auto">
                  {renderModuleNode(tab)}
                </div>
              </div>
            ))}
          </div>
        </main>

        <AIChat user={user} onNavigate={handleModuleChange} />
      </div>
    </ModelProvider>
  );
}
