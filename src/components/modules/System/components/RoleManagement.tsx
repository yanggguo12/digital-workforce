import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Plus, 
  Search, 
  Copy, 
  Trash2, 
  Save, 
  ChevronRight, 
  ChevronDown,
  Layout,
  FileText,
  Settings,
  Database,
  CheckSquare,
  Square
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '../../../ui/Button';

// Mock Data
const mockRoles = [
  { id: 'r1', name: '系统管理员', code: 'SYS_ADMIN', description: '拥有系统所有操作权限', count: 2 },
  { id: 'r2', name: '财务审核员', code: 'FIN_AUDITOR', description: '负责财务单据审核及报表查看', count: 5 },
  { id: 'r3', name: '营销主管', code: 'MKT_DIRECTOR', description: '管理营销计划及潜客资源', count: 3 },
  { id: 'r4', name: '普通员工', code: 'USER', description: '业务日常操作权限', count: 45 },
];

const menuPermissions = [
  { id: 'm1', label: '智能营销', children: [
    { id: 'm1-1', label: 'AI 智能录单中心' },
    { id: 'm1-2', label: 'AI 智能信用管理' },
    { id: 'm1-3', label: 'AI 销售运营' },
  ]},
  { id: 'm2', label: '智能供应链', children: [
    { id: 'm2-1', label: 'AI 主数据治理' },
    { id: 'm2-2', label: 'AI 智能库存大脑' },
    { id: 'm2-3', label: 'AI 物流雷达' },
  ]},
  { id: 'm3', label: '系统管理', children: [
    { id: 'm3-1', label: '用户管理' },
    { id: 'm3-2', label: '角色管理' },
    { id: 'm3-3', label: '菜单管理' },
  ]},
];

export function RoleManagement() {
  const [activeRoleId, setActiveRoleId] = useState('r1');
  const [checkedIds, setCheckedIds] = useState<string[]>(['m1', 'm1-1', 'm1-2', 'm3', 'm3-2']);

  const toggleCheck = (id: string) => {
    setCheckedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const renderPermissionTree = (items: any[]) => {
    return items.map(item => (
      <div key={item.id} className="ml-6 mt-2">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => toggleCheck(item.id)}
        >
          <div className="text-sap-blue">
            {checkedIds.includes(item.id) ? <CheckSquare size={16} /> : <Square size={16} className="text-gray-300" />}
          </div>
          <span className={cn("text-[13px] transition-colors", checkedIds.includes(item.id) ? "text-sap-gray-900 font-bold" : "text-gray-500 group-hover:text-gray-700")}>
            {item.label}
          </span>
        </div>
        {item.children && (
          <div className="border-l border-gray-100 ml-2 mt-1">
            {renderPermissionTree(item.children)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 flex items-center justify-between shrink-0 bg-white/40 backdrop-blur-md border-b border-white/20">
        <div>
          <h1 className="text-lg font-bold text-sap-gray-900 tracking-tight font-display flex items-center gap-2">
            <ShieldAlert className="text-sap-blue" size={20} />
            <span>角色管理</span>
          </h1>
          <p className="text-gray-500 text-[12px] mt-0.5">定义权限组，并将功能权限（菜单、按钮）分配给不同的角色。</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" leftIcon={<Save size={14} />} className="py-1 shadow-none rounded">保存权限配置</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Role List */}
        <div className="w-[300px] shrink-0 bg-white/60 backdrop-blur-md rounded-xl border border-white/40 shadow-xl shadow-gray-200/50 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="text-[12px] font-bold text-gray-700">角色列表</span>
            <button className="p-1 hover:bg-sap-blue/10 rounded text-sap-blue" title="新增角色"><Plus size={14} /></button>
          </div>
          <div className="p-2 border-b border-gray-50 bg-white/40">
            <div className="bg-white rounded border border-gray-200 flex items-center px-2 py-1 focus-within:border-sap-blue transition-all">
              <Search size={14} className="text-gray-400 mr-2 shrink-0" />
              <input type="text" placeholder="搜索角色..." className="bg-transparent border-none outline-none text-[12px] w-full" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
            {mockRoles.map(role => (
              <div 
                key={role.id}
                onClick={() => setActiveRoleId(role.id)}
                className={cn(
                  "p-3 rounded-lg border transition-all cursor-pointer group relative",
                  activeRoleId === role.id 
                    ? "bg-sap-blue/5 border-sap-blue/20 shadow-sm" 
                    : "bg-white/40 border-transparent hover:border-gray-200"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={cn("text-[13px] font-bold", activeRoleId === role.id ? "text-sap-blue" : "text-sap-gray-900")}>
                    {role.name}
                  </span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono uppercase">{role.code}</span>
                </div>
                <p className="text-[11px] text-gray-400 line-clamp-1">{role.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">用户数: <span className="text-sap-gray-900 font-bold">{role.count}</span></span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-gray-400 hover:text-sap-blue" title="克隆角色"><Copy size={12} /></button>
                    <button className="text-gray-400 hover:text-rose-600" title="删除角色"><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Permission Tree */}
        <div className="flex-1 bg-white/60 backdrop-blur-md rounded-xl border border-white/40 shadow-xl shadow-gray-200/50 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-gray-700">功能权限配置</span>
              <span className="bg-sap-blue/10 text-sap-blue text-[10px] px-2 py-0.5 rounded font-bold">
                正在编辑: {mockRoles.find(r => r.id === activeRoleId)?.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-[11px] text-sap-blue hover:underline font-bold" onClick={() => setCheckedIds([])}>全不选</button>
              <button className="text-[11px] text-sap-blue hover:underline font-bold" onClick={() => setCheckedIds(['m1', 'm1-1', 'm1-2', 'm1-3', 'm2', 'm2-1', 'm2-2', 'm2-3', 'm3', 'm3-1', 'm3-2', 'm3-3'])}>全选</button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6 custom-scrollbar">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-sap-blue/10 p-2 rounded-lg text-sap-blue">
                  <Layout size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-sap-gray-900">菜单权限</h3>
                  <p className="text-[11px] text-gray-400">勾选左侧菜单即可完成页面级赋权。</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {renderPermissionTree(menuPermissions)}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 border border-emerald-100">
                    <Database size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-sap-gray-900">按钮级操作权限</h3>
                    <p className="text-[11px] text-gray-400">细化到新增、修改、删除、导出等敏感操作。</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 ml-6">
                  {['新增数据', '修改记录', '删除记录', '重置密码', '导出报表', '导入数据'].map(btn => (
                    <div key={btn} className="flex items-center gap-2 cursor-pointer group" onClick={() => toggleCheck(`btn-${btn}`)}>
                      <div className="text-emerald-600">
                        {checkedIds.includes(`btn-${btn}`) ? <CheckSquare size={16} /> : <Square size={16} className="text-gray-300" />}
                      </div>
                      <span className="text-[12px] text-gray-600 font-medium">{btn}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
