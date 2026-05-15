import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Download, 
  Upload, 
  Key, 
  Lock, 
  ChevronRight, 
  ChevronDown,
  Building2,
  MoreVertical,
  Filter
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '../../../ui/Button';

// Mock Data
const orgTree = [
  { id: '1', name: '总公司', children: [
    { id: '2', name: '行政中心' },
    { id: '3', name: '研发中心', children: [
      { id: '4', name: '后端开发部' },
      { id: '5', name: '前端开发部' },
      { id: '6', name: 'AI 模型组' },
    ]},
    { id: '7', name: '财务部' },
    { id: '8', name: '销售部' },
  ]}
];

const mockUsers = [
  { id: '1', username: 'admin', realName: '超级管理员', dept: '研发中心', role: '系统管理员', status: 'normal', lastLogin: '2026-05-12 14:20' },
  { id: '2', username: 'zhangsan', realName: '张三', dept: '后端开发部', role: '运维人员', status: 'normal', lastLogin: '2026-05-11 10:45' },
  { id: '3', username: 'lisi', realName: '李四', dept: 'AI 模型组', role: '高级架构师', status: 'locked', lastLogin: '2026-05-09 22:30' },
  { id: '4', username: 'wangwu', realName: '王五', dept: '财务部', role: '财务审计', status: 'normal', lastLogin: '2026-05-12 09:12' },
];

export function UserManagement() {
  const [selectedDept, setSelectedDept] = useState('1');
  const [expanded, setExpanded] = useState<string[]>(['1', '3']);

  const toggleExpand = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const renderTree = (items: any[]) => {
    return items.map(item => (
      <div key={item.id} className="ml-4">
        <div 
          className={cn(
            "flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-all text-[13px]",
            selectedDept === item.id ? "bg-sap-blue/10 text-sap-blue font-bold" : "text-gray-600 hover:bg-gray-100"
          )}
          onClick={() => setSelectedDept(item.id)}
        >
          {item.children ? (
            <div onClick={(e) => { e.stopPropagation(); toggleExpand(item.id); }}>
              {expanded.includes(item.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
          ) : <div className="w-3.5" />}
          <Building2 size={14} className={cn(selectedDept === item.id ? "text-sap-blue" : "text-gray-400")} />
          <span className="truncate">{item.name}</span>
        </div>
        {item.children && expanded.includes(item.id) && renderTree(item.children)}
      </div>
    ));
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 flex items-center justify-between shrink-0 bg-white/40 backdrop-blur-md border-b border-white/20">
        <div>
          <h1 className="text-lg font-bold text-sap-gray-900 tracking-tight font-display flex items-center gap-2">
            <Users className="text-sap-blue" size={20} />
            <span>用户管理 (后台账号)</span>
          </h1>
          <p className="text-gray-500 text-[12px] mt-0.5">负责维护公司内部运维、管理员身份及其系统访问权限。</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} className="py-1 shadow-none rounded">新增用户</Button>
          <Button variant="outline" size="sm" leftIcon={<Upload size={14} />} className="py-1 shadow-none rounded bg-white">导入</Button>
          <Button variant="outline" size="sm" leftIcon={<Download size={14} />} className="py-1 shadow-none rounded bg-white">导出</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Tree */}
        <div className="w-[240px] shrink-0 bg-white/60 backdrop-blur-md rounded-xl border border-white/40 shadow-xl shadow-gray-200/50 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
            <Filter size={14} className="text-gray-400" />
            <span className="text-[12px] font-bold text-gray-700">组织架构</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            {renderTree(orgTree)}
          </div>
        </div>

        {/* Right Table */}
        <div className="flex-1 bg-white/60 backdrop-blur-md rounded-xl border border-white/40 shadow-xl shadow-gray-200/50 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="bg-white/80 rounded border border-gray-200 flex items-center px-2 py-1 focus-within:border-sap-blue transition-all w-[300px]">
              <Search size={14} className="text-gray-400 mr-2 shrink-0" />
              <input type="text" placeholder="搜索用户名、真实姓名..." className="bg-transparent border-none outline-none text-[12px] w-full" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-gray-500">部门: <span className="font-bold text-sap-gray-900">研发中心</span></span>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse table-fixed">
              <thead className="sticky top-0 z-10">
                <tr className="bg-sap-blue/[0.03] border-b border-[#F0F0F0] text-[11px] text-gray-500 font-bold uppercase tracking-tight h-10">
                  <th className="px-4 w-[120px]">用户名</th>
                  <th className="px-4 w-[120px]">姓名</th>
                  <th className="px-4 w-[150px]">所属部门</th>
                  <th className="px-4 w-[150px]">分配角色</th>
                  <th className="px-4 w-[100px] text-center">状态</th>
                  <th className="px-4 w-[160px]">最后登录时间</th>
                  <th className="px-4 w-[120px] text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {mockUsers.map(user => (
                  <tr key={user.id} className="hover:bg-sap-blue/[0.01] transition-colors h-[38px] group">
                    <td className="px-4 text-[13px] font-bold text-sap-gray-900">{user.username}</td>
                    <td className="px-4 text-[13px] text-gray-600">{user.realName}</td>
                    <td className="px-4 text-[12px] text-gray-500">{user.dept}</td>
                    <td className="px-4">
                      <span className="bg-sap-blue/5 text-sap-blue text-[11px] px-2 py-0.5 rounded-full font-bold">{user.role}</span>
                    </td>
                    <td className="px-4 text-center">
                      <div className={cn(
                        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-tighter",
                        user.status === 'normal' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                      )}>
                        {user.status === 'normal' ? '正常' : '已锁定'}
                      </div>
                    </td>
                    <td className="px-4 text-[11px] font-mono text-gray-400">{user.lastLogin}</td>
                    <td className="px-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-sap-blue/10 rounded text-sap-blue title='重置密码'"><Key size={14} /></button>
                        <button className={cn("p-1 hover:bg-rose-100 rounded text-rose-600", user.status === 'locked' ? "text-emerald-600 hover:bg-emerald-100" : "")}>
                          {user.status === 'locked' ? <Users size={14} /> : <Lock size={14} />}
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded text-gray-400"><MoreVertical size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-gray-500">共 {mockUsers.length} 位有效管理账号</span>
            <div className="flex items-center gap-2">
               <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-400 disabled:opacity-50" disabled>
                 <ChevronRight size={14} className="rotate-180" />
               </button>
               <span className="text-[12px] font-bold px-3">1</span>
               <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-400 disabled:opacity-50" disabled>
                 <ChevronRight size={14} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
