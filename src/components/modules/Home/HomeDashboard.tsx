import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  ShoppingCart, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Cpu, 
  Database,
  ArrowUpRight,
  Activity,
  Box,
  Truck,
  CreditCard,
  PieChart,
  AlertCircle,
  Package,
  Clock,
  Library,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

// --- Sub-components for the Dashboard ---

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
  onClick?: () => void;
}

const DashboardCard = React.memo(({ title, subtitle, icon: Icon, children, className, accentColor = "text-sap-blue", onClick }: DashboardCardProps) => (
  <motion.div 
    onClick={onClick}
    whileHover={{ y: -4 }}
    className={cn(
    "bg-white border border-[#E2E8F0] rounded p-4 shadow-sm flex flex-col h-full group transition-all hover:border-sap-blue/40 relative overflow-hidden",
    onClick ? "cursor-pointer active:scale-[0.99]" : "",
    className
  )}>
    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundImage: `linear-gradient(to right, transparent, currentColor, transparent)`, color: 'var(--tw-shadow-color, rgba(0,102,255,0.4))' }} />
    <div className="flex items-start justify-between mb-4 shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded bg-gray-50 group-hover:bg-white transition-colors border border-gray-100", accentColor.replace('text-', 'bg-').replace('-blue', '-blue/10').replace('-green', '-green/10').replace('-amber', '-amber/10').replace('-teal', '-teal/10').replace('-indigo', '-indigo/10'))}>
           <Icon size={16} strokeWidth={2} className={accentColor} />
        </div>
        <div className="flex flex-col">
          <h4 className="text-[14px] font-bold text-sap-gray-900 tracking-tight">{title}</h4>
          {subtitle && <div className="text-[11px] text-gray-500 font-medium mt-0.5">{subtitle}</div>}
        </div>
      </div>
      {onClick && <div className="hidden sm:flex items-center gap-1 bg-gray-50 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all border border-gray-100">
        <span className="text-[10px] font-bold text-sap-blue">进入模块</span>
        <ChevronRight size={12} className="text-sap-blue" />
      </div>}
    </div>
    <div className="flex flex-col flex-1 h-full w-full min-h-0 z-10 justify-between">
      {children}
    </div>
  </motion.div>
));

DashboardCard.displayName = 'DashboardCard';

const AICoreStatus = () => (
  <div className="relative w-full flex flex-col items-center justify-center py-4 text-center h-full">
    <div className="relative mb-6 mt-2 flex items-center justify-center w-24 h-24 mx-auto select-none">
      <motion.div 
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-sap-blue blur-2xl z-0"
      />
      
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-10%] rounded-full border-[1px] border-dashed border-sap-blue/30 z-0"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-2%] rounded-full border border-sap-blue/20 z-0"
      />
      
      <div className="absolute inset-0 flex items-center justify-center z-10 w-full h-full">
        <div className="w-12 h-12 bg-gradient-to-tr from-sap-blue to-[#4080ff] rounded-[10px] rotate-3 flex items-center justify-center shadow-lg shadow-sap-blue/40 overflow-hidden relative border border-white/20">
           <motion.div 
             animate={{ rotate: -3 }}
             className="z-10 bg-white/10 p-2 rounded backdrop-blur-md shadow-inner border border-white/20"
           >
             <Cpu size={24} className="text-white drop-shadow-md" strokeWidth={1.5} />
           </motion.div>
           <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 -rotate-45 -translate-x-[150%] animate-[shimmer_3s_infinite]" />
        </div>
      </div>
    </div>
    
    <div className="w-full px-4 mt-auto flex flex-col items-center pb-2">
      <h3 className="text-[12px] font-bold text-sap-gray-900 tracking-[2px] mb-4 uppercase">数字大脑引擎状态</h3>
      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-2.5 flex flex-col items-center shadow-sm">
          <span className="text-[9px] text-gray-500 font-bold mb-1 uppercase tracking-wider">并发负载</span>
          <span className="text-[16px] font-mono font-black text-sap-blue tracking-tight">14.2%</span>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100 rounded p-2.5 flex flex-col items-center shadow-sm">
          <span className="text-[9px] text-emerald-600/80 font-bold mb-1 uppercase tracking-wider">算力健康度</span>
          <span className="text-[16px] font-mono font-black text-emerald-600 tracking-tight">99.9%</span>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Dashboard Component ---

export const HomeDashboard = ({ onNavigate }: { onNavigate?: (module: any) => void }) => {
  const [processedCount, setProcessedCount] = useState(1248);
  const [revenue, setRevenue] = useState(2840000);
  const [isUpdateFlash, setIsUpdateFlash] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setProcessedCount(prev => prev + 1);
      setRevenue(prev => prev + Math.floor(Math.random() * 50000 + 1000));
      setIsUpdateFlash(true);
      setTimeout(() => setIsUpdateFlash(false), 2000);
    };
    
    window.addEventListener('demoOrdersUpdated', handleUpdate);
    return () => window.removeEventListener('demoOrdersUpdated', handleUpdate);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden w-full bg-[#F1F5F9] p-4 lg:p-6 custom-scrollbar relative">
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="relative z-10">
      
      <div className="w-full mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-4 w-full">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded flex items-center gap-1.5 uppercase tracking-widest border border-emerald-100 shadow-sm">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 实时系统运行中
              </div>
              <span className="text-gray-400 text-[11px] font-mono font-medium tracking-wide">节点标识: AI-NODE-CORE-[1F]</span>
            </div>
            <h1 className="text-[20px] font-bold text-sap-gray-900 tracking-tight flex items-center gap-2">
              数字全链路资产管理台
            </h1>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 w-full">
            <div className="p-4 bg-white border border-[#E2E8F0] rounded shadow-sm hover:border-sap-blue/40 transition-colors relative overflow-hidden">
               <div className="absolute -right-2 -top-2 text-sap-blue/5">
                 <Package size={60} strokeWidth={1} />
               </div>
               <div className="relative z-10">
                 <div className="text-[12px] text-gray-500 font-bold mb-2 flex items-center gap-2">
                   <div className="w-1 h-3 bg-sap-blue rounded-full" />
                   <span className="truncate">今日处理引擎批次</span>
                 </div>
                 <div className="flex flex-wrap items-center gap-2">
                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={processedCount}
                        initial={{ opacity: 0, y: -2 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn("text-[20px] font-mono font-bold tracking-tighter", isUpdateFlash ? "text-sap-blue" : "text-sap-gray-900")}
                      >
                        {processedCount?.toLocaleString() ?? '0'}
                      </motion.span>
                    </AnimatePresence>
                    <div className="flex items-center text-emerald-600 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                       <TrendingUp size={12} className="mr-0.5" /> +12%
                    </div>
                 </div>
               </div>
            </div>
            <div className="p-4 bg-white border border-[#E2E8F0] rounded shadow-sm hover:border-emerald-500/40 transition-colors relative overflow-hidden">
               <div className="absolute -right-2 -top-2 text-emerald-500/5">
                 <BarChart3 size={60} strokeWidth={1} />
               </div>
               <div className="relative z-10">
                 <div className="text-[12px] text-gray-500 font-bold mb-2 flex items-center gap-2">
                   <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                   <span className="truncate">本月资产增值流水</span>
                 </div>
                 <div className="flex flex-wrap items-center gap-2">
                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={revenue}
                        initial={{ opacity: 0, y: -2 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn("text-[20px] font-mono font-bold tracking-tighter", isUpdateFlash ? "text-emerald-500" : "text-sap-gray-900")}
                      >
                        ¥{(revenue / 10000).toFixed(1)}W
                      </motion.span>
                    </AnimatePresence>
                    <div className="flex items-center text-emerald-600 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                       <ArrowUpRight size={12} className="mr-0.5" /> +2.4%
                    </div>
                 </div>
               </div>
            </div>
            <div className="p-4 bg-white border border-[#E2E8F0] rounded shadow-sm hover:border-amber-500/40 transition-colors relative overflow-hidden">
               <div className="absolute -right-2 -top-2 text-amber-500/5">
                 <Box size={60} strokeWidth={1} />
               </div>
               <div className="relative z-10">
                 <div className="text-[12px] text-gray-500 font-bold mb-2 flex items-center gap-2">
                   <div className="w-1 h-3 bg-amber-500 rounded-full" />
                   <span className="truncate">智能资源拨配合格率</span>
                 </div>
                 <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[20px] font-mono font-bold tracking-tighter text-sap-gray-900">
                      96.4<span className="text-[12px] ml-0.5 text-gray-400 font-sans">%</span>
                    </span>
                    <div className="flex items-center text-amber-700 font-bold text-[10px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                       <Activity size={12} className="mr-0.5" /> 状态极佳
                    </div>
                 </div>
               </div>
            </div>
            <div className="p-4 bg-white border border-[#E2E8F0] rounded shadow-sm hover:border-indigo-500/40 transition-colors relative overflow-hidden">
               <div className="absolute -right-2 -top-2 text-indigo-500/5">
                 <ShieldCheck size={60} strokeWidth={1} />
               </div>
               <div className="relative z-10">
                 <div className="text-[12px] text-gray-500 font-bold mb-2 flex items-center gap-2">
                   <div className="w-1 h-3 bg-indigo-500 rounded-full" />
                   <span className="truncate">AI安全预警风控拦截</span>
                 </div>
                 <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[20px] font-mono font-bold tracking-tighter text-sap-gray-900">
                      142<span className="text-[11px] font-sans font-bold text-gray-400 ml-1">次</span>
                    </span>
                    <div className="flex items-center text-indigo-700 font-bold text-[10px] bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                       <ShieldCheck size={12} className="mr-0.5" /> 防护中
                    </div>
                 </div>
               </div>
            </div>
            <div className="p-4 bg-white border border-[#E2E8F0] rounded shadow-sm hover:border-slate-500/40 transition-colors relative overflow-hidden hidden lg:block">
               <div className="absolute -right-2 -top-2 text-slate-500/5">
                 <Clock size={60} strokeWidth={1} />
               </div>
               <div className="relative z-10">
                 <div className="text-[12px] text-gray-500 font-bold mb-2 flex items-center gap-2">
                   <div className="w-1 h-3 bg-slate-400 rounded-full" />
                   <span className="truncate">主干节点时间</span>
                 </div>
                 <div className="flex flex-col justify-center">
                    <span className="text-[18px] font-mono font-bold tracking-tighter text-sap-gray-900 leading-tight">
                      2026-04-30
                    </span>
                    <span className="text-[14px] font-mono font-bold tracking-tighter text-sap-gray-900/60 leading-tight">
                      10:32:15
                    </span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 核心布局网格: 12列分配, 左侧8列，右侧4列 */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        
        {/* 左侧核心业务区 (8/12) */}
        <div className="col-span-1 xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
           <DashboardCard 
             title="智能营销引擎" 
             subtitle="全渠道获客与客户生命周期"
             icon={Globe}
             onClick={() => onNavigate?.('sales-orders')}
           >
             <div className="flex flex-col flex-1 justify-between gap-4 pt-3">
                <div>
                  <div className="flex flex-wrap items-baseline gap-2 mb-4">
                    <span className="text-[24px] font-black text-sap-gray-900 tracking-tighter">1,248<span className="text-[12px] text-gray-500 font-bold ml-1">条</span></span>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                      <TrendingUp size={12} className="mr-1" /> 转化率 +8.4%
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-3 hover:bg-white transition-colors">
                        <div className="text-[11px] text-sap-blue font-bold mb-1.5">本周新增商机 (Leads)</div>
                        <div className="flex items-baseline gap-2">
                          <AnimatePresence mode="wait">
                            <motion.div 
                              key={processedCount}
                              initial={{ scale: 1.05, color: '#0070f2' }}
                              animate={{ scale: 1, color: '#32363a' }}
                              className="text-[16px] font-mono font-black tracking-tight"
                            >
                              {processedCount?.toLocaleString() ?? '0'}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                     </div>
                     <div className="bg-rose-50 border border-rose-100 rounded p-3 hover:bg-rose-100/50 transition-colors">
                        <div className="text-[11px] text-rose-600 font-bold mb-1.5">流失风险预警客户</div>
                        <div className="text-[16px] font-mono font-black text-rose-600 tracking-tight">12 <span className="text-[10px] font-sans font-bold text-rose-500/70 ml-0.5">家</span></div>
                     </div>
                  </div>
                </div>

                <div className="mt-auto bg-[#F8FAFC] px-4 py-3 rounded border border-[#E2E8F0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-500">客户获客渠道实时占比</span>
                    <span className="text-[10px] font-bold text-sap-blue bg-blue-50 px-1.5 py-0.5 rounded">本月动态</span>
                  </div>
                  <div className="flex h-2 gap-0.5 rounded-full overflow-hidden w-full">
                    <div className="w-[50%] bg-sap-blue hover:opacity-90 transition-opacity" title="线下推广 50%" />
                    <div className="w-[25%] bg-indigo-400 hover:opacity-90 transition-opacity" title="社媒矩阵 25%" />
                    <div className="w-[25%] bg-teal-400 hover:opacity-90 transition-opacity" title="搜索投放 25%" />
                  </div>
                  <div className="flex gap-4 mt-2 justify-start sm:justify-center">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-sap-blue" />
                      <span className="text-[10px] font-bold text-gray-500">线下推广</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span className="text-[10px] font-bold text-gray-500">社媒矩阵</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      <span className="text-[10px] font-bold text-gray-500">搜索投放</span>
                    </div>
                  </div>
                </div>
             </div>
           </DashboardCard>

           <DashboardCard 
             title="智能供应链" 
             subtitle="全链路库存与物流监控"
             icon={Box}
             accentColor="text-amber-500"
             onClick={() => onNavigate?.('sales-inquiry')}
           >
             <div className="flex flex-col flex-1 justify-between gap-4 pt-4">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-[24px] font-black text-sap-gray-900 tracking-tighter">94.2%</span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">订单齐套率</span>
                </div>

                <div className="flex flex-col gap-4 mt-auto">
                   <div className="flex flex-col gap-2 w-full bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-gray-500">安全库存水位 (Buffer)</span>
                      <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">85.4%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '85.4%' }} 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" 
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 border border-emerald-100 rounded p-3">
                      <p className="text-[11px] text-emerald-600 font-bold mb-1">物流达成率</p>
                      <p className="text-[16px] font-mono font-black text-emerald-700">98.2%</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded p-3">
                      <p className="text-[11px] text-amber-600 font-bold mb-1">缺货风险预警</p>
                      <p className="text-[16px] font-bold text-amber-700 tracking-tight">2 <span className="text-[11px] font-normal">项</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2 bg-white rounded border border-[#E2E8F0]">
                    <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                    <span className="text-[11px] font-bold text-gray-500">SAP 物料同步: <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">健康</span></span>
                  </div>
                </div>
             </div>
           </DashboardCard>

           <DashboardCard 
             title="智能财务与风险" 
             subtitle="自动化审计与风险授信"
             icon={CreditCard}
             accentColor="text-indigo-500"
             onClick={() => onNavigate?.('sales-credit')}
           >
             <div className="flex flex-col flex-1 justify-between gap-4 pt-4">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[24px] font-black text-sap-gray-900 tracking-tighter">99.8%</span>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">AI 凭证预审</span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-500">自动核销精准度</p>
                  </div>
                  
                  <div className="bg-[#F8FAFC] rounded p-3 border border-[#E2E8F0] flex items-center justify-between shadow-sm">
                    <p className="text-[11px] text-gray-500 font-bold">今日合规均账笔数</p>
                    <p className="text-[16px] font-mono font-black text-sap-gray-900">2,841</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-auto">
                  <div className="bg-indigo-50/50 rounded border border-indigo-100 p-4 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded bg-indigo-500 flex items-center justify-center text-white shadow-sm">
                        <AlertCircle size={20} />
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-indigo-500 font-black uppercase tracking-widest mb-1">全局授信预警</p>
                        <p className="text-[16px] font-black text-indigo-700 tracking-tight">健康 (12项低危)</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-bold text-sap-gray-900">信贷风险分布热力图</p>
                        <span className="text-[9px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded">Real-time</span>
                      </div>
                      <div className="flex gap-1 h-4">
                        {[0.2, 0.4, 0.1, 0.3, 0.8, 0.2, 0.4, 0.1].map((o, i) => (
                           <div key={i} className="flex-1 bg-indigo-500 rounded-sm hover:opacity-100 transition-opacity cursor-pointer" style={{ opacity: o }} title={`区域 ${i+1} 风险系数`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
             </div>
           </DashboardCard>

           <DashboardCard 
             title="数字员工执行状态" 
             subtitle="AI 服务群组实时动态"
             icon={Cpu}
             accentColor="text-teal-500"
             onClick={() => onNavigate?.('sales-email')}
           >
             <div className="flex flex-col h-full mt-3 flex-1 min-h-[260px] relative overflow-hidden bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                <div className="absolute top-0 right-0 h-8 w-full bg-gradient-to-b from-[#F8FAFC] to-transparent z-10 pointer-events-none" />
                <div className="absolute bottom-0 right-0 h-8 w-full bg-gradient-to-t from-[#F8FAFC] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div 
                    className="space-y-2 p-3 w-full"
                    animate={{ y: ["0%", "-50%"] }}
                    transition={{ 
                      duration: 20, 
                      repeat: Infinity, 
                      ease: "linear"
                    }}
                  >
                    {[ 
                      { name: '财务对账机器人', status: '正在抓取网银流水', color: 'emerald', tag: '运行中' },
                      { name: '采购比价机器人', status: '生成 12 份询价报告', color: 'sap-blue', tag: '已完成' },
                      { name: '客服意图识别AI', status: '成功拦截客诉风险', color: 'emerald', tag: '守护中' },
                      { name: '订单录入 RPA', status: '解析 PDF 合同 3份', color: 'sap-blue', tag: '已完成' },
                      { name: '库存预警机器人', status: '正在轮询各仓储节点', color: 'amber', tag: '轮询中' },
                      { name: '信贷授信评估AI', status: '完成 45 家客户背调', color: 'sap-blue', tag: '已完成' },
                      { name: '智能客服中枢', status: '接待排队中 12 人', color: 'emerald', tag: '运行中' },
                      { name: '财务对账机器人', status: '正在抓取网银流水', color: 'emerald', tag: '运行中' },
                      { name: '采购比价机器人', status: '生成 12 份询价报告', color: 'sap-blue', tag: '已完成' },
                      { name: '客服意图识别AI', status: '成功拦截客诉风险', color: 'emerald', tag: '守护中' },
                      { name: '订单录入 RPA', status: '解析 PDF 合同 3份', color: 'sap-blue', tag: '已完成' },
                      { name: '库存预警机器人', status: '正在轮询各仓储节点', color: 'amber', tag: '轮询中' },
                      { name: '信贷授信评估AI', status: '完成 45 家客户背调', color: 'sap-blue', tag: '已完成' },
                      { name: '智能客服中枢', status: '接待排队中 12 人', color: 'emerald', tag: '运行中' }
                    ].map((bot, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-white border border-[#E2E8F0] rounded hover:border-sap-blue/40 transition-all shadow-sm gap-2">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full shrink-0", bot.color === 'emerald' ? "bg-emerald-500 animate-pulse shadow-sm" : bot.color === 'sap-blue' ? "bg-sap-blue" : "bg-amber-500 animate-pulse")} />
                          <div className="flex flex-col">
                            <p className="text-[12px] font-bold text-sap-gray-900 leading-tight">{bot.name}</p>
                            <p className="text-[10px] text-gray-500 truncate mt-0.5" title={bot.status}>{bot.status}</p>
                          </div>
                        </div>
                        <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded uppercase w-fit whitespace-nowrap", bot.color === 'emerald' ? "bg-emerald-50 border border-emerald-100 text-emerald-600" : bot.color === 'sap-blue' ? "bg-blue-50 border border-blue-100 text-sap-blue" : "bg-amber-50 border border-amber-100 text-amber-600")}>
                          {bot.tag}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </div>
             </div>
           </DashboardCard>
        </div>

        {/* 右侧辅助支撑区 (4/12) */}
        <div className="col-span-1 xl:col-span-4 flex flex-col gap-4 h-full">
           {/* AI 核心卡片 */}
           <div className="bg-white border border-[#E2E8F0] rounded p-6 shadow-sm flex flex-col items-center justify-between min-h-[420px] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-3">
                <Zap size={14} className="text-sap-blue/30" />
             </div>
             
             <AICoreStatus />
             
             <div className="w-full mt-6 space-y-3">
               <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded flex items-center justify-between hover:bg-white hover:shadow-sm transition-all cursor-default">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-sap-blue animate-pulse" />
                   <span className="text-[12px] font-bold text-sap-gray-900">神经逻辑引擎组</span>
                 </div>
                 <span className="px-1.5 py-0.5 border border-sap-blue/20 bg-blue-50 text-[9px] font-mono text-sap-blue font-bold rounded uppercase">Ready</span>
               </div>
               <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded flex items-center justify-between hover:bg-white hover:shadow-sm transition-all cursor-default">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[12px] font-bold text-sap-gray-900">分布式算力阵列</span>
                 </div>
                 <span className="px-1.5 py-0.5 border border-emerald-200 bg-emerald-50 text-[9px] font-mono text-emerald-600 font-bold rounded uppercase">Synced</span>
               </div>
             </div>
           </div>

           {/* 性能监控小卡 */}
           <DashboardCard 
             title="运营活动监控" 
             subtitle="系统实时运行效能"
             icon={Activity}
             accentColor="text-sap-blue"
           >
             <div className="flex flex-col gap-3 mt-2">
                <div className="h-16 flex items-end gap-1 px-1 py-1">
                  {[40, 70, 45, 90, 65, 30, 50, 85, 45, 95, 60, 40].map((h, i) => (
                    <motion.div 
                      key={i} 
                      className="flex-1 bg-sap-blue/30 rounded-t-[1px] hover:bg-sap-blue/60 transition-colors"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.05 }}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center px-1">
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">实时访问流量分析</p>
                   <p className="text-[11px] text-sap-blue font-mono font-bold italic">0.45ms</p>
                </div>
             </div>
           </DashboardCard>
        </div>
      </div>

      {/* 底部系统信息 */}
      <div className="w-full mt-6 flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border border-[#E2E8F0] rounded shadow-sm gap-4">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             <span className="text-[11px] font-bold text-sap-gray-900 tracking-wide">SAP S/4HANA 连接状态: 稳定</span>
          </div>
          <div className="flex items-center gap-2">
             <Database size={14} className="text-gray-500" />
             <span className="text-[11px] font-bold text-sap-gray-900 tracking-wide">核心数据库: 处理中 (1.2k tps)</span>
          </div>
        </div>

        <button className="px-6 py-2 bg-sap-gray-900 text-white rounded text-[12px] font-bold hover:bg-sap-blue transition-all active:scale-95 shadow-sm">
          生成全局运营报告
        </button>
      </div>
      </div>
    </div>
  );
};
