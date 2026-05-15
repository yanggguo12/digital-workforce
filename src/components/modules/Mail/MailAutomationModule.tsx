import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Settings, Inbox, CheckCircle, AlertTriangle, FileText, ChevronRight, X, ArrowLeft, Shield, Zap, Search, RefreshCw, Paperclip, Download, User, Check, Layers, Globe, Plus, Trash2, Edit } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ModuleType } from '@/src/types';

// Mock data for Mail Queue
const generateMockMails = () => {
  const mails = [];
  for(let i=0; i<12; i++) {
      mails.push({
         id: `m-p-${i}`,
         subject: `PO-202605-00${i+1} 采购合同及附件`,
         sender: `client${i}@acmecorp.com`,
         dateStr: '2026-05-06',
         timeStr: `09:1${i}`,
         date: `${i*5+2}分钟前`,
         status: 'pending',
         aiConfidence: 90 + Math.floor(Math.random()*9),
         intent: '订单录入',
         attachments: ['PO-202605.pdf', 'BOM清单.xlsx'],
         content: '您好：\n\n请查收本月最新采购合同及相关BOM清单附件。\n如有问题请及时联系。\n\n谢谢',
         bpMatched: `BP-100${i+20} (Client ${i} Corp)`,
         orderStatus: i % 3 === 0 ? 'confirmed' : 'draft'
      });
  }
  for(let i=0; i<2; i++) {
      mails.push({
         id: `m-w-${i}`,
         subject: `紧急订单: 补充零件 ${i*1000 + 5000}套`,
         sender: `supply${i}@globalsourceltd.com`,
         dateStr: '2026-05-06',
         timeStr: `08:3${i}`,
         date: `${i*10+35}分钟前`,
         status: 'warning',
         aiConfidence: 80 + Math.floor(Math.random()*8),
         intent: '订单录入',
         attachments: ['订单补充需求.png'],
         content: '由于近期项目加速，需要紧急补充这批零件，详情见截图。另外关于上周的物流情况我们需要再核对。',
         bpMatched: `BP-10044 (Global Source Ltd)`,
         orderStatus: 'draft'
      });
  }
  return mails;
};

const MOCK_MAILS = generateMockMails();

export function MailAutomationModule({ onNavigate }: { onNavigate?: (module: ModuleType) => void }) {
  const [mails, setMails] = useState<any[]>(MOCK_MAILS);
  const [activeTab, setActiveTab] = useState<'queue' | 'settings'>('queue');
  const [selectedMail, setSelectedMail] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'idle'|'success'|'error'>('idle');

  // Config State
  const [configs, setConfigs] = useState([
    {
      id: 1,
      protocol: 'IMAP',
      server: 'imap.enterprise.com',
      port: '993',
      email: 'automation@company.com',
      password: '**************',
      autoSync: true,
      polling: 5,
      manualSync: true,
      whitelist: '@acmecorp.com, @globalsourceltd.com',
      status: 'connected'
    }
  ]);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [isManualSyncOpen, setIsManualSyncOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedMailboxes, setSelectedMailboxes] = useState<number[]>([]);

  const filteredMails = mails.filter(m => 
    m.subject.toLowerCase().includes(searchText.toLowerCase()) || 
    m.sender.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDeleteMail = (e: React.MouseEvent, mail: any) => {
    e.stopPropagation();
    if (mail.orderStatus === 'confirmed') {
      alert("该单据已生效，无法删除相关邮件记录");
      return;
    }
    // Delete mail. In real app, cascading delete logic here.
    setMails(mails.filter(m => m.id !== mail.id));
    if (selectedMail && selectedMail.id === mail.id) {
       setSelectedMail(null);
    }
  };

  const handleManualSync = () => {
     setIsSyncing(true);
     setTimeout(() => {
        setIsSyncing(false);
        setIsManualSyncOpen(false);
        // show success logic if needed
     }, 1500);
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult('idle');
    setTimeout(() => {
      setIsTesting(false);
      setTestResult('success');
    }, 1500);
  };

  const handleSaveConfig = () => {
    if (editingConfig.id) {
       setConfigs(configs.map(c => c.id === editingConfig.id ? { ...editingConfig, status: 'connected' } : c));
    } else {
       setConfigs([...configs, { ...editingConfig, id: Date.now(), status: 'connected' }]);
    }
    setEditingConfig(null);
  };

  const renderConfig = () => (
    <div className="h-full overflow-y-auto w-full p-4 lg:p-6 bg-[#F1F5F9] custom-scrollbar">
      <div className="w-full space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pointer-events-auto">
          <div>
            <h2 className="text-[16px] font-bold tracking-tight text-sap-gray-900 mb-1">邮箱配置中心</h2>
            <p className="text-[11px] text-gray-500">配置企业邮箱账密及服务协议，支持多源通道及邮箱监听清单。</p>
          </div>
          {!editingConfig && (
            <button 
              onClick={() => setEditingConfig({ protocol: 'IMAP', email: '', server: '', port: '993', password: '', autoSync: true, polling: 5, manualSync: true, whitelist: '' })}
              className="flex items-center justify-center gap-1.5 bg-sap-gray-900 text-white px-4 py-2 rounded text-[12px] font-bold shadow-sm hover:bg-sap-blue transition-all shrink-0"
            >
              <Plus size={16} /> 新增邮箱配置
            </button>
          )}
        </div>

        {!editingConfig ? (
          <div className="bg-white rounded border border-[#E2E8F0] shadow-sm overflow-x-auto">
             <table className="w-full text-left border-collapse whitespace-nowrap">
               <thead>
                 <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                   <th className="px-4 tracking-wider h-[40px] text-left align-middle text-[12px] font-bold text-gray-500">序号</th>
                   <th className="px-4 tracking-wider h-[40px] text-left align-middle text-[12px] font-bold text-gray-500">邮箱号</th>
                   <th className="px-4 tracking-wider h-[40px] text-left align-middle text-[12px] font-bold text-gray-500">协议</th>
                   <th className="px-4 tracking-wider h-[40px] text-left align-middle text-[12px] font-bold text-gray-500">同步策略</th>
                   <th className="px-4 tracking-wider h-[40px] text-left align-middle text-[12px] font-bold text-gray-500">连接状态</th>
                   <th className="px-4 tracking-wider h-[40px] text-right align-middle text-[12px] font-bold text-gray-500">操作</th>
                 </tr>
               </thead>
               <tbody>
                  {configs.map((conf, idx) => (
                    <tr key={conf.id} className="border-b border-[#E2E8F0] hover:bg-gray-50/50 transition-colors group h-[48px]">
                      <td className="px-4 text-[13px] font-medium text-gray-500">{idx + 1}</td>
                      <td className="px-4 text-[13px] font-bold text-sap-gray-900 group-hover:text-[#1677FF] transition-colors">{conf.email}</td>
                      <td className="px-4 text-[13px] font-medium text-gray-600">
                         <span className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                           {conf.protocol}
                         </span>
                      </td>
                      <td className="px-4 text-[13px]">
                         <div className="flex items-center gap-2">
                           <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-[4px] flex items-center gap-1.5", conf.autoSync ? "bg-blue-50 text-[#1677FF] border border-blue-100" : "bg-gray-50 text-gray-400 border border-gray-200")}>
                             {conf.autoSync ? <RefreshCw size={10} className="animate-spin-slow" /> : <Shield size={10} />}
                             {conf.autoSync ? `自动巡检 (${conf.polling}m)` : '手动拉取'}
                           </span>
                           {conf.manualSync && (
                             <span className="text-[11px] font-bold px-2 py-0.5 rounded-[4px] bg-emerald-50 text-emerald-600 border border-emerald-100">
                               手工启用
                             </span>
                           )}
                         </div>
                      </td>
                      <td className="px-4">
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-[4px] font-bold text-[11px] border border-emerald-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          服务运行中
                        </span>
                      </td>
                      <td className="px-4 text-right">
                         <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                           <button onClick={() => setEditingConfig(conf)} className="h-7 w-7 flex items-center justify-center border border-[#E2E8F0] text-gray-600 hover:text-sap-blue hover:bg-blue-50 bg-white rounded-[4px] transition-colors" title="编辑">
                             <Edit size={14} />
                           </button>
                           <button onClick={() => setConfigs(configs.filter(c => c.id !== conf.id))} className="h-7 w-7 flex items-center justify-center border border-red-50 text-red-500 hover:bg-red-50 bg-white rounded-[4px] transition-colors" title="删除">
                             <Trash2 size={14} />
                           </button>
                         </div>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>
        ) : (
        <div className="bg-white rounded-[8px] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="bg-[#F8FAFC] px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-sap-blue border border-blue-100">
                <Shield size={16} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-[#1f2329]">连接与凭证设置</h3>
                <p className="text-[11px] text-gray-500">配置基础的网络通信协议与账密凭证</p>
              </div>
            </div>
            <button 
              onClick={() => setEditingConfig(null)}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-600 flex items-center gap-2">
                  <Layers size={13} className="text-gray-400" /> 连接协议
                </label>
                <select 
                  value={editingConfig.protocol}
                  onChange={e => setEditingConfig({...editingConfig, protocol: e.target.value})}
                  className="w-full h-[34px] px-3 bg-[#FAFBFC] border border-[#E2E8F0] rounded-[4px] text-[13px] font-medium focus:bg-white focus:ring-1 focus:ring-sap-blue focus:border-sap-blue outline-none transition-all appearance-none"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1em 1em" }}
                >
                  <option>IMAP</option>
                  <option>POP3</option>
                  <option>Exchange Web Services</option>
                </select>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-gray-600 flex items-center gap-2">
                  <Mail size={13} className="text-gray-400" /> 监听账号邮箱
                </label>
                <input 
                  type="text" 
                  value={editingConfig.email}
                  onChange={e => setEditingConfig({...editingConfig, email: e.target.value})}
                  placeholder="例如: automation@company.com"
                  className="w-full h-[34px] px-3 bg-[#FAFBFC] border border-[#E2E8F0] rounded-[4px] text-[13px] font-medium focus:bg-white focus:ring-1 focus:ring-sap-blue focus:border-sap-blue outline-none transition-all" 
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-gray-600 flex items-center gap-2">
                  <Globe size={13} className="text-gray-400" /> 客服端/服务器地址
                </label>
                <input 
                  type="text" 
                  value={editingConfig.server}
                  onChange={e => setEditingConfig({...editingConfig, server: e.target.value})}
                  placeholder="例如: imap.enterprise.com"
                  className="w-full h-[34px] px-3 bg-[#FAFBFC] border border-[#E2E8F0] rounded-[4px] text-[13px] font-medium focus:bg-white focus:ring-1 focus:ring-sap-blue focus:border-sap-blue outline-none transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-600 flex items-center gap-2">
                  <Zap size={13} className="text-gray-400" /> 通信端口
                </label>
                <input 
                  type="text" 
                  value={editingConfig.port}
                  onChange={e => setEditingConfig({...editingConfig, port: e.target.value})}
                  placeholder="例如: 993"
                  className="w-full h-[34px] px-3 bg-[#FAFBFC] border border-[#E2E8F0] rounded-[4px] text-[13px] font-medium focus:bg-white focus:ring-1 focus:ring-sap-blue focus:border-sap-blue outline-none transition-all" 
                />
              </div>
              <div className="space-y-1.5 md:col-span-3">
                <label className="text-[11px] font-bold text-gray-600 flex items-center gap-2">
                  <Shield size={13} className="text-gray-400" /> 邮箱授权码/密码
                </label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={editingConfig.password}
                    onChange={e => setEditingConfig({...editingConfig, password: e.target.value})}
                    placeholder="请输入授权码"
                    className="w-full h-[34px] px-3 bg-[#FAFBFC] border border-[#E2E8F0] rounded-[4px] text-[13px] font-medium focus:bg-white focus:ring-1 focus:ring-sap-blue focus:border-sap-blue outline-none transition-all font-mono" 
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Shield size={14} />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded text-[11px] text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  数据已被 AES-256 加密。建议使用邮箱“第三方应用授权码”而非登录密码。
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button 
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-4 py-1.5 bg-white border border-[#E2E8F0] text-gray-700 hover:bg-gray-50 text-[12px] font-bold rounded-[4px] transition-all flex items-center gap-2 min-w-[120px] shadow-sm"
              >
                {isTesting ? <RefreshCw className="animate-spin" size={14} /> : <Zap size={14} className="text-amber-500" />}
                {isTesting ? '联通测试中...' : '测试连接联通性'}
              </button>
              {testResult === 'success' && (
                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[11px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-[4px] flex items-center gap-1.5">
                  <CheckCircle size={14} /> 服务器响应正常
                </motion.span>
              )}
            </div>
          </div>

          <div className="bg-[#F8FAFC] px-4 py-3 border-y border-[#E2E8F0] flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100">
              <Settings size={16} />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#1f2329]">同步策略与过滤规则</h3>
              <p className="text-[11px] text-gray-500">定制化邮件收取和过滤的高级策略</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div className="flex items-start justify-between p-4 rounded-[6px] border border-[#E2E8F0] bg-[#FAFBFC] hover:bg-white transition-all">
                  <div className="space-y-1">
                    <label className="text-[13px] font-bold text-[#1f2329] flex items-center gap-2">自动轮询服务</label>
                    <p className="text-[11px] text-gray-500 leading-relaxed max-w-[240px]">后台引擎按设定频次自动拉取新附件，无需人工干预。</p>
                  </div>
                  <button 
                    onClick={() => setEditingConfig({...editingConfig, autoSync: !editingConfig.autoSync})}
                    className={cn("w-[42px] h-[22px] rounded-full relative px-0.5 flex items-center transition-colors duration-200", editingConfig.autoSync ? "bg-[#1677FF]" : "bg-gray-300")}
                  >
                    <div className={cn("w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-200", editingConfig.autoSync ? "translate-x-[20px]" : "translate-x-0")} />
                  </button>
                </div>

                {editingConfig.autoSync && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-4 py-3 bg-blue-50/30 border border-blue-100 rounded-[6px] space-y-2">
                    <label className="text-[11px] font-bold text-blue-700 flex items-center gap-2">
                      <RefreshCw size={12} /> 设置轮询频次
                    </label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        min="1"
                        max="120"
                        value={editingConfig.polling}
                        onChange={e => setEditingConfig({...editingConfig, polling: parseInt(e.target.value) || 1})}
                        className="w-16 h-8 px-2 bg-white border border-[#E2E8F0] rounded text-[13px] text-center font-bold text-sap-blue outline-none" 
                      />
                      <span className="text-[12px] text-gray-500">分钟/次 (建议 5-15 分钟)</span>
                    </div>
                  </motion.div>
                )}

                <div className="flex items-start justify-between p-4 rounded-[6px] border border-[#E2E8F0] bg-[#FAFBFC] hover:bg-white transition-all">
                  <div className="space-y-1">
                    <label className="text-[13px] font-bold text-[#1f2329]">启用手工触发同步</label>
                    <p className="text-[11px] text-gray-500 leading-relaxed max-w-[240px]">允许业务员在操作台点击“立即接收”进行即时增量拉取。</p>
                  </div>
                  <button 
                    onClick={() => setEditingConfig({...editingConfig, manualSync: !editingConfig.manualSync})}
                    className={cn("w-[42px] h-[22px] rounded-full relative px-0.5 flex items-center transition-colors duration-200", editingConfig.manualSync ? "bg-[#1677FF]" : "bg-gray-300")}
                  >
                    <div className={cn("w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-200", editingConfig.manualSync ? "translate-x-[20px]" : "translate-x-0")} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-600 flex items-center gap-2">
                    <Globe size={13} className="text-gray-400" /> 发件域名/邮箱白名单
                  </label>
                  <textarea 
                    value={editingConfig.whitelist}
                    onChange={e => setEditingConfig({...editingConfig, whitelist: e.target.value})}
                    placeholder="支持逗号分隔，如: @acme.com, @global.org&#10;留空则默认匹配所有来源。"
                    className="w-full h-[154px] p-3 bg-[#FAFBFC] border border-[#E2E8F0] rounded-[6px] text-[12px] leading-relaxed text-gray-700 resize-none focus:bg-white focus:ring-1 focus:ring-sap-blue focus:border-sap-blue outline-none transition-all" 
                  />
                  <div className="text-[10px] text-gray-400 bg-gray-50/50 p-2 border border-dashed border-gray-200 rounded">
                    提示：仅白名单内账号的附件会被 AI 接管解析，有效避免垃圾邮件干扰。
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-end gap-3 shrink-0">
            <button 
              onClick={() => setEditingConfig(null)}
              className="px-5 py-[7px] text-[13px] font-medium text-gray-600 hover:text-gray-800 bg-white border border-[#D1D5DB] hover:bg-gray-50 rounded-[4px] transition-all shadow-sm"
            >
              取消
            </button>
            <button 
              onClick={handleSaveConfig}
              className="px-6 py-[7px] bg-[#1677FF] text-white text-[13px] font-bold rounded-[4px] hover:bg-[#0050B3] transition-all shadow-sm flex items-center gap-2"
            >
              <Check size={16} strokeWidth={2.5} /> {editingConfig.id ? "更新配置" : "确认添加配置"}
            </button>
          </div>
        </div>

        )}
      </div>
    </div>
  );

  const renderQueue = () => (
    <div className="flex flex-col h-full bg-[#F1F5F9] overflow-hidden">
      {/* Tool bar */}
      <div className="bg-white border-b border-[#E2E8F0] px-4 lg:px-6 h-[48px] flex items-center justify-between shrink-0 shadow-sm z-10 w-full relative">
        <h2 className="text-[16px] font-bold tracking-tight text-sap-gray-900">邮件处理中心</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索发件人、主题..."
              className="pl-8 pr-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[12px] focus:bg-white focus:border-sap-blue focus:ring-1 focus:ring-sap-blue outline-none w-48 transition-all"
            />
          </div>
          <button 
             onClick={() => setIsManualSyncOpen(true)}
             className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] rounded text-[12px] font-bold text-sap-gray-900 bg-white hover:bg-gray-50 transition-all shrink-0 shadow-sm"
          >
             <RefreshCw size={14} /> <span>手动接收</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
         <div className="w-full pb-12">
           <div className="bg-white rounded border border-[#E2E8F0] shadow-sm overflow-x-auto">
             <table className="w-full text-left border-collapse whitespace-nowrap min-w-[900px]">
               <thead>
                 <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                   <th className="px-4 tracking-wider h-[40px] text-left align-middle text-[12px] font-bold text-gray-500 w-[5%]">序号</th>
                   <th className="px-4 tracking-wider h-[40px] text-left align-middle text-[12px] font-bold text-gray-500 w-[15%]">邮件附件名称</th>
                   <th className="px-4 tracking-wider h-[40px] text-left align-middle text-[12px] font-bold text-gray-500 w-[20%]">邮件标题</th>
                   <th className="px-4 tracking-wider h-[40px] text-left align-middle text-[12px] font-bold text-gray-500 w-[8%]">邮件附件</th>
                   <th className="px-4 tracking-wider h-[40px] text-left align-middle text-[12px] font-bold text-gray-500 w-[15%]">邮箱号</th>
                   <th className="px-4 tracking-wider h-[40px] text-left align-middle text-[12px] font-bold text-gray-500 w-[10%]">处理日期</th>
                   <th className="px-4 tracking-wider h-[40px] text-left align-middle text-[12px] font-bold text-gray-500 w-[8%]">处理时间</th>
                   <th className="px-4 tracking-wider h-[40px] text-center align-middle text-[12px] font-bold text-gray-500 w-[9%]">处理状态</th>
                   <th className="px-4 tracking-wider h-[40px] text-right align-middle text-[12px] font-bold text-gray-500 w-[10%] text-right">操作</th>
                 </tr>
               </thead>
               <tbody>
                  {filteredMails.map((mail, idx) => (
                    <tr key={mail.id} className="border-b border-[#E2E8F0] hover:bg-gray-50/50 transition-colors group h-[40px]">
                      <td className="px-4 text-[13px] font-medium text-gray-500">{idx + 1}</td>
                      <td className="px-4 text-[13px] font-bold text-sap-gray-900 group-hover:text-sap-blue transition-colors truncate max-w-[200px]" title={mail.attachments.join(', ')}>
                         {mail.attachments.length > 0 ? mail.attachments[0] : '--'}
                         {mail.attachments.length > 1 && ` 等${mail.attachments.length}个`}
                      </td>
                      <td className="px-4 text-[13px] text-sap-gray-900 truncate max-w-[250px]" title={mail.subject}>{mail.subject}</td>
                      <td className="px-4 text-[13px] text-gray-600">
                         {mail.attachments.length > 0 ? (
                           <div className="flex gap-1.5 items-center bg-blue-50 px-2 py-0.5 rounded w-fit border border-blue-100">
                             <Paperclip size={12} className="text-sap-blue" />
                             <span className="text-sap-blue text-[11px] font-bold cursor-pointer hover:underline">下载</span>
                           </div>
                         ) : <span className="text-gray-400">--</span>}
                      </td>
                      <td className="px-4 text-[13px] text-gray-500 truncate max-w-[180px]" title={mail.sender}>{mail.sender}</td>
                      <td className="px-4 text-[13px] text-gray-500 font-mono">{mail.dateStr}</td>
                      <td className="px-4 text-[13px] text-gray-500 font-mono">{mail.timeStr}</td>
                      <td className="px-4 text-[13px] text-center">
                         {mail.status === 'warning' && (
                           <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                             异常待核
                           </span>
                         )}
                         {mail.status === 'pending' && (
                           <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-sap-blue border border-blue-200">
                             解析中
                           </span>
                         )}
                         {mail.status === 'filtered' && (
                           <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-gray-50 text-gray-500 border border-gray-200">
                             非业务
                           </span>
                         )}
                      </td>
                      <td className="px-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setSelectedMail(mail)}
                            className="bg-white border text-[11px] border-[#E2E8F0] text-gray-600 hover:text-sap-blue hover:border-sap-blue hover:bg-blue-50 px-2.5 py-1 rounded transition-all shadow-sm flex items-center justify-center gap-1 font-bold"
                          >
                            <ChevronRight size={12} /> 详情
                          </button>
                          <button
                            onClick={(e) => handleDeleteMail(e, mail)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 bg-white border border-[#E2E8F0] p-1 rounded transition-all shadow-sm flex items-center justify-center"
                            title="删除"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
             {filteredMails.length === 0 && (
                <div className="text-center py-12 text-sm text-gray-500">
                   未找到匹配的邮件记录
                </div>
             )}
           </div>
         </div>
      </div>
    </div>
  );

  const renderDetailOverlay = () => {
    if (!selectedMail) return null;
    return (
      <motion.div 
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute inset-0 z-50 bg-white flex flex-col"
      >
        <div className="h-[48px] bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 lg:px-6 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedMail(null)}
              className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
               <h3 className="text-[14px] font-bold text-sap-gray-900">邮件解析详情</h3>
               <p className="text-[10px] text-gray-500 font-bold leading-none mt-1 uppercase tracking-wider">任务 ID: {selectedMail.id.toUpperCase()}-X01</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="px-4 py-1.5 border border-[#E2E8F0] text-sap-gray-900 font-bold text-[12px] rounded hover:bg-gray-50 transition-colors">
               重新萃取解析
             </button>
             <button 
               className="px-4 py-1.5 bg-sap-blue text-white font-bold text-[12px] rounded hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
               onClick={() => {
                 if (onNavigate) {
                   onNavigate('sales-entry');
                 }
               }}
             >
               <Check size={14} strokeWidth={3} /> 抽取建单
             </button>
          </div>
        </div>

        <div className="flex-1 flex bg-[#F1F5F9] min-h-0 relative">
           {/* Left */}
           <div 
             className="w-1/2 flex flex-col h-full bg-white border-r border-[#E2E8F0] relative z-0 overflow-y-auto"
           >
             <div className="p-4 lg:p-6 border-b border-[#E2E8F0] shrink-0">
               <h2 className="text-[16px] font-bold text-sap-gray-900 mb-4">{selectedMail.subject}</h2>
               <div className="flex flex-wrap items-center gap-3 text-[12px]">
                 <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[14px] shrink-0 border border-indigo-100">
                   {selectedMail.sender.charAt(0).toUpperCase()}
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="font-bold text-sap-gray-900 text-[13px] truncate flex items-center gap-2">{selectedMail.sender} <span className="font-normal text-gray-500 text-[10px] whitespace-nowrap bg-gray-50 px-1.5 py-0.5 border border-[#E2E8F0] rounded">{selectedMail.date}</span></div>
                   <div className="text-[11px] text-gray-500 truncate mt-0.5">接收于: {selectedMail.dateStr} {selectedMail.timeStr}</div>
                 </div>
               </div>
             </div>
             <div className="p-4 lg:p-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed bg-gray-50 p-4 rounded border border-[#E2E8F0]">
                  {selectedMail.content.split('\n').map((line: string, i: number) => (
                    <p key={i} className="min-h-[1.5em]">{line}</p>
                  ))}
                </div>

                {selectedMail.attachments.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase mb-3 tracking-wider flex items-center gap-2">
                      <Paperclip size={12} /> 发现业务附件 ({selectedMail.attachments.length})
                    </h4>
                    <div className="grid grid-cols-1 gap-2 border border-[#E2E8F0] p-2 bg-gray-50 rounded">
                      {selectedMail.attachments.map((att: string, i: number) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-white border border-[#E2E8F0] rounded group cursor-pointer hover:border-sap-blue/40 hover:shadow-sm transition-all">
                           <div className="flex items-center gap-3 overflow-hidden min-w-0">
                             <div className="p-1.5 bg-gray-50 rounded border border-[#E2E8F0] text-sap-blue shrink-0">
                               <FileText size={16} />
                             </div>
                             <span className="text-[12px] font-bold text-sap-gray-900 group-hover:text-sap-blue truncate">{att}</span>
                           </div>
                           <Download size={14} className="text-gray-400 group-hover:text-sap-blue transition-colors shrink-0 mr-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
             </div>
           </div>

           {/* Right: AI Parsing Result Form (Simulated) */}
           <div 
             className="w-1/2 flex flex-col h-full bg-[#FAFBFC] custom-scrollbar overflow-y-auto relative p-4 lg:p-6"
           >
              <div className="mb-6 flex items-center justify-between">
                <div>
                   <h3 className="text-[14px] font-bold text-sap-gray-900 flex items-center gap-2">
                     <Layers size={16} className="text-sap-blue" />
                     业务结构化抽取视图
                   </h3>
                   <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1.5 border border-[#E2E8F0] bg-white px-2 py-0.5 rounded shadow-sm inline-flex">基于 <span className="text-sap-blue font-bold">Gemini Pro</span> 引擎解析</p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded flex items-center gap-1.5 border shadow-sm",
                  selectedMail.status === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                )}>
                  {selectedMail.status === 'warning' ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                  <span className="text-[11px] font-bold font-mono tracking-wider">置信度: {selectedMail.aiConfidence}%</span>
                </div>
              </div>

              {/* Data Blocks */}
              <div className="space-y-6">
                 <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm">
                   <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5 border-b border-gray-50 pb-3">自动匹配业务主数据</div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500 flex items-center gap-1"><CheckCircle size={12} className="text-emerald-500" /> 匹配 SAP BP 商户</div>
                        <div className="text-sm font-bold text-[#1f2329] bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl flex items-center justify-between">
                          <span>{selectedMail.bpMatched || '--'}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500 flex items-center gap-1"><CheckCircle size={12} className="text-emerald-500" /> 识别核心意图</div>
                        <div className="text-sm font-bold text-[#1f2329] bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl">
                          {selectedMail.intent}
                        </div>
                      </div>
                   </div>
                 </div>

                 {selectedMail.status !== 'filtered' && (
                   <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm">
                     <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5 border-b border-gray-50 pb-3 flex items-center justify-between">
                        <span>明细材料智能抽取与预填充</span>
                     </div>
                     <div className="grid grid-cols-1 gap-4">
                        <div className="border border-sap-blue/20 rounded-xl p-8 bg-sap-blue/5 overflow-hidden relative group">
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                           <div className="text-center flex flex-col items-center justify-center">
                              <SparklesIcon className="mx-auto text-sap-blue mb-4" size={32} />
                              <p className="text-[16px] font-bold text-sap-blue tracking-wide mb-2">已从附件中萃取出 12 项业务要素</p>
                              <p className="text-xs text-gray-500 max-w-xs">AI 根据邮件附件上下文及过往模板，自动对应 SAP 业务对象字段。</p>
                           </div>
                        </div>
                     </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden h-full relative">
      <div className="bg-white border-b border-[#E2E8F0] px-4 lg:px-6 h-[52px] shrink-0 z-20 relative flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[6px] bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] border border-[#E0E7FF]">
            <Globe size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-[#1f2329] tracking-tight leading-none">邮件自动化中心</h1>
            <p className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-[0.05em] flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
              多源邮件智能监听提取与业务中台自动化
            </p>
          </div>
        </div>
        <div>
          <button 
            onClick={() => onNavigate?.('home')}
            className="flex items-center gap-1.5 px-3 py-[6px] bg-white border border-[#D1D5DB] hover:bg-gray-50 text-[12px] font-bold text-gray-700 rounded-[4px] transition-all shadow-sm"
          >
            <ArrowLeft size={14} /> 返回驾驶舱中心
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white border-b border-[#E2E8F0] flex items-center px-4 lg:px-6 gap-2 h-[40px] shrink-0 z-10 relative">
        <button
          onClick={() => setActiveTab('queue')}
          className={cn(
            "h-full px-4 text-[13px] font-bold transition-colors relative flex items-center justify-center",
            activeTab === 'queue' ? "text-sap-blue" : "text-gray-500 hover:text-sap-gray-900"
          )}
        >
          邮件处理中心
          {activeTab === 'queue' && (
            <motion.div layoutId="mailTabIndicator" className="absolute bottom-0 left-0 right-0 h-[3px] bg-sap-blue" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={cn(
            "h-full px-4 text-[13px] font-bold transition-colors relative flex items-center justify-center",
            activeTab === 'settings' ? "text-sap-blue" : "text-gray-500 hover:text-sap-gray-900"
          )}
        >
          邮箱配置中心
          {activeTab === 'settings' && (
            <motion.div layoutId="mailTabIndicator" className="absolute bottom-0 left-0 right-0 h-[3px] bg-sap-blue" />
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'queue' ? (
            <motion.div key="queue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
               {renderQueue()}
            </motion.div>
          ) : (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
               {renderConfig()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay detail */}
      <AnimatePresence>
        {selectedMail && renderDetailOverlay()}
        
        {isManualSyncOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2329]/50 backdrop-blur-[2px]"
          >
            <motion.div 
              initial={{ scale: 0.98, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 10 }}
              className="bg-white rounded-[12px] w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100"
            >
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-[#F8FAFC]">
                 <h3 className="text-[14px] font-bold text-[#1f2329] flex items-center gap-2">
                   <div className="p-1 rounded bg-blue-50 border border-blue-100">
                     <RefreshCw className="text-[#1677FF]" size={14} />
                   </div>
                   即时增量同步
                 </h3>
                 <button 
                   onClick={() => setIsManualSyncOpen(false)}
                   className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                 >
                    <X size={16} />
                 </button>
              </div>

              <div className="p-5">
                 <div className="mb-4">
                    <p className="text-[13px] font-bold text-[#1f2329]">选择同步目标</p>
                    <p className="text-[11px] text-gray-500 mt-1">系统将对选中的活跃凭证进行 RFC 增量拉取</p>
                 </div>
                 <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 flex flex-col">
                    {configs.length === 0 ? (
                      <div className="py-8 text-center bg-gray-50 rounded border border-dashed border-gray-200">
                        <Inbox size={24} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-[11px] text-gray-400">暂无有效配置</p>
                      </div>
                    ) : configs.map(conf => (
                      <div 
                        key={conf.id} 
                        className={cn(
                          "flex items-center justify-between px-4 py-3 rounded-[6px] border transition-all select-none",
                          conf.manualSync ? "cursor-pointer group hover:border-[#1677FF]/40 bg-white" : "opacity-50 bg-gray-50 border-gray-100 cursor-not-allowed",
                          selectedMailboxes.includes(conf.id) && conf.manualSync ? "border-[#1677FF] bg-[#F0F7FF]" : "border-gray-200"
                        )}
                        onClick={() => {
                           if (!conf.manualSync) return;
                           setSelectedMailboxes(prev => 
                             prev.includes(conf.id) ? prev.filter(id => id !== conf.id) : [...prev, conf.id]
                           );
                        }}
                      >
                         <div className="flex items-center gap-3">
                           <div className={cn(
                             "w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all",
                             selectedMailboxes.includes(conf.id) ? "bg-[#1677FF] border-[#1677FF] text-white" : "border-[#D1D5DB] bg-white group-hover:border-[#1677FF]",
                             !conf.manualSync && "bg-gray-100 border-gray-200"
                           )}>
                             {selectedMailboxes.includes(conf.id) && <Check size={12} strokeWidth={3} />}
                           </div>
                           <div className="flex flex-col">
                             <span className={cn("text-[13px] font-bold", conf.manualSync ? "text-[#1f2329]" : "text-gray-400")}>{conf.email}</span>
                             <span className="text-[10px] text-gray-500 font-medium">协议: {conf.protocol} {conf.autoSync ? `• 轮询: ${conf.polling}min` : ''}</span>
                           </div>
                         </div>
                         {!conf.manualSync && (
                           <span className="text-[9px] bg-red-50 text-red-500 font-black px-1.5 py-0.5 rounded border border-red-100 uppercase">Blocked</span>
                         )}
                      </div>
                    ))}
                 </div>
              </div>

              <div className="px-5 py-4 bg-[#F8FAFC] border-t border-gray-100 flex items-center justify-end gap-3">
                 <button 
                   onClick={() => setIsManualSyncOpen(false)}
                   className="px-4 py-1.5 text-[12px] font-bold text-gray-600 hover:text-gray-800 bg-white border border-[#D1D5DB] hover:bg-gray-50 rounded-[4px] transition-all"
                 >
                   取消
                 </button>
                 <button 
                   disabled={selectedMailboxes.length === 0 || isSyncing}
                   onClick={handleManualSync}
                   className="px-6 py-1.5 text-[12px] font-bold text-white bg-[#1677FF] hover:bg-[#0050B3] disabled:opacity-50 disabled:cursor-not-allowed rounded-[4px] transition-all shadow-sm flex items-center gap-2"
                 >
                   {isSyncing ? <RefreshCw className="animate-spin" size={14} /> : <Zap size={14} />}
                   {isSyncing ? '同步处理中...' : '启动增量同步'}
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sparkles icon substitute since it's not imported directly above in the main group
const SparklesIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" />
    <path d="M22 5h-4" />
    <path d="M4 17v2" />
    <path d="M5 18H3" />
  </svg>
);
