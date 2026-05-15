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
  Briefcase,
  UserCheck
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '../../../ui/Button';

// Mock Data
const clientTree = [
  { id: 'c1', name: '大区经销商', children: [
    { id: 'c2', name: '华东区运营', children: [
      { id: 'c3', name: '上海旗舰店' },
      { id: 'c4', name: '杭州分销商' },
    ]},
    { id: 'c5', name: '华北区运营' },
  ]},
  { id: 'c6', name: '自营平台' },
];

const mockBizUsers = [
  { id: 'b1', username: 'biz_sh_01', realName: '陈经理', org: '上海旗舰店', role: '门店管理员', phone: '138****0001', status: 'normal', apps: ['智能营销', '智能供应链'] },
  { id: 'b2', username: 'biz_hz_02', realName: '林小姐', org: '杭州分销商', role: '普通销售', phone: '139****1122', status: 'normal', apps: ['智能营销'] },
  { id: 'b3', username: 'biz_ext_99', realName: '外驻张工', org: '华北区运营', role: '物流协调', phone: '150****8888', status: 'expired', apps: ['智能供应链'] },
];

export function BusinessUserManagement() {
  const [selectedOrg, setSelectedOrg] = useState('c1');
  const [expanded, setExpanded] = useState<string[]>(['c1', 'c2']);

  const renderTree = (items: any[]) => {
    return items.map(item => (
      <div key={item.id} className="ml-4">
        <div 
          className={cn(
            "flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-all text-[13px]",
            selectedOrg === item.id ? "bg-sap-blue/10 text-sap-blue font-bold" : "text-gray-600 hover:bg-gray-100"
          )}
          onClick={() => setSelectedOrg(item.id)}
        >
          {item.children ? (
            <div onClick={(e) => { e.stopPropagation(); toggleExpand(item.id); }}>
              {expanded.includes(item.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
          ) : <div className="w-3.5" />}
          <Building2 size={14} className={cn(selectedOrg === item.id ? "text-sap-blue" : "text-gray-400")} />
          <span className="truncate">{item.name}</span>
        </div>
        {item.children && expanded.includes(item.id) && renderTree(item.children)}
      </div>
    ));
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 flex items-center justify-between shrink-0 bg-white/40 backdrop-blur-md border-b border-white/20">
        <div>
          <h1 className="text-lg font-bold text-sap-gray-900 tracking-tight font-display flex items-center gap-2">
            <UserCheck className="text-sap-blue" size={20} />
            <span>业务用户 (前台账号)</span>
          </h1>
          <p className="text-gray-500 text-[12px] mt-0.5">管理AI数字员工平台的实际业务操作人员，对接 ERP 前台业务权限。</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} className="py-1 shadow-none rounded">新增业务员</Button>
          <Button variant="outline" size="sm" leftIcon={<Upload size={14} />} className="py-1 shadow-none rounded bg-white">批量导入</Button>
          <Button variant="outline" size="sm" leftIcon={<Download size={14} />} className="py-1 shadow-none rounded bg-white">导出报表</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Tree */}
        <div className="w-[240px] shrink-0 bg-white/60 backdrop-blur-md rounded-xl border border-white/40 shadow-xl shadow-gray-200/50 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex items-center gap-2 bg-blue-50/30">
            <Briefcase size={14} className="text-sap-blue" />
            <span className="text-[12px] font-bold text-gray-700">业务机构列表</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            {renderTree(clientTree)}
          </div>
        </div>

        {/* Right Table */}
        <div className="flex-1 bg-white/60 backdrop-blur-md rounded-xl border border-white/40 shadow-xl shadow-gray-200/50 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="bg-white/80 rounded border border-gray-200 flex items-center px-2 py-1 focus-within:border-sap-blue transition-all w-[300px]">
              <Search size={14} className="text-gray-400 mr-2 shrink-0" />
              <input type="text" placeholder="搜索业务账号、联系电话..." className="bg-transparent border-none outline-none text-[12px] w-full" />
            </div>
            <div className="flex items-center gap-2">
               <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] text-gray-600 font-bold text-[11px] rounded hover:bg-gray-50 shadow-sm transition-all">
                  <span>多维过滤器</span>
                  <ChevronDown size={12} />
               </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse table-fixed">
              <thead className="sticky top-0 z-10">
                <tr className="bg-sap-blue/[0.03] border-b border-[#F0F0F0] text-[11px] text-gray-500 font-bold uppercase tracking-tight h-10">
                  <th className="px-4 w-[120px]">业务账号</th>
                  <th className="px-4 w-[100px]">联系人</th>
                  <th className="px-4 w-[150px]">归属机构</th>
                  <th className="px-4 w-[150px]">关联业务应用</th>
                  <th className="px-4 w-[120px]">联系电话</th>
                  <th className="px-4 w-[80px] text-center">状态</th>
                  <th className="px-4 w-[100px] text-right">管理</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {mockBizUsers.map(user => (
                  <tr key={user.id} className="hover:bg-sap-blue/[0.01] transition-colors h-[42px] group">
                    <td className="px-4 text-[13px] font-bold text-sap-gray-900">{user.username}</td>
                    <td className="px-4 text-[13px] text-gray-600">{user.realName}</td>
                    <td className="px-4 text-[12px] text-gray-500 font-medium">{user.org}</td>
                    <td className="px-4">
                      <div className="flex flex-wrap gap-1">
                        {user.apps.map(app => (
                          <span key={app} className="bg-emerald-50 text-emerald-600 text-[10px] px-1.5 py-0.5 rounded border border-emerald-100 font-bold">
                            {app}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 text-[11px] font-mono text-gray-400">{user.phone}</td>
                    <td className="px-4 text-center">
                      <div className={cn(
                        "w-2 h-2 rounded-full mx-auto",
                        user.status === 'normal' ? "bg-sap-success" : "bg-gray-300"
                      )} />
                    </td>
                    <td className="px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="text-sap-blue text-[11px] font-bold hover:underline">权限分配</button>
                        <button className="p-1 hover:bg-gray-100 rounded text-gray-400"><MoreVertical size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
