import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  FolderTree, 
  Trash2, 
  Save, 
  ChevronRight, 
  ChevronDown,
  Edit,
  Users
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '../../../ui/Button';

// Mock Data
const mockOrgTree = [
  { 
    id: 'org1', 
    name: 'XXX 集团总部', 
    code: 'HQ', 
    count: 120,
    expanded: true,
    children: [
      { id: 'org1-1', name: '总裁办', code: 'CEO_OFFICE', count: 5, children: [] },
      { id: 'org1-2', name: '研发中心', code: 'RND', count: 45, children: [
        { id: 'org1-2-1', name: '基础架构部', code: 'INFRA', count: 12, children: [] },
        { id: 'org1-2-2', name: '业务系统部', code: 'BIZ_SYS', count: 33, children: [] },
      ] },
      { id: 'org1-3', name: '营销中心', code: 'MKT', count: 30, children: [] },
      { id: 'org1-4', name: '财务中心', code: 'FIN', count: 15, children: [] },
      { id: 'org1-5', name: '人力资源部', code: 'HR', count: 10, children: [] },
    ]
  },
  {
    id: 'org2',
    name: '华东分公司',
    code: 'EAST_BRANCH',
    count: 85,
    expanded: false,
    children: [
      { id: 'org2-1', name: '销售部', code: 'EB_SALES', count: 40, children: [] },
      { id: 'org2-2', name: '交付支撑部', code: 'EB_DELIVERY', count: 45, children: [] },
    ]
  }
];

const mockUsers = [
  { id: 'u1', name: '张三', employeeId: 'E001', phone: '13800138000', email: 'zhangsan@example.com', status: 'active', position: '技术总监' },
  { id: 'u2', name: '李四', employeeId: 'E002', phone: '13800138001', email: 'lisi@example.com', status: 'active', position: '高级工程师' },
  { id: 'u3', name: '王五', employeeId: 'E003', phone: '13800138002', email: 'wangwu@example.com', status: 'inactive', position: '产品经理' },
  { id: 'u4', name: '赵六', employeeId: 'E004', phone: '13800138003', email: 'zhaoliu@example.com', status: 'active', position: '开发工程师' },
  { id: 'u5', name: '钱七', employeeId: 'E005', phone: '13800138004', email: 'qianqi@example.com', status: 'active', position: '设计师' },
];

export function OrgManagement() {
  const [activeOrgId, setActiveOrgId] = useState('org1-2');
  const [expandedIds, setExpandedIds] = useState<string[]>(['org1', 'org1-2']);

  const findOrgAndParent = (nodes: any[], targetId: string, parent: any = null): { org: any, parent: any } | null => {
    for (const node of nodes) {
      if (node.id === targetId) {
        return { org: node, parent };
      }
      if (node.children) {
        const result = findOrgAndParent(node.children, targetId, node);
        if (result) return result;
      }
    }
    return null;
  };

  const currentOrgData = React.useMemo(() => {
    return findOrgAndParent(mockOrgTree, activeOrgId);
  }, [activeOrgId]);

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const renderOrgTree = (items: any[]) => {
    return items.map(item => {
      const isExpanded = expandedIds.includes(item.id);
      const isLeaf = !item.children || item.children.length === 0;

      return (
        <div key={item.id} className="ml-4 mt-1 filter drop-shadow-sm">
          <div 
            className={cn(
              "flex items-center gap-2 cursor-pointer group px-2 py-1.5 rounded transition-colors border",
              activeOrgId === item.id 
                ? "bg-sap-blue/10 border-sap-blue/20 text-sap-blue" 
                : "hover:bg-gray-100 border-transparent text-gray-700"
            )}
            onClick={() => setActiveOrgId(item.id)}
          >
            <div className="w-4 h-4 flex items-center justify-center shrink-0" onClick={(e) => !isLeaf && toggleExpand(e, item.id)}>
              {!isLeaf && (
                isExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />
              )}
            </div>
            {isLeaf ? (
              <Building2 size={14} className={activeOrgId === item.id ? "text-sap-blue" : "text-amber-500"} />
            ) : (
              <FolderTree size={14} className={activeOrgId === item.id ? "text-sap-blue" : "text-amber-500"} />
            )}
            <span className={cn("text-[13px] whitespace-nowrap", activeOrgId === item.id ? "font-bold" : "")}>{item.name}</span>
            <span className="text-[10px] text-gray-400 ml-auto bg-gray-200/50 px-1 rounded font-mono group-hover:bg-white transition-colors">{item.count}</span>
          </div>
          {isExpanded && !isLeaf && item.children && (
             <div className="pl-2 border-l border-gray-200 ml-3">
               {renderOrgTree(item.children)}
             </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-4 p-4 lg:p-6 bg-gray-50/50 overflow-hidden">
      
      {/* Left Organization Tree */}
      <div className="w-full md:w-72 lg:w-80 shrink-0 bg-white/60 backdrop-blur-md rounded-xl border border-white/40 shadow-xl shadow-gray-200/50 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-sap-blue/10 flex items-center justify-center text-sap-blue">
              <FolderTree size={14} />
            </div>
            <span className="text-[12px] font-bold text-gray-700">组织架构</span>
          </div>
          <div className="flex gap-1">
             <button className="p-1 hover:bg-sap-blue/10 rounded text-sap-blue" title="编辑架构"><Edit size={14} /></button>
             <button className="p-1 hover:bg-sap-blue/10 rounded text-sap-blue" title="新增节点"><Plus size={14} /></button>
          </div>
        </div>
        <div className="p-2 border-b border-gray-50 bg-white/40">
          <div className="bg-white rounded border border-gray-200 flex items-center px-2 py-1 focus-within:border-sap-blue transition-all">
            <Search size={14} className="text-gray-400 mr-2 shrink-0" />
            <input type="text" placeholder="搜索部门或机构..." className="bg-transparent border-none outline-none text-[12px] w-full" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          <div className="-ml-4">
             {renderOrgTree(mockOrgTree)}
          </div>
        </div>
      </div>

      {/* Right Org View/Edit */}
      <div className="flex-1 bg-white/60 backdrop-blur-md rounded-xl border border-white/40 shadow-xl shadow-gray-200/50 flex flex-col overflow-hidden min-w-0">
        <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-sap-blue/10 flex items-center justify-center text-sap-blue">
              <Building2 size={14} />
            </div>
            <span className="text-[12px] font-bold text-gray-700">组织详情</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-8 text-[12px]"><Save size={14} className="mr-1" />保存修改</Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {currentOrgData?.org ? (
            <div className="max-w-2xl">
              <h3 className="text-[14px] font-bold text-gray-800 mb-4 border-b pb-2">基本信息</h3>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
                 <div className="flex flex-col gap-1.5">
                   <label className="text-[12px] font-bold text-gray-500">机构名称 <span className="text-red-500">*</span></label>
                   <input type="text" value={currentOrgData.org.name} readOnly className="text-[13px] border border-gray-200 rounded px-3 py-1.5 focus:border-sap-blue focus:ring-1 focus:ring-sap-blue outline-none" />
                 </div>
                 
                 <div className="flex flex-col gap-1.5">
                   <label className="text-[12px] font-bold text-gray-500">机构编码 <span className="text-red-500">*</span></label>
                   <input type="text" value={currentOrgData.org.code} readOnly className="text-[13px] border border-gray-200 rounded px-3 py-1.5 focus:border-sap-blue focus:ring-1 focus:ring-sap-blue outline-none font-mono" />
                 </div>

                 <div className="flex flex-col gap-1.5">
                   <label className="text-[12px] font-bold text-gray-500">上级机构</label>
                   <div className="flex items-center text-[13px] border border-gray-200 rounded px-3 py-1.5 bg-gray-50 text-gray-500 h-[33px]">
                      {currentOrgData.parent ? currentOrgData.parent.name : '无 (顶级机构)'}
                   </div>
                 </div>

                 <div className="flex flex-col gap-1.5">
                   <label className="text-[12px] font-bold text-gray-500">机构负责人</label>
                   <input type="text" defaultValue="张三" className="text-[13px] border border-gray-200 rounded px-3 py-1.5 focus:border-sap-blue focus:ring-1 focus:ring-sap-blue outline-none" />
                 </div>
                 
                 <div className="flex flex-col gap-1.5 col-span-2">
                   <label className="text-[12px] font-bold text-gray-500">备注说明</label>
                   <textarea rows={3} className="text-[13px] border border-gray-200 rounded px-3 py-1.5 focus:border-sap-blue focus:ring-1 focus:ring-sap-blue outline-none" defaultValue={`负责${currentOrgData.org.name}的相关管理工作。`} />
                 </div>
              </div>

              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h3 className="text-[14px] font-bold text-gray-800">下级机构 ({currentOrgData.org.children?.length || 0})</h3>
                <Button size="sm" variant="outline" className="h-7 text-[12px] py-0 px-2"><Plus size={14} className="mr-1" />添加子机构</Button>
              </div>

              {currentOrgData.org.children && currentOrgData.org.children.length > 0 ? (
                <table className="w-full text-left border border-gray-200 rounded overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-[11px] font-bold text-gray-500 border-b border-gray-200">机构名称</th>
                      <th className="px-4 py-2 text-[11px] font-bold text-gray-500 border-b border-gray-200">机构编码</th>
                      <th className="px-4 py-2 text-[11px] font-bold text-gray-500 border-b border-gray-200 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentOrgData.org.children.map((child: any) => (
                      <tr key={child.id} className="hover:bg-gray-50 group">
                        <td className="px-4 py-2 text-[13px] text-gray-800">{child.name}</td>
                        <td className="px-4 py-2 text-[13px] font-mono text-gray-500">{child.code}</td>
                        <td className="px-4 py-2 text-right">
                           <button className="text-sap-blue hover:text-sap-blue/80 px-2 opacity-0 group-hover:opacity-100 transition-opacity"><Edit size={14}/></button>
                           <button className="text-rose-500 hover:text-rose-700 px-2 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500 text-[13px] bg-gray-50 rounded border border-gray-100/50">
                  暂无子机构
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center h-full text-gray-400 text-[13px]">
              请选择左侧组织节点查看详情
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
