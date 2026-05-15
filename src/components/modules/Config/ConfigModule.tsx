import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Link2, 
  Plus, 
  Terminal, 
  Database, 
  Globe,
  Search,
  Download
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '../../ui/Button';
import { ModuleType } from '@/src/types';

interface ConfigModuleProps {
  activeSubModule: ModuleType;
}

// Mock Data for Interface Configuration
const mockConnectors = [
  { id: 'conn1', name: 'SAP S/4HANA ERP 核心接口', type: 'OData', target: 'https://sap-erp.digital/sap/opu/odata', authStatus: 'authenticated', enabled: true },
  { id: 'conn2', name: 'CRM 客户数据同步', type: 'REST', target: 'https://api.crm-enterprise.io/v1', authStatus: 'authenticated', enabled: true },
  { id: 'conn3', name: '主数据管理系统 (MDM)', type: 'SAP RFC', target: 'sap-mdm-prod-01', authStatus: 'expired', enabled: false },
  { id: 'conn4', name: '第三方支付网关 (Stripe)', type: 'REST', target: 'https://api.stripe.com', authStatus: 'authenticated', enabled: true },
  { id: 'conn5', name: '智能供应链分析引擎', type: 'REST', target: 'https://ai-sc-engine.run.app', authStatus: 'authenticated', enabled: true },
];

// Mock Data for Interface Execution Logs
const mockInterfaceLogs = [
  { id: 'LOG-20260509-001', ref: 'SO-2026-6678', time: '2026-05-09 10:45:22', direction: 'AI -> SAP', duration: 345, status: 'success', request: '{"type": "CREATE_ORDER", "payload": {"customerId": "C001", "items": [...]}}', response: '{"status": "OK", "sapOrderId": "90001234"}' },
  { id: 'LOG-20260509-002', ref: 'INV-MDM-990', time: '2026-05-09 10:42:15', direction: 'SAP -> AI', duration: 120, status: 'success', request: '{"action": "SYNC_INVENTORY", "matId": "MAT-001"}', response: '{"stock": 450, "unit": "PC"}' },
  { id: 'LOG-20260509-003', ref: 'AUTH-TEST-01', time: '2026-05-09 10:35:05', direction: 'AI -> SAP', duration: 2500, status: 'error', request: '{"action": "TEST_CONNECTION"}', response: '{"error": "CONNECTION_TIMEOUT", "message": "SAP RFC Gateway unreachable"}' },
  { id: 'LOG-20260509-004', ref: 'SO-2026-6679', time: '2026-05-09 10:30:11', direction: 'AI -> SAP', duration: 412, status: 'success', request: '{"type": "QUERY_CREDIT", "customerId": "C002"}', response: '{"limit": 500000, "usage": 120000}' },
  { id: 'LOG-20260509-005', ref: 'SC-POS-002', time: '2026-05-09 09:55:40', direction: 'SAP -> AI', duration: 89, status: 'success', request: '{"type": "POST_CO_DOC", "ref": "800123"}', response: '{"status": "ACCEPTED"}' },
];

export function ConfigModule({ activeSubModule }: ConfigModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [testingId, setTestingId] = useState<string | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const isMonitor = activeSubModule === 'config-monitor';

  const filteredConnectors = useMemo(() => {
    return mockConnectors.filter(c => 
      c.name.includes(searchTerm) || 
      c.type.includes(searchTerm) || 
      c.target.includes(searchTerm)
    );
  }, [searchTerm]);

  const filteredLogs = useMemo(() => {
    return mockInterfaceLogs.filter(l => 
      l.id.includes(searchTerm) || 
      l.ref.includes(searchTerm) ||
      l.direction.includes(searchTerm)
    );
  }, [searchTerm]);

  const handleTestConnection = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F1F5F9] overflow-hidden">
      {/* Header Area */}
      <div className="p-4 flex items-start justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold text-sap-gray-900 tracking-tight font-display">
            {isMonitor ? '接口执行状况监控' : '接口配置与管理'}
          </h1>
          <p className="text-gray-500 text-[12px] mt-0.5">
            {isMonitor 
              ? '监控 AI 与 SAP 及其他核心系统间的通讯数据流水，实时诊断交互异常。' 
              : '统一管理各种异构系统的连接器，配置认证方式并执行连通性诊断。'}
          </p>
        </div>
        <div className="flex items-center gap-2">
           <div className="bg-white rounded border border-[#E2E8F0] flex items-center px-2 py-1 shadow-sm focus-within:border-sap-blue transition-all w-[240px]">
              <Search size={14} className="text-gray-400 mr-2 shrink-0" />
              <input 
                type="text" 
                placeholder="搜索..."
                className="bg-transparent border-none outline-none text-[12px] w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           {!isMonitor && (
             <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} className="py-1 shadow-none rounded">
                新增连接器
             </Button>
           )}
           {isMonitor && (
             <button className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E2E8F0] text-sap-gray-900 font-bold text-[12px] rounded hover:bg-gray-50 shadow-sm transition-all">
                <Download size={14} />
                <span>导出</span>
             </button>
           )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-4 flex flex-col min-h-0">
        <div className="bg-white rounded shadow-sm border border-[#E2E8F0] flex-1 flex flex-col overflow-hidden relative">
           <div className="flex-1 overflow-y-auto !overflow-y-auto custom-scrollbar relative" style={{ height: 'calc(100vh - 120px)' }}>
             {isMonitor ? (
                // Monitoring Table
                <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-sap-blue/[0.03] border-b border-[#F0F0F0] text-[11px] text-gray-500 font-bold uppercase tracking-tight h-9">
                      <th className="px-4 w-[180px]">执行流水号</th>
                      <th className="px-3 w-[140px]">业务参考号</th>
                      <th className="px-3 w-[160px]">调用时间</th>
                      <th className="px-3 w-[120px]">交互方向</th>
                      <th className="px-3 w-[100px] text-right">耗时</th>
                      <th className="px-4 text-center w-[100px]">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F0F0]">
                     {filteredLogs.map((log) => (
                       <React.Fragment key={log.id}>
                         <motion.tr 
                           onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                           className={cn(
                             "group cursor-pointer hover:bg-gray-50/80 transition-colors h-[36px]",
                             expandedLogId === log.id ? "bg-sap-blue/[0.03]" : ""
                           )}
                         >
                           <td className="px-4">
                              <div className="flex items-center gap-1.5 overflow-hidden">
                                 <Terminal size={12} className="text-gray-400 shrink-0" />
                                 <span className="text-[12px] font-mono font-bold text-sap-gray-900 truncate">{log.id}</span>
                              </div>
                           </td>
                           <td className="px-3">
                              <span className="text-[12px] font-bold text-sap-blue hover:underline underline-offset-2">{log.ref}</span>
                           </td>
                           <td className="px-3 text-[11px] font-mono text-gray-500 whitespace-nowrap">{log.time}</td>
                           <td className="px-3">
                              <span className={cn(
                                "text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] inline-block uppercase tracking-tighter border",
                                log.direction.includes('-> SAP') ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                              )}>
                                 {log.direction}
                              </span>
                           </td>
                           <td className="px-3 text-[11px] font-mono font-bold text-gray-600 text-right">
                              {log.duration}ms
                           </td>
                           <td className="px-4 text-center">
                              <div className={cn(
                                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold border uppercase tracking-tighter",
                                log.status === 'success' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                              )}>
                                {log.status === 'success' ? 'SUCCESS' : 'FAILURE'}
                              </div>
                           </td>
                         </motion.tr>
                         <AnimatePresence>
                           {expandedLogId === log.id && (
                             <tr>
                               <td colSpan={6} className="p-0 bg-gray-50/80">
                                 <motion.div 
                                   initial={{ height: 0, opacity: 0 }}
                                   animate={{ height: 'auto', opacity: 1 }}
                                   exit={{ height: 0, opacity: 0 }}
                                   className="overflow-hidden border-b border-[#F0F0F0]"
                                 >
                                   <div className="p-4 grid grid-cols-2 gap-4">
                                      <div className="bg-white border border-[#E2E8F0] rounded p-3 shadow-sm">
                                         <div className="text-[11px] font-bold text-gray-500 mb-2">原始请求报文</div>
                                         <pre className="text-[11px] font-mono text-sap-gray-900 whitespace-pre-wrap word-break">
                                            {log.request}
                                         </pre>
                                      </div>
                                      <div className="bg-white border border-[#E2E8F0] rounded p-3 shadow-sm">
                                         <div className="text-[11px] font-bold text-gray-500 mb-2">系统响应报文</div>
                                         <pre className="text-[11px] font-mono text-sap-gray-900 whitespace-pre-wrap word-break">
                                            {log.response}
                                         </pre>
                                      </div>
                                   </div>
                                 </motion.div>
                               </td>
                             </tr>
                           )}
                         </AnimatePresence>
                       </React.Fragment>
                     ))}
                  </tbody>
                </table>
             ) : (
                // Connectors Table
                <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-sap-blue/[0.03] border-b border-[#F0F0F0] text-[11px] text-gray-500 font-bold uppercase tracking-tight h-9">
                      <th className="px-4 w-[240px]">接口连接器名称</th>
                      <th className="px-3 w-[100px]">物理协议</th>
                      <th className="px-3">目标网关地址 / ENDPOINT</th>
                      <th className="px-3 w-[100px] text-center">状态</th>
                      <th className="px-3 w-[80px] text-center">启用</th>
                      <th className="px-4 w-[120px] text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F0F0]">
                    {filteredConnectors.map((conn) => (
                      <tr key={conn.id} className="hover:bg-gray-50 transition-colors group h-[36px]">
                        <td className="px-4">
                          <div className="flex items-center gap-1.5">
                            {conn.type === 'REST' ? <Globe size={11} className="text-gray-400" /> : conn.type === 'OData' ? <Database size={11} className="text-gray-400" /> : <Link2 size={11} className="text-gray-400" />}
                            <span className="text-[12px] text-sap-gray-900 font-bold truncate">{conn.name}</span>
                          </div>
                        </td>
                        <td className="px-3">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] inline-block bg-gray-50 text-gray-400 border border-gray-200 uppercase tracking-tighter">
                            {conn.type}
                          </span>
                        </td>
                        <td className="px-3">
                          <div className="text-[11px] font-mono text-gray-400 truncate max-w-sm" title={conn.target}>
                            {conn.target}
                          </div>
                        </td>
                        <td className="px-3 text-center">
                          <div className={cn(
                            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold border uppercase tracking-tighter",
                            conn.authStatus === 'authenticated' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                          )}>
                            {conn.authStatus === 'authenticated' ? 'ACTIVE' : 'FAILED'}
                          </div>
                        </td>
                        <td className="px-3 text-center">
                          <label className="relative inline-flex items-center cursor-pointer scale-75">
                            <input type="checkbox" defaultChecked={conn.enabled} className="sr-only peer" />
                            <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-sap-blue"></div>
                          </label>
                        </td>
                        <td className="px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleTestConnection(conn.id)}
                                disabled={testingId === conn.id}
                                className="h-6 text-[10px] uppercase font-bold tracking-tight rounded-[2px]"
                             >
                                {testingId === conn.id ? 'TESTING...' : 'DIAGNOSE'}
                             </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             )}
           </div>

           {/* Footer Summary */}
           <div className="px-4 py-2 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-[11px] text-gray-500 shrink-0">
              <div className="flex items-center gap-4">
                 <span>共 {isMonitor ? filteredLogs.length : filteredConnectors.length} 项</span>
                 <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sap-success" />
                    <span>SAP RFC Active</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
