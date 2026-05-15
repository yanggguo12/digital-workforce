import { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  MapPin, 
  Layers, 
  ShieldCheck, 
  Building2, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Network, 
  Settings 
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '../ui/Button';

// 数据结构定义
interface OrgNode {
  id: string;
  name: string;
  level: string; // 'L1' | 'L2' | 'L3' | 'L4'
  type: string; // '集团' | '公司' | '管理中心' | '部门'
  children?: OrgNode[];
}

interface UserDetail {
  id: string;
  name: string;
  account: string;
  role: string;
  orgId: string;
  companyName: string;
  centerName: string;
  departmentName: string;
  position: string;
  status: '正常' | '已锁定';
  lastLogin: string;
  bio: string;
}

// 五级组织架构数据
const ORG_TREE: OrgNode[] = [
  {
    id: 'g-1',
    name: '华星电子集团',
    level: 'L1',
    type: '集团',
    children: [
      {
        id: 'c-1',
        name: '苏州华星电子科技有限公司',
        level: 'L2',
        type: '公司',
        children: [
          {
            id: 'm-1',
            name: '营销管理中心',
            level: 'L3',
            type: '管理中心',
            children: [
              { id: 'd-11', name: '销售部', level: 'L4', type: '部门' },
              { id: 'd-12', name: '市场部', level: 'L4', type: '部门' },
              { id: 'd-13', name: '销售支持部', level: 'L4', type: '部门' }
            ]
          },
          {
            id: 'm-2',
            name: '供应链管理中心',
            level: 'L3',
            type: '管理中心',
            children: [
              { id: 'd-21', name: '采购部', level: 'L4', type: '部门' },
              { id: 'd-22', name: '物控部', level: 'L4', type: '部门' },
              { id: 'd-23', name: '生产部', level: 'L4', type: '部门' },
              { id: 'd-24', name: '仓库部', level: 'L4', type: '部门' },
              { id: 'd-25', name: '物流部', level: 'L4', type: '部门' }
            ]
          },
          {
            id: 'm-3',
            name: '财务管理中心',
            level: 'L3',
            type: '管理中心',
            children: [
              { id: 'd-31', name: '财务部', level: 'L4', type: '部门' }
            ]
          },
          {
            id: 'm-4',
            name: '信息及运维中心',
            level: 'L3',
            type: '管理中心',
            children: [
              { id: 'd-41', name: '信息部', level: 'L4', type: '部门' }
            ]
          }
        ]
      }
    ]
  }
];

// 人员列表数据
const MOCK_USERS: UserDetail[] = [
  {
    id: 'u-001',
    name: '张伟',
    account: 'zhangw_admin',
    role: '系统管理员',
    orgId: 'd-41',
    companyName: '苏州华星电子科技',
    centerName: '信息及运维中心',
    departmentName: '信息部',
    position: '系统架构师',
    bio: '负责全域系统架构与权限中心管理。',
    status: '正常',
    lastLogin: '2026-05-12 10:23:45',
  },
  {
    id: 'u-002',
    name: '李娜',
    account: 'lin_sales',
    role: '业务负责人',
    orgId: 'd-11',
    companyName: '苏州华星电子科技',
    centerName: '营销管理中心',
    departmentName: '销售部',
    position: '销售总监',
    bio: '负责区域销售目标达成及大客户关系维护。',
    status: '正常',
    lastLogin: '2026-05-11 15:45:12',
  },
  {
    id: 'u-003',
    name: '王强',
    account: 'wangq_supply',
    role: '业务负责人',
    orgId: 'd-21',
    companyName: '苏州华星电子科技',
    centerName: '供应链管理中心',
    departmentName: '采购部',
    position: '采购经理',
    bio: '负责核心物料采购与供应商管理。',
    status: '正常',
    lastLogin: '2026-05-12 09:12:30',
  },
  {
    id: 'u-004',
    name: '赵敏',
    account: 'zhaom_finance',
    role: '部门负责人',
    orgId: 'd-31',
    companyName: '苏州华星电子科技',
    centerName: '财务管理中心',
    departmentName: '财务部',
    position: '财务主管',
    bio: '负责公司财务核算及资金调度。',
    status: '正常',
    lastLogin: '2026-05-10 18:30:22',
  },
  {
    id: 'u-005',
    name: '孙斌',
    account: 'sunb_wh',
    role: '职能专员',
    orgId: 'd-24',
    companyName: '苏州华星电子科技',
    centerName: '供应链管理中心',
    departmentName: '仓库部',
    position: '仓储专员',
    bio: '负责日常货物出入库核对与盘点。',
    status: '正常',
    lastLogin: '2026-05-09 20:10:05',
  }
];

// 角色字典
const ROLES = [
  { id: '系统管理员', color: 'bg-indigo-50 text-indigo-700' },
  { id: '业务负责人', color: 'bg-emerald-50 text-emerald-700' },
  { id: '部门负责人', color: 'bg-blue-50 text-blue-700' },
  { id: '职能专员', color: 'bg-amber-50 text-amber-700' },
];

export function UsersModule() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [selectedOrgId, setSelectedOrgId] = useState<string>('g-1');
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 获取当前选中的节点及其所有子节点的 ID 集合，用于穿透查询
  const selectedNodeIds = useMemo(() => {
    const ids = new Set<string>();
    let foundNode: OrgNode | null = null;
    
    const findSelectedNode = (nodes: OrgNode[]) => {
      for (const node of nodes) {
        if (node.id === selectedOrgId) {
          foundNode = node;
          return;
        }
        if (node.children) findSelectedNode(node.children);
      }
    };
    findSelectedNode(ORG_TREE);

    if (foundNode) {
      const collectIds = (node: OrgNode) => {
        ids.add(node.id);
        if (node.children) {
          node.children.forEach(collectIds);
        }
      };
      collectIds(foundNode);
    }
    return ids;
  }, [selectedOrgId]);

  // 从树中提取节点用于显示全路径名称
  const selectedNodeInfo = useMemo(() => {
     let info: OrgNode | null = null;
     const findInfo = (nodes: OrgNode[]) => {
        for (const n of nodes) {
           if (n.id === selectedOrgId) info = n;
           if (n.children) findInfo(n.children);
        }
     }
     findInfo(ORG_TREE);
     return info;
  }, [selectedOrgId]);

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(u => {
      const matchSearch = u.name.includes(searchTerm) || 
                          u.account.includes(searchTerm) ||
                          u.companyName.includes(searchTerm) ||
                          u.centerName.includes(searchTerm) ||
                          u.departmentName.includes(searchTerm);
      
      const belongsToOrg = selectedNodeIds.has(u.orgId);
      return matchSearch && belongsToOrg;
    });
  }, [searchTerm, selectedNodeIds]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F1F5F9] overflow-hidden">
      {/* 顶部标题栏 */}
      <div className="px-4 py-2 bg-white border-b border-[#E2E8F0] flex items-center justify-between shrink-0 h-[48px]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#F1F5F9] flex items-center justify-center text-[#1677FF] border border-[#E2E8F0]">
            <ShieldCheck size={16} />
          </div>
          <div>
            <h1 className="text-[14px] font-bold text-[#333333] tracking-tight">组织与权限管理中心</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-[#F1F5F9] p-0.5 rounded border border-[#E2E8F0]">
          <button
            onClick={() => setActiveTab('users')}
            className={cn(
              "px-3 py-1 text-[12px] font-bold rounded transition-all",
              activeTab === 'users' ? "bg-white text-[#1677FF] shadow-sm border border-[#E2E8F0]" : "text-gray-500 hover:text-gray-800"
            )}
          >
            组织与成员
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={cn(
              "px-3 py-1 text-[12px] font-bold rounded transition-all",
              activeTab === 'roles' ? "bg-white text-[#1677FF] shadow-sm border border-[#E2E8F0]" : "text-gray-500 hover:text-gray-800"
            )}
          >
            权限矩阵配置
          </button>
        </div>
      </div>

      {activeTab === 'users' ? (
        <div className="flex-1 flex overflow-hidden p-3 gap-3">
          {!selectedUser ? (
            <>
              {/* 左侧：五级组织架构树 */}
              <div className="w-[260px] lg:w-[280px] bg-white border border-[#E2E8F0] rounded p-3 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[12px] font-bold text-gray-700 tracking-widest">企业组织架构</span>
                  <button className="text-[#1677FF] p-1 hover:bg-[#F0F5FF] rounded border border-transparent transition-colors">
                    <Network size={14} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1">
                  <OrgTree 
                    nodes={ORG_TREE} 
                    selectedId={selectedOrgId} 
                    onSelect={setSelectedOrgId} 
                    defaultExpanded={true}
                  />
                </div>

                {/* 动态状态管控卡片 */}
                <div className="pt-3 border-t border-[#E2E8F0] mt-2">
                   <div className="px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-white flex items-center justify-center text-[#1677FF] border border-[#E2E8F0] shrink-0">
                         <ShieldCheck size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-gray-500">当前管控级别</div>
                        <div className="text-[12px] font-bold text-[#333333] truncate">
                           {selectedNodeInfo?.level} - {selectedNodeInfo?.type}级
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* 右侧：五级人员列表 */}
              <div className="flex-1 flex flex-col min-w-0 bg-white rounded shadow-sm border border-[#E2E8F0] overflow-hidden">
                 {/* 搜索与操作栏 */}
                 <div className="px-4 py-2 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between shrink-0 h-[48px]">
                    <div className="flex items-center gap-3 w-full max-w-md">
                      <div className="px-2 py-1 bg-white rounded flex items-center gap-1 border border-[#E2E8F0] shrink-0">
                         <MapPin size={12} className="text-[#1677FF]" />
                         <span className="text-[12px] font-bold text-[#333333]">{selectedNodeInfo?.name}</span>
                      </div>
                      <div className="w-[1px] h-3 bg-[#E2E8F0] mx-1 shrink-0" />
                      <div className="relative flex-1 group bg-white border border-[#E2E8F0] rounded px-2">
                         <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                           type="text" 
                           placeholder="模糊查询：姓名 / 账号 / 部门..."
                           className="bg-transparent border-none outline-none pl-6 pr-2 py-1 flex-1 w-full text-[12px]"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                         />
                      </div>
                    </div>
                    <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} className="py-1 shrink-0 ml-4 border border-[#1677FF] shadow-none whitespace-nowrap bg-[#1677FF] hover:bg-[#1677FF]/90">
                       新增成员
                    </Button>
                 </div>

                 {/* 极致紧凑数据表格 (36px Row Height) */}
                 <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar relative">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                      <thead className="sticky top-0 bg-[#F8FAFC] z-10 shadow-sm border-b border-[#E2E8F0]">
                        <tr className="h-[36px]">
                          <th className="px-3 text-[12px] font-bold text-[#333333] w-[160px]">姓名 / 账号</th>
                          <th className="px-3 text-[12px] font-bold text-[#333333] w-[200px]">所属公司</th>
                          <th className="px-3 text-[12px] font-bold text-[#333333] w-[140px]">所属中心</th>
                          <th className="px-3 text-[12px] font-bold text-[#333333] w-[160px]">所属部门 / 岗位</th>
                          <th className="px-3 text-[12px] font-bold text-[#333333] w-[100px]">系统角色</th>
                          <th className="px-3 text-[12px] font-bold text-[#333333] w-[80px]">状态</th>
                          <th className="px-3 text-[12px] font-bold text-[#333333] w-[60px] text-center">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        {filteredUsers.map((user) => (
                          <tr 
                            key={user.id} 
                            onClick={() => setSelectedUser(user)}
                            className="group hover:bg-[#F0F5FF]/50 cursor-pointer transition-colors h-[36px]"
                          >
                            <td className="px-3 py-0">
                               <div className="flex flex-col justify-center h-full max-w-full overflow-hidden">
                                  <span className="text-[12px] font-bold text-[#333333] group-hover:text-[#1677FF] truncate leading-tight">
                                     {user.name}
                                  </span>
                                  <span className="text-[10px] text-gray-500 truncate leading-tight mt-[1px]">{user.account}</span>
                               </div>
                            </td>
                            <td className="px-3 py-0">
                               <span className="text-[12px] text-[#333333] truncate block w-full">{user.companyName}</span>
                            </td>
                            <td className="px-3 py-0">
                               <span className="text-[12px] text-[#333333] truncate block w-full">{user.centerName}</span>
                            </td>
                            <td className="px-3 py-0">
                               <div className="flex flex-col justify-center h-full max-w-full overflow-hidden">
                                  <span className="text-[12px] font-bold text-[#333333] truncate leading-tight block">{user.departmentName}</span>
                                  <span className="text-[10px] text-gray-500 truncate leading-tight mt-[1px]">{user.position}</span>
                               </div>
                            </td>
                            <td className="px-3 py-0">
                               <span className={cn(
                                 "px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold inline-block truncate",
                                 ROLES.find(r => r.id === user.role)?.color || 'bg-gray-100 text-gray-700'
                               )}>
                                  {user.role}
                               </span>
                            </td>
                            <td className="px-3 py-0">
                               <div className={cn(
                                 "inline-flex items-center gap-1 text-[11px] font-bold shrink-0",
                                 user.status === '正常' ? "text-emerald-600" : "text-red-600"
                               )}>
                                 <div className={cn("w-1.5 h-1.5 rounded-full", user.status === '正常' ? "bg-emerald-500" : "bg-red-500")} />
                                 {user.status}
                               </div>
                            </td>
                            <td className="px-3 py-0 text-center">
                               <button className="text-[#1677FF] text-[12px] font-bold hover:underline" onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}>查看</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                      <div className="py-12 text-center flex flex-col items-center justify-center">
                         <span className="text-[12px] text-gray-400 font-bold">没有找到匹配的人员记录</span>
                      </div>
                    )}
                 </div>
                 
                 <div className="px-4 py-2 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center text-[12px] text-gray-500 shrink-0 h-[36px]">
                    <span className="font-bold">查询结果： {filteredUsers.length} 条记录</span>
                 </div>
              </div>
            </>
          ) : (
            /* 人员核心明细 (占用全宽) */
            <div className="w-full bg-white rounded border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden h-full">
              <div className="px-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between shrink-0 h-[48px]">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedUser(null)}
                    className="p-1 text-gray-500 hover:text-[#333333] hover:bg-gray-200 rounded transition-colors"
                  >
                    <ChevronRight className="rotate-180" size={16} />
                  </button>
                  <h2 className="text-[14px] font-bold text-[#333333]">人员详细资料</h2>
                </div>
                <div className="flex gap-2">
                   <Button variant="secondary" size="sm" className="h-[28px] text-[12px] px-4 shadow-none border-[#E2E8F0]">返回人员列表</Button>
                </div>
              </div>

              <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-[4px] bg-[#1677FF] flex items-center justify-center text-white text-[24px] font-bold shadow-sm">
                       {selectedUser.name.charAt(0)}
                    </div>
                    <div>
                       <h3 className="text-[18px] font-bold text-[#333333]">{selectedUser.name} <span className="text-[11px] text-gray-400 font-normal ml-1 border border-[#E2E8F0] px-1 py-0.5 rounded-[2px]">账号: {selectedUser.account}</span></h3>
                       <p className="text-[13px] text-gray-600 font-medium mt-1">{selectedUser.companyName} / {selectedUser.centerName} / {selectedUser.departmentName} - {selectedUser.position}</p>
                    </div>
                 </div>

                 <h4 className="text-[12px] font-bold text-[#333333] border-b border-[#E2E8F0] pb-2 mb-4">组织管控信息</h4>
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                   <DetailRow label="系统配置角色" value={selectedUser.role} />
                   <DetailRow label="AI Agent调用权限" value={selectedUser.centerName === '财务管理中心' ? '@智能财务审计' : (selectedUser.centerName === '供应链管理中心' ? '@智能供应链预警' : '@通用数据助手')} highlight="text-[#1677FF]" />
                   <DetailRow label="所属管控组织层级" value={selectedUser.orgId.startsWith('d-') ? 'L4 - 部门层级' : 'L3 - 管理中心层级'} />
                   <DetailRow label="最后系统接入时间" value={selectedUser.lastLogin} isMono />
                 </div>

                 <h4 className="text-[12px] font-bold text-[#333333] border-b border-[#E2E8F0] pb-2 mb-4">岗位职责说明</h4>
                 <p className="text-[12px] text-gray-600 leading-relaxed font-medium">
                   {selectedUser.bio}
                 </p>
                 
                 <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex gap-3">
                    <button className="px-6 h-[32px] bg-red-50 text-red-700 hover:bg-red-100 rounded-[2px] text-[12px] font-bold border border-red-200 transition-colors">在此节点禁用账号</button>
                    <button className="px-6 h-[32px] bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-[2px] text-[12px] font-bold border border-[#E2E8F0] transition-colors">强制重置通行秘钥</button>
                 </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 权限矩阵配置 (简略版，严格商务中文风格) */
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="bg-white rounded shadow-sm border border-[#E2E8F0] flex flex-col flex-1 overflow-hidden">
             <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between shrink-0 h-[48px]">
                <div className="flex items-center gap-4">
                   <span className="text-[12px] font-bold text-gray-600 shrink-0">当前选中角色 :</span>
                   <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                      {ROLES.map(role => (
                        <button 
                          key={role.id}
                          className={cn(
                            "px-3 py-1 rounded-[2px] text-[12px] font-bold transition-all border shrink-0",
                            role.id === '系统管理员' ? "bg-[#1677FF] text-white border-[#1677FF]" : "bg-white text-gray-600 border-[#E2E8F0] hover:border-[#1677FF]/50"
                          )}
                        >
                          {role.id}
                        </button>
                      ))}
                   </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                   <Button variant="primary" size="sm" className="h-[28px] text-[12px] px-6 shadow-none bg-[#1677FF] text-white hover:bg-[#1677FF]/90 rounded-[2px]">
                      应用全局权限
                   </Button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="w-full max-w-4xl space-y-6">
                   {/* 数据隔离模块 */}
                   <div className="p-6 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="w-8 h-8 bg-white border border-[#E2E8F0] flex items-center justify-center text-[#1677FF] rounded-[2px]">
                            <Settings size={16} />
                         </div>
                         <div>
                            <h3 className="text-[14px] font-bold text-[#333333]">集团组织架构穿透配置规则</h3>
                            <p className="text-[12px] text-gray-500 mt-0.5">严格设定当前角色在五级组织体系（集团-公司-中心-部门-人员）中的数据可见度。</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                         {[
                           { id: 'scope-self', label: 'L5 人员级隔离', desc: '不可跨越本账号，仅允许访问该用户名下产生的交易与单据明细。' },
                           { id: 'scope-dept', label: 'L4 部门级隔离', desc: '允许查看所属“具体职能部门”内部所有员工的数据汇总。' },
                           { id: 'scope-center', label: 'L3 管理中心穿透', desc: '允许向下穿透至本“管理中心”下辖的全部并行职能部门。' },
                           { id: 'scope-full', label: 'L1/L2 集团级统查', desc: '允许无限制跨库检索“全域企业数据”及审计全链路数据。' },
                         ].map(scope => (
                           <label key={scope.id} className="p-4 bg-white border border-[#E2E8F0] rounded-[2px] cursor-pointer hover:border-[#1677FF]/40 focus-within:border-[#1677FF] transition-all group flex flex-col h-full">
                              <div className="flex items-start justify-between mb-3">
                                 <input type="radio" name="scope" defaultChecked={scope.id === 'scope-center'} className="w-4 h-4 text-[#1677FF] border-gray-300 focus:ring-[#1677FF] cursor-pointer" />
                                 <Network size={14} className="text-gray-400 group-hover:text-[#1677FF] transition-colors" />
                              </div>
                              <div className="text-[13px] font-bold text-[#333333] mb-1.5">{scope.label}</div>
                              <div className="text-[12px] text-gray-500 leading-relaxed">{scope.desc}</div>
                           </label>
                         ))}
                      </div>
                   </div>
                   
                   {/* Agent 配置能力 */}
                   <div className="p-6 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="w-8 h-8 bg-white border border-[#E2E8F0] flex items-center justify-center text-[#1677FF] rounded-[2px]">
                            <Layers size={16} />
                         </div>
                         <div>
                            <h3 className="text-[14px] font-bold text-[#333333]">多级协同中心 Agent 分配</h3>
                            <p className="text-[12px] text-gray-500 mt-0.5">将智能审查引擎权限绑定至特定的组织中心节点。</p>
                         </div>
                      </div>
                      <div className="space-y-3">
                          <label className="flex items-center gap-3 p-3 bg-white border border-[#E2E8F0] rounded-[2px] cursor-pointer hover:border-[#1677FF]/40 hover:bg-[#F0F5FF]/30 transition-all select-none group">
                              <input type="checkbox" defaultChecked className="w-4 h-4 rounded-sm border-gray-300 text-[#1677FF] focus:ring-[#1677FF] transition-all cursor-pointer" />
                              <div className="flex flex-col">
                                 <div className="text-[12px] font-bold text-[#333333] group-hover:text-[#1677FF]">授权唤起 @智能财务审计 Agent (限制于：财务管理中心 及以上层级)</div>
                              </div>
                          </label>
                          <label className="flex items-center gap-3 p-3 bg-white border border-[#E2E8F0] rounded-[2px] cursor-pointer hover:border-[#1677FF]/40 hover:bg-[#F0F5FF]/30 transition-all select-none group">
                              <input type="checkbox" defaultChecked className="w-4 h-4 rounded-sm border-gray-300 text-[#1677FF] focus:ring-[#1677FF] transition-all cursor-pointer" />
                              <div className="flex flex-col">
                                 <div className="text-[12px] font-bold text-[#333333] group-hover:text-[#1677FF]">授权唤起 @智能供应链预警 Agent (限制于：供应链管理中心 及其下属部门)</div>
                              </div>
                          </label>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 辅助组件：组织架树渲染
function OrgTree({ 
  nodes, 
  selectedId, 
  onSelect, 
  depth = 0,
  defaultExpanded = false
}: { 
  nodes: OrgNode[], 
  selectedId: string, 
  onSelect: (id: string) => void, 
  depth?: number,
  defaultExpanded?: boolean
}) {
  return (
    <div className="space-y-0.5">
      {nodes.map(node => (
        <OrgTreeNode 
          key={node.id} 
          node={node} 
          selectedId={selectedId} 
          onSelect={onSelect} 
          depth={depth} 
          defaultExpanded={defaultExpanded}
        />
      ))}
    </div>
  );
}

function OrgTreeNode({ 
  node, 
  selectedId, 
  onSelect, 
  depth,
  defaultExpanded 
}: {
  node: OrgNode,
  selectedId: string,
  onSelect: (id: string) => void,
  depth: number,
  defaultExpanded: boolean
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isSelected = selectedId === node.id;
  
  return (
    <div>
      <button
        onClick={() => {
           onSelect(node.id);
           if (!expanded && node.children && node.children.length > 0) {
             setExpanded(true);
           } else if (expanded && isSelected) {
             setExpanded(false); // 再次点击选中项时收起
           }
        }}
        className={cn(
          "w-full flex items-center gap-2 py-[7px] px-2 rounded-[2px] text-left transition-colors group relative",
          isSelected 
            ? "bg-[#1677FF]/10 text-[#1677FF]" 
            : "hover:bg-[#F8FAFC] text-[#333333]"
        )}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
      >
        {node.children && node.children.length > 0 ? (
          <ChevronDown 
            size={14} 
            className={cn(
              "transition-transform shrink-0", 
              !expanded && "-rotate-90",
              isSelected ? "text-[#1677FF]" : "text-gray-400 group-hover:text-[#1677FF]"
            )} 
          />
        ) : (
          <div className="w-[14px] h-[14px] shrink-0" />
        )}
        
        {/* 根据不同的层级展示不同的组织架构图标语义 */}
        {node.type === '集团' && <Building2 size={14} className={cn("shrink-0", isSelected ? "text-[#1677FF]" : "text-gray-400")} />}
        {node.type === '公司' && <Building2 size={13} className={cn("shrink-0", isSelected ? "text-[#1677FF]" : "text-gray-400")} />}
        {node.type === '管理中心' && <Network size={13} className={cn("shrink-0", isSelected ? "text-[#1677FF]" : "text-gray-400")} />}
        {node.type === '部门' && <CheckCircle2 size={12} className={cn("shrink-0", isSelected ? "text-[#1677FF]" : "text-gray-400")} />}
        
        <span className={cn(
          "text-[12px] truncate",
          isSelected ? "font-bold" : "font-medium"
        )}>
           {node.name}
        </span>
      </button>
      
      {expanded && node.children && (
        <OrgTree 
           nodes={node.children} 
           selectedId={selectedId} 
           onSelect={onSelect} 
           depth={depth + 1} 
           defaultExpanded={defaultExpanded}
        />
      )}
    </div>
  );
}

function DetailRow({ label, value, isMono, highlight }: { label: string, value: string, isMono?: boolean, highlight?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] text-gray-500 font-bold">{label}</span>
      <span className={cn("text-[13px] text-[#333333] font-bold line-clamp-1", isMono && "font-mono", highlight)}>{value}</span>
    </div>
  );
}
