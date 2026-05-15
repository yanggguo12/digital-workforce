import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  Trash2, 
  Search, 
  ChevronDown, 
  Filter, 
  Settings2,
  Lock,
  Globe,
  Users,
  Building,
  CheckCircle2,
  AlertCircle,
  Code
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '../../../ui/Button';

// Mock Data
const dataRules = [
  { id: '1', name: '销售数据行权限', target: '销售订单', desc: '限制销售员仅能看到自己负责的客户订单', status: 'active', logic: 'OWNER_ID = CURRENT_USER_ID' },
  { id: '2', name: '部门财务查看', target: '财务凭证', desc: '各部门主管仅能查看本部门及下属部门的财务流水', status: 'active', logic: 'DEPT_ID IN (CHILD_DEPTS(CURRENT_USER_DEPT))' },
  { id: '3', name: '供应商敏感信息', target: '供应商主数据', desc: '隐藏供应商银行账号、联系人电话', status: 'debug', logic: 'MASK(bank_account, "******")' },
];

export function DataAuthManagement() {
  const [activeRuleId, setActiveRuleId] = useState('1');

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 flex items-center justify-between shrink-0 bg-white/40 backdrop-blur-md border-b border-white/20">
        <div>
          <h1 className="text-lg font-bold text-sap-gray-900 tracking-tight font-display flex items-center gap-2">
            <Lock className="text-sap-blue" size={20} />
            <span>数据权限管理</span>
          </h1>
          <p className="text-gray-500 text-[12px] mt-0.5">配置“行级”或“列级”数据过滤规则，实现多维度组织隔离与业务安全。</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} className="py-1 shadow-none rounded">新建过滤规则</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Rules List */}
        <div className="w-[350px] shrink-0 bg-white/60 backdrop-blur-md rounded-xl border border-white/40 shadow-xl shadow-gray-200/50 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="text-[12px] font-bold text-gray-700">权限过滤规则库</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-2">
            {dataRules.map(rule => (
              <div 
                key={rule.id}
                onClick={() => setActiveRuleId(rule.id)}
                className={cn(
                  "p-4 rounded-xl border transition-all cursor-pointer group relative overflow-hidden",
                  activeRuleId === rule.id 
                    ? "bg-white border-sap-blue shadow-lg scale-[1.02]" 
                    : "bg-white/40 border-transparent hover:border-gray-200"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", rule.status === 'active' ? "bg-sap-success" : "bg-amber-400")} />
                    <span className="text-[13px] font-bold text-sap-gray-900">{rule.name}</span>
                  </div>
                  <Settings2 size={14} className="text-gray-300 group-hover:text-sap-blue transition-colors" />
                </div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Database size={12} className="text-sap-blue" />
                  <span className="text-[11px] text-sap-blue font-bold">{rule.target}</span>
                </div>
                <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{rule.desc}</p>
                {activeRuleId === rule.id && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-sap-blue" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Configuration Panel */}
        <div className="flex-1 bg-white/60 backdrop-blur-md rounded-xl border border-white/40 shadow-xl shadow-gray-200/50 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-white/80 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-sap-blue/10 p-2.5 rounded-xl text-sap-blue shadow-inner">
                <Filter size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-sap-gray-900">条件配置面板</h2>
                <p className="text-[11px] text-gray-400">正在配置: <span className="text-sap-blue font-bold font-mono">SO_ROW_LEVEL_SECURITY</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 font-bold text-[11px] rounded-lg hover:bg-gray-50 transition-all text-xs">
                  <Code size={14} />
                  <span>SQL 预览</span>
               </button>
               <Button variant="primary" size="sm" className="rounded-lg shadow-sm">应用更改</Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-8 custom-scrollbar">
            <div className="max-w-3xl space-y-8">
              {/* Target Data Source Section */}
              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Database size={14} />
                  数据对象范围
                </h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-xl border-2 border-sap-blue/20 bg-sap-blue/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Building size={18} className="text-sap-blue" />
                         <div>
                            <p className="text-[13px] font-bold text-sap-gray-900">所属组织</p>
                            <p className="text-[11px] text-gray-500">仅限当前登录人所在集团</p>
                         </div>
                      </div>
                      <CheckCircle2 size={18} className="text-sap-blue" />
                   </div>
                   <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center justify-between opacity-60">
                      <div className="flex items-center gap-3">
                         <Globe size={18} className="text-gray-400" />
                         <div>
                            <p className="text-[13px] font-bold text-gray-400">跨公司协作</p>
                            <p className="text-[11px] text-gray-400">支持全域数据读取</p>
                         </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border border-gray-200" />
                   </div>
                </div>
              </section>

              {/* Logical Rules Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Filter size={14} />
                    逻辑过滤规则 (条件嵌套)
                  </h3>
                  <button className="text-[11px] text-sap-blue font-bold flex items-center gap-1 hover:underline">
                    <Plus size={12} /> 添加条件组
                  </button>
                </div>
                
                <div className="p-6 rounded-2xl bg-gray-50/80 border border-gray-200 space-y-4 relative">
                   <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-sap-blue/20" />
                   
                   {/* Condition Row 1 */}
                   <div className="flex items-center gap-3 pl-6 relative">
                      <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-4 h-0.5 bg-sap-blue/20" />
                      <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 w-36 text-[12px] font-medium flex items-center justify-between">
                         <span>所属部门</span>
                         <ChevronDown size={14} className="text-gray-400" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 w-24 text-[12px] font-bold text-sap-blue flex items-center justify-between">
                         <span>属于</span>
                         <ChevronDown size={14} className="text-gray-400" />
                      </div>
                      <div className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] font-medium flex items-center justify-between shadow-inner">
                         <span>当前用户所属部门及下属所有层级</span>
                         <Building size={14} className="text-gray-400" />
                      </div>
                      <button className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                   </div>

                   <div className="ml-6 py-1 px-4 bg-sap-blue text-white text-[10px] font-bold w-fit rounded-md tracking-widest">AND</div>

                   {/* Condition Row 2 */}
                   <div className="flex items-center gap-3 pl-6 relative">
                      <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-4 h-0.5 bg-sap-blue/20" />
                      <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 w-36 text-[12px] font-medium flex items-center justify-between">
                         <span>销售阶段</span>
                         <ChevronDown size={14} className="text-gray-400" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 w-24 text-[12px] font-bold text-sap-blue flex items-center justify-between">
                         <span>不等于</span>
                         <ChevronDown size={14} className="text-gray-400" />
                      </div>
                      <div className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] font-medium flex items-center justify-between shadow-inner">
                         <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold text-[10px]">作废 / 终止</span>
                         <ChevronDown size={14} className="text-gray-400" />
                      </div>
                      <button className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                   </div>
                </div>
              </section>

              {/* Security Hint */}
              <div className="p-4 rounded-xl bg-sap-blue/5 border border-sap-blue/10 flex items-start gap-3">
                 <AlertCircle size={18} className="text-sap-blue shrink-0 mt-0.5" />
                 <div>
                    <p className="text-[12px] font-bold text-sap-gray-900">安全提示：大数据集权限扫描</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                       当前配置涉及 <span className="font-bold underline text-sap-blue">递归子部门查询</span>，
                       在大规模组织架构（10,000+ 节点）下可能会导致 ERP 查询执行缓慢。
                       建议结合 <span className="font-bold italic">索引优化策略</span> 使用。
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
