import React from 'react';
import { 
  Activity, ShoppingBag, FileText, Package, Truck, Building, TrendingUp, Cpu,
  ChevronRight, AlertCircle, ArrowLeft
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ModuleType } from '@/src/types';
import { motion } from 'motion/react';
import { scTilesData, scModuleTitles } from './SupplyChainData';

interface SupplyChainDashboardProps {
  onNavigate: (module: ModuleType) => void;
  activeSubModule?: string;
}

const defaultModules = [
  { id: 'sc-health', title: 'AI 智能主数据治理', desc: '基于 AI 的物料编码合规性诊断、描述治理与单位标准化校验', icon: Activity, color: 'text-rose-500', bgColor: 'bg-rose-50', borderColor: 'border-rose-100', badge: '12项风险' },
  { id: 'sc-procurement', title: 'AI 智能采购决策', desc: '基于安全库存水位的自动补货建议、供应商交付得分与多维询价对比', icon: ShoppingBag, color: 'text-sap-blue', bgColor: 'bg-sap-blue/10', borderColor: 'border-sap-blue/20' },
  { id: 'sc-outsourcing', title: 'AI 智能委外协同', desc: '委外工单加工进度实时热力图、材料超耗预警与自动对账辅助', icon: FileText, color: 'text-amber-500', bgColor: 'bg-amber-50', borderColor: 'border-amber-100', badge: '3 项预警' },
  { id: 'sc-inventory', title: 'AI 智能库存大脑', desc: '全渠道实时库存动态看板、跨库智能调拨建议与库龄分布深度分析', icon: Package, color: 'text-emerald-500', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-100' },
  { id: 'sc-logistics', title: 'AI 智能物流雷达', desc: '在途物资实时轨迹监控、异常路由警报与承运商成本效能分析', icon: Truck, color: 'text-indigo-500', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-100', badge: '2 异常路由' },
  { id: 'sc-supplier', title: 'AI 智能供应商云', desc: '供应商绩效全景画像、合同 AI 智能审核与电子对账协同平台', icon: Building, color: 'text-violet-500', bgColor: 'bg-violet-50', borderColor: 'border-violet-100' },
  { id: 'sc-forecast', title: 'AI 智能需求预测', desc: '结合季节性销量特征的需求预测引擎、动态安全库存调整模型', icon: TrendingUp, color: 'text-cyan-500', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-100' },
  { id: 'sc-manufacturing', title: 'AI 智能智造中心', desc: '生产排程优先级优先级可视化驾驶舱、设备 OEE 实时运行状态监控', icon: Cpu, color: 'text-fuchsia-500', bgColor: 'bg-fuchsia-50', borderColor: 'border-fuchsia-100' }
];

export function SupplyChainDashboard({ onNavigate, activeSubModule }: SupplyChainDashboardProps) {
  const isOverview = !activeSubModule || activeSubModule === 'supply-chain';
  const currentLevelTiles = isOverview ? defaultModules : scTilesData[activeSubModule as string] || [];
  const currentTitleInfo = isOverview 
    ? { title: 'AI 智能供应链驾驶舱', desc: '基于 AI 的全局统筹物料健康度、采购决策分析、委外自动化协同与全链路库存状态监控平台。' }
    : scModuleTitles[activeSubModule as string] || { title: activeSubModule, desc: '模块详情' };

  const handleBack = () => {
    onNavigate('supply-chain');
  };

  return (
    <div className="h-full flex flex-col p-3 overflow-y-auto w-full bg-[#F1F5F9] custom-scrollbar">
      <div className="mb-3 flex items-start justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
             {!isOverview && (
              <button 
                onClick={handleBack}
                className="p-1 pr-2 bg-white border border-[#E2E8F0] rounded-[2px] hover:bg-gray-50 transition-colors text-gray-600 flex items-center gap-1 shadow-none"
              >
                <ArrowLeft size={12} /><span className="text-[12px] font-bold">返回驾驶舱</span>
              </button>
            )}
            <div className="px-2 py-0.5 bg-sap-blue/5 text-sap-blue text-[10px] font-bold rounded-[2px] flex items-center gap-1.5 uppercase tracking-widest border border-sap-blue/10">
               <div className="w-1.5 h-1.5 rounded-full bg-sap-blue" /> SCM AI Co-Pilot Active
            </div>
          </div>
          <h1 className="text-[14px] font-bold text-sap-gray-900 tracking-tight leading-tight">{currentTitleInfo.title}</h1>
          <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{currentTitleInfo.desc}</p>
        </div>
        
        {isOverview && (
          <button 
            onClick={() => onNavigate('home')}
            className="px-3 h-[32px] bg-white border border-[#E2E8F0] text-sap-gray-900 font-bold rounded-[2px] hover:bg-gray-50 transition-colors text-[12px] shadow-none shrink-0"
          >
            返回工作台
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pb-3">
        {currentLevelTiles.map((mod, idx) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: idx * 0.03 }}
            onClick={() => isOverview ? onNavigate(mod.id as ModuleType) : null}
            whileHover={{ y: -4 }}
            className={cn(
               "group relative bg-white border border-[#E2E8F0] rounded-[2px] p-3 transition-all duration-200 flex flex-col h-[154px]",
               isOverview ? "cursor-pointer hover:border-sap-blue/40" : "cursor-default"
            )}
          >
            <div className="flex items-start gap-2.5 mb-auto">
              <div className={cn("w-7 h-7 rounded-[2px] flex items-center justify-center shrink-0 border", mod.bgColor, mod.color, mod.borderColor)}>
                <mod.icon size={14} />
              </div>
              <h3 className="text-[13px] font-bold text-sap-gray-900 leading-snug line-clamp-2 transition-colors group-hover:text-sap-blue">
                {mod.title}
              </h3>
            </div>
            
            <div className="flex flex-col justify-center my-2 items-start">
               <div className="flex items-baseline gap-1.5">
                 <span className="text-[20px] font-display font-medium text-sap-gray-900 tracking-tight leading-none">
                   {isOverview ? (mod.id === 'sc-health' ? '92%' : mod.id === 'sc-inventory' ? '8.4M' : '15') : (mod.chartValue || (90 + idx))}
                 </span>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                   {isOverview ? (mod.id === 'sc-health' ? '健康度' : mod.id === 'sc-procurement' ? '条待办' : '实时指标') : (mod.badge || '项已就绪')}
                 </span>
               </div>
            </div>
            
            <div className="mt-auto pt-2 border-t border-[#E2E8F0]">
               <p className="text-[11px] text-gray-500 font-medium leading-normal line-clamp-2">
                 {mod.desc}
               </p>
            </div>

            <div className="absolute top-3 right-3 text-sap-blue opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-1 h-1 rounded-full bg-sap-blue" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
