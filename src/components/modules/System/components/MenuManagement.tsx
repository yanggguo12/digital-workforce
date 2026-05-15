import React, { useState } from 'react';
import { 
  Link2, 
  Plus, 
  Search, 
  ChevronRight, 
  ChevronDown,
  GripVertical,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Layout,
  ExternalLink,
  Type,
  Hash
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '../../../ui/Button';

// Mock Data
const initialMenus = [
  { id: '1', label: '首页', icon: 'Home', path: '/home', sort: 1, hidden: false, keepAlive: true, children: [] },
  { id: '2', label: '智能营销', icon: 'Briefcase', path: '/sales', sort: 2, hidden: false, keepAlive: false, children: [
    { id: '11', label: 'AI 智能录单中心', icon: 'FilePlus', path: '/sales/entry', sort: 1, hidden: false, keepAlive: true },
    { id: '12', label: 'AI 智能信用管理', icon: 'ShieldAlert', path: '/sales/credit', sort: 2, hidden: false, keepAlive: true },
  ]},
  { id: '3', label: '智能供应链', icon: 'Factory', path: '/sc', sort: 3, hidden: false, keepAlive: false, children: [
    { id: '21', label: 'AI 主数据治理', icon: 'Activity', path: '/sc/health', sort: 1, hidden: false, keepAlive: true },
    { id: '22', label: 'AI 智能库存大脑', icon: 'Package', path: '/sc/inventory', sort: 2, hidden: false, keepAlive: true },
  ]},
  { id: '4', label: '系统管理', icon: 'Settings', path: '/system', sort: 4, hidden: false, keepAlive: false, children: [
    { id: '31', label: '用户管理', icon: 'Users', path: '/system/user', sort: 1, hidden: false, keepAlive: true },
    { id: '32', label: '角色管理', icon: 'ShieldAlert', path: '/system/role', sort: 2, hidden: false, keepAlive: true },
  ]},
];

export function MenuManagement() {
  const [expandedIds, setExpandedIds] = useState<string[]>(['2', '3', '4']);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const renderRows = (items: any[], level = 0) => {
    return items.map(item => (
      <React.Fragment key={item.id}>
        <tr className="hover:bg-sap-blue/[0.01] transition-colors h-[40px] group border-b border-gray-50">
          <td className="px-4">
            <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 20}px` }}>
              <div className="text-gray-400 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={14} />
              </div>
              {item.children && item.children.length > 0 ? (
                <div onClick={() => toggleExpand(item.id)} className="cursor-pointer text-gray-500 hover:text-sap-blue">
                  {expandedIds.includes(item.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
              ) : <div className="w-3.5" />}
              <span className="text-[13px] font-bold text-sap-gray-900">{item.label}</span>
            </div>
          </td>
          <td className="px-4">
            <div className="flex items-center gap-2 text-gray-400">
               <span className="text-[11px] font-mono bg-gray-50 px-1 py-0.5 rounded border border-gray-100">{item.icon}</span>
            </div>
          </td>
          <td className="px-4">
            <div className="flex items-center gap-1.5 overflow-hidden">
               <span className="text-[11px] font-mono text-gray-500 truncate">{item.path}</span>
               <ExternalLink size={10} className="text-gray-300" />
            </div>
          </td>
          <td className="px-4">
            <span className="text-[11px] font-mono text-gray-400">{item.sort}</span>
          </td>
          <td className="px-4 text-center">
            {item.hidden ? (
              <span className="bg-gray-100 text-gray-400 text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1 justify-center w-fit mx-auto">
                <EyeOff size={10} /> 隐藏
              </span>
            ) : (
              <span className="bg-emerald-50 text-emerald-600 text-[10px] px-1.5 py-0.5 rounded border border-emerald-100 font-bold flex items-center gap-1 justify-center w-fit mx-auto">
                <Eye size={10} /> 显示
              </span>
            )}
          </td>
          <td className="px-4 text-center">
             <div className={cn(
               "w-3 h-3 rounded-full mx-auto border-2",
               item.keepAlive ? "bg-sap-blue border-sap-blue/20" : "bg-transparent border-gray-200"
             )} />
          </td>
          <td className="px-4 text-right">
             <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 hover:bg-sap-blue/10 rounded text-sap-blue" title="编辑"><Edit2 size={14} /></button>
                <button className="p-1 hover:bg-sap-blue/5 rounded text-sap-blue" title="添加下级"><Plus size={14} /></button>
                <button className="p-1 hover:bg-rose-50 rounded text-rose-500" title="删除"><Trash2 size={14} /></button>
             </div>
          </td>
        </tr>
        {item.children && item.children.length > 0 && expandedIds.includes(item.id) && renderRows(item.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 flex items-center justify-between shrink-0 bg-white/40 backdrop-blur-md border-b border-white/20">
        <div>
          <h1 className="text-lg font-bold text-sap-gray-900 tracking-tight font-display flex items-center gap-2">
            <Link2 className="text-sap-blue" size={20} />
            <span>菜单管理</span>
          </h1>
          <p className="text-gray-500 text-[12px] mt-0.5">动态配置系统左侧菜单及顶栏页签，支持拖拽排序及 Keep-Alive 策略。</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} className="py-1 shadow-none rounded">新增主菜单</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="bg-white/60 backdrop-blur-md rounded-xl border border-white/40 shadow-xl shadow-gray-200/50 flex flex-col h-full overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
             <div className="bg-white/80 rounded border border-gray-200 flex items-center px-2 py-1 focus-within:border-sap-blue transition-all w-[300px]">
                <Search size={14} className="text-gray-400 mr-2 shrink-0" />
                <input type="text" placeholder="搜索菜单名称、路径..." className="bg-transparent border-none outline-none text-[12px] w-full" />
             </div>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-sap-blue" />
                   <span className="text-[11px] text-gray-500">Keep-Alive 启用</span>
                </div>
                <button className="text-[11px] text-sap-blue font-bold hover:underline" onClick={() => setExpandedIds([])}>折叠全部</button>
             </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-sap-blue/[0.03] border-b border-[#F0F0F0] text-[11px] text-gray-500 font-bold uppercase tracking-tight h-10">
                  <th className="px-4 w-[300px]">菜单名称</th>
                  <th className="px-4 w-[150px]">图标</th>
                  <th className="px-4 w-[200px]">组件路径 / Path</th>
                  <th className="px-4 w-[80px]">排序</th>
                  <th className="px-4 w-[120px] text-center">可见性</th>
                  <th className="px-4 w-[120px] text-center">状态保持</th>
                  <th className="px-4 w-[150px] text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {renderRows(initialMenus)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
