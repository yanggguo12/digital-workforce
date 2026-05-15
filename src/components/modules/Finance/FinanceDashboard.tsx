import React from 'react';
import { 
  Inbox, Receipt, CreditCard, Wallet, LineChart, PieChart, Calendar, BarChart, Landmark, FileQuestion,
  ChevronRight, AlertCircle, ArrowLeft
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ModuleType } from '@/src/types';
import { motion } from 'motion/react';
import { finTilesData, finModuleTitles } from './FinanceData';

interface FinanceDashboardProps {
  onNavigate: (module: ModuleType) => void;
  activeSubModule?: string;
}

const defaultModules = [
  { id: 'fin-email', title: 'AI 电子邮件审计', desc: '基于 NLP 的邮件订单自动录入、附件深度解析与白名单规则审计', icon: Inbox, color: 'text-rose-500', bgColor: 'bg-rose-50', borderColor: 'border-rose-100', badge: '12 封待处理' },
  { id: 'fin-receivable', title: 'AI 智能应收风控', desc: '动态账龄热力图分析、客户回款习惯预测模型与数字化催款追踪', icon: Receipt, color: 'text-amber-500', bgColor: 'bg-amber-50', borderColor: 'border-amber-100' },
  { id: 'fin-payable', title: 'AI 智能应付校验', desc: '供应商发票 AI 真伪验真、采购合同三方匹配自动化与重复支出智能拦截', icon: CreditCard, color: 'text-emerald-500', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-100' },
  { id: 'fin-reimbursement', title: 'AI 智能费用管理', desc: '差旅报销合规性全量自动审计、预算占用实时监控与消费效能报告', icon: Wallet, color: 'text-sap-blue', bgColor: 'bg-sap-blue/10', borderColor: 'border-sap-blue/20' },
  { id: 'fin-cashflow', title: 'AI 智能资金头寸', desc: '全球多币种实时资金看板、现金流流动性缺口预警与融资成本追踪', icon: LineChart, color: 'text-indigo-500', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-100' },
  { id: 'fin-analysis', title: 'AI 智能经营洞察', desc: '多维损益动态看板、行业竞争力对标分析与高管敏捷经营分析报告', icon: PieChart, color: 'text-violet-500', bgColor: 'bg-violet-50', borderColor: 'border-violet-100' },
  { id: 'fin-closing', title: 'AI 智能自动月结', desc: '关账任务全链路进度实时监控、科目自动对冲校验与结账质量审计', icon: Calendar, color: 'text-cyan-500', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-100' },
  { id: 'fin-budget', title: 'AI 智能预算控制', desc: '全年度预算执行率动态预警、超支权限智能熔断与部门资源精准划拨', icon: BarChart, color: 'text-fuchsia-500', bgColor: 'bg-fuchsia-50', borderColor: 'border-fuchsia-100' },
  { id: 'fin-assets', title: 'AI 智能资产管理', desc: '固定资产全生命周期状态监控、自动折旧明细生成与数字化移动盘点', icon: Landmark, color: 'text-teal-500', bgColor: 'bg-teal-50', borderColor: 'border-teal-100' },
  { id: 'fin-tax', title: 'AI 智能税务合规', desc: '销项票自动开具推送、进项票智能抵扣引擎与税务合规评分建模', icon: FileQuestion, color: 'text-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-100', badge: '稽查预警' }
];

export function FinanceDashboard({ onNavigate, activeSubModule }: FinanceDashboardProps) {
  const isOverview = !activeSubModule || activeSubModule === 'finance';
  const currentLevelTiles = isOverview ? defaultModules : finTilesData[activeSubModule as string] || [];
  const currentTitleInfo = isOverview 
    ? { title: 'AI 智能财务驾驶舱', desc: '基于 AI 的端到端自动化核算引擎、全时控制塔预警与全局财务经营指标深度洞见分析平台。' }
    : finModuleTitles[activeSubModule as string] || { title: activeSubModule, desc: '模块详情' };

  const handleBack = () => {
    onNavigate('finance');
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
               <div className="w-1.5 h-1.5 rounded-full bg-sap-blue" /> FIN AI CORE ONLINE
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
                   {isOverview ? (mod.id === 'fin-email' ? '12' : mod.id === 'fin-budget' ? '82%' : 'Active') : (mod.chartValue || (85 + idx))}
                 </span>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                   {isOverview ? (mod.id === 'fin-email' ? '封待处理' : mod.id === 'fin-budget' ? '执行率' : '状态') : (mod.badge || '项已通过')}
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
