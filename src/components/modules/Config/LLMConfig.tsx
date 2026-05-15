import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  Layers,
  ChevronDown,
  Save,
  X,
  Sliders,
  Type,
  ShieldCheck,
  Globe,
  Database,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '../../ui/Button';
import { useModel } from '@/src/contexts/ModelContext';

interface ModelProvider {
  id: string;
  name: string;
  icon: string | React.ElementType;
  availableModels: string[];
  type: 'Global' | 'Custom';
}

const LLM_PROVIDERS: ModelProvider[] = [
  {
    id: 'Gemini',
    name: 'Gemini',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/120px-Google_Gemini_logo.svg.png',
    availableModels: ['Gemini 3.1 Pro', 'Gemini 3.0 Flash'],
    type: 'Global'
  },
  {
    id: 'OpenAI',
    name: 'OpenAI',
    icon: 'https://openai.com/favicon.ico',
    availableModels: ['GPT-4o', 'GPT-4-Turbo', 'GPT-3.5-Turbo'],
    type: 'Global'
  },
  {
    id: 'Anthropic',
    name: 'Anthropic',
    icon: 'https://www.anthropic.com/favicon.ico',
    availableModels: ['Claude 3.5 Sonnet', 'Claude 3 Opus', 'Claude 3 Haiku'],
    type: 'Global'
  },
  {
    id: 'ZhipuAI',
    name: '智谱 AI',
    icon: Cpu,
    availableModels: ['GLM-4', 'GLM-4-Air', 'GLM-3-Turbo'],
    type: 'Custom'
  },
];

export function LLMConfig() {
  const { defaultProvider, activeModel, setDefaultProvider, setActiveModelForProvider, providerConfigs } = useModel();
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ModelProvider | null>(null);
  const [toasts, setToasts] = useState<{ id: number, type: 'success' | 'warning', message: string }[]>([]);

  const addToast = (type: 'success' | 'warning', message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const currentProviderData = LLM_PROVIDERS.find(p => p.id === defaultProvider) || LLM_PROVIDERS[0];

  const handleSetConfig = (provider: ModelProvider) => {
    if (providerConfigs[provider.id] && provider.id !== 'Gemini' && provider.id !== 'OpenAI') {
        // Mock duplicate check for demo
        // In a real app we'd check against a user-configured list
    }
    setSelectedProvider(provider);
    setShowConfigModal(true);
  };

  const handleSaveConfig = (configs: any) => {
    // Duplicate check logic
    if (selectedProvider && providerConfigs[selectedProvider.id] && selectedProvider.id !== defaultProvider) {
       // addToast('warning', '该厂商配置已存在，请直接编辑');
       // return;
    }

    addToast('success', `${selectedProvider?.name} 配置保存成功`);
    setShowConfigModal(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#2E2E2E] overflow-hidden font-sans">
      {/* Upper Section: Current Active Model */}
      <div className="p-8 border-b border-white/5 space-y-6">
        <div className="flex items-center justify-between">
           <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">当前生效大模型</h4>
           <div className="flex items-center gap-2 px-3 py-1 bg-[#28A745]/10 border border-[#28A745]/30 rounded-full">
              <span className="w-1.5 h-1.5 bg-[#28A745] rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-[#28A745] uppercase">运行中 • 实时同步</span>
           </div>
        </div>

        <motion.div 
          layoutId="active-card"
          className="bg-white border-b border-gray-100 p-6 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 overflow-hidden p-2">
                {typeof currentProviderData.icon === 'string' ? (
                  <img 
                    src={currentProviderData.icon} 
                    alt="" 
                    className="w-full h-full object-contain" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      // Note: We can't easily swap to a Lucide component here inside an img tag
                      // In a real app we'd use a state variable, but for this quick fix
                      // we'll just hide the broken img and let the container style show
                    }}
                  />
                ) : (
                  <currentProviderData.icon className="w-8 h-8 text-gray-400" />
                )}
             </div>
             <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <h3 className="text-xl font-bold text-white tracking-tight">{currentProviderData.name}</h3>
                   <span className="text-[9px] font-black bg-[#28A745] text-white px-2 py-0.5 rounded uppercase">Default</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">当前大模型:</span>
                    <select 
                      value={activeModel}
                      onChange={(e) => setActiveModelForProvider(defaultProvider, e.target.value)}
                      className="bg-transparent text-xs font-bold text-sap-blue border-none focus:ring-0 outline-none p-0 cursor-pointer"
                    >
                      {currentProviderData.availableModels.map(m => (
                        <option key={m} value={m} className="bg-[#1A2B3C]">{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
             </div>
          </div>

          <Button 
            variant="outline" 
            className="border-[#28A745] text-[#28A745] hover:bg-[#28A745] hover:text-white transition-all px-8 rounded-xl font-bold"
            leftIcon={<CheckCircle2 size={16} />}
          >
            默认
          </Button>
        </motion.div>
      </div>

      {/* Lower Section: Backup Providers */}
      <div className="flex-1 overflow-auto p-8 custom-scrollbar space-y-6">
         <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">备用厂商列表</h4>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LLM_PROVIDERS.filter(p => p.id !== defaultProvider).map((provider) => (
              <motion.div
                key={provider.id}
                whileHover={{ y: -4 }}
                className="bg-[#1A2B3C] rounded-2xl p-5 border border-white/5 hover:border-sap-blue/30 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                        {typeof provider.icon === 'string' ? (
                          <img src={provider.icon} alt="" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                        ) : (
                          <provider.icon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-sm">{provider.name}</h5>
                        <p className="text-[10px] text-gray-500 font-medium">{provider.type} Provider</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="text-[10px] font-black text-gray-600 block mb-1">CAPABILITY</span>
                      <div className="flex gap-1 justify-end">
                         <span className="w-1.5 h-1.5 rounded-full bg-sap-blue shadow-[0_0_8px_#3498db]" />
                         <span className="w-1.5 h-1.5 rounded-full bg-sap-blue shadow-[0_0_8px_#3498db]" />
                         <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-black/10 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">可用模型</p>
                    <p className="text-xs text-gray-300 truncate">{provider.availableModels.join(', ')}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={() => handleSetConfig(provider)}
                      variant="ghost" 
                      className="flex-1 bg-white/5 text-xs text-gray-300 hover:bg-white/10 hover:text-white rounded-xl py-2"
                      leftIcon={<Plus size={14} />}
                    >
                      新增配置
                    </Button>
                    <Button 
                      onClick={() => {
                        setDefaultProvider(provider.id);
                        addToast('success', `默认模型已切换为 ${provider.name}`);
                      }}
                      variant="ghost"
                      className="px-3 bg-[#28A745]/10 text-[#28A745] hover:bg-[#28A745] hover:text-white rounded-xl py-2 text-[10px] font-bold whitespace-nowrap"
                    >
                      设置为默认
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
         </div>
      </div>

      {/* Modal & Toast Overlays */}
      <AnimatePresence>
        {showConfigModal && selectedProvider && (
           <ConfigModal 
             provider={selectedProvider} 
             onClose={() => setShowConfigModal(false)}
             onSave={handleSaveConfig}
             onWarning={(msg) => addToast('warning', msg)}
           />
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3">
         <AnimatePresence>
            {toasts.map(toast => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={cn(
                  "px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border backdrop-blur-md",
                  toast.type === 'success' 
                    ? "bg-[#28A745] border-[#28A745] text-white" 
                    : "bg-[#FD7E14] border-[#FD7E14] text-white"
                )}
              >
                {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span className="text-sm font-bold">{toast.message}</span>
              </motion.div>
            ))}
         </AnimatePresence>
      </div>
    </div>
  );
}

function ConfigModal({ provider, onClose, onSave, onWarning }: { 
    provider: ModelProvider, 
    onClose: () => void, 
    onSave: (data: any) => void,
    onWarning: (msg: string) => void
}) {
  const [formData, setFormData] = useState({
    name: provider.name + ' 配置-01',
    apiKey: '••••••••••••••••',
    baseUrl: provider.id === 'Gemini' ? 'https://generativelanguage.googleapis.com' : 'https://api.openai.com/v1',
    temperature: 1.0,
    maxTokens: 2048,
    topP: 0.95,
    // Specialized fields
    projectId: 'sap-core-ai-998',
    region: 'us-central1',
    orgId: '',
    version: '2024-05-13'
  });

  const handleSave = () => {
    // Duplicate check simulation
    if (formData.name.includes('存在')) {
       onWarning('该厂商配置已存在，请直接编辑');
       return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#1A2B3C] w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-black/10">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                {typeof provider.icon === 'string' ? (
                  <img src={provider.icon} alt="" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <provider.icon className="w-6 h-6 text-sap-blue" />
                )}
              </div>
              <div>
                 <h4 className="text-lg font-bold text-white tracking-tight">新增 {provider.name} 配置</h4>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">智能参数详表 • 自动适配字段</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
              <X size={20} />
           </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-gradient-to-b from-[#1A2B3C] to-[#121c27]">
           {/* General Fields */}
           <div className="grid grid-cols-2 gap-6">
              <FormGroup label="接入点名称" required>
                 <div className="flex items-center gap-2 px-4 py-3 bg-black/20 border border-white/5 rounded-xl text-white text-sm font-medium focus-within:border-sap-blue/50 transition-all">
                    <Type size={14} className="text-gray-500" />
                    <input 
                      className="bg-transparent border-none focus:ring-0 w-full outline-none" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
              </FormGroup>
              <FormGroup label="API 地址 (Base URL)" required>
                 <div className="flex items-center gap-2 px-4 py-3 bg-black/20 border border-white/5 rounded-xl text-white text-sm font-medium focus-within:border-sap-blue/50 transition-all">
                    <Globe size={14} className="text-gray-500" />
                    <input 
                      className="bg-transparent border-none focus:ring-0 w-full outline-none" 
                      value={formData.baseUrl}
                      onChange={(e) => setFormData({...formData, baseUrl: e.target.value})}
                    />
                 </div>
              </FormGroup>
              <div className="col-span-2">
                 <FormGroup label="API 密钥 (API KEY)" required>
                    <div className="flex items-center gap-2 px-4 py-3 bg-black/20 border border-white/5 rounded-xl text-white text-sm font-medium focus-within:border-sap-blue/50 transition-all">
                       <ShieldCheck size={14} className="text-gray-500" />
                       <input 
                        type="password" 
                        className="bg-transparent border-none focus:ring-0 w-full outline-none tracking-widest" 
                        value={formData.apiKey}
                        onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                       />
                    </div>
                 </FormGroup>
              </div>
           </div>

           {/* Specialized Fields */}
           <div className="pt-6 border-t border-white/5">
              <h5 className="text-[10px] font-black text-sap-blue uppercase tracking-widest mb-4 flex items-center gap-2">
                <Settings size={12} /> {provider.name} 专有配置项
              </h5>
              <div className="grid grid-cols-2 gap-6">
                 {provider.id === 'Gemini' && (
                    <>
                      <FormGroup label="项目 ID (Project ID)">
                         <input 
                           className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl text-white text-sm focus:border-sap-blue/50 outline-none" 
                           value={formData.projectId}
                           onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                         />
                      </FormGroup>
                      <FormGroup label="区域 (Region)">
                         <input 
                           className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl text-white text-sm focus:border-sap-blue/50 outline-none" 
                           value={formData.region}
                           onChange={(e) => setFormData({...formData, region: e.target.value})}
                         />
                      </FormGroup>
                    </>
                 )}
                 {provider.id === 'OpenAI' && (
                    <>
                      <FormGroup label="组织 ID (Org ID)">
                         <input 
                           className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl text-white text-sm focus:border-sap-blue/50 outline-none" 
                           value={formData.orgId}
                           onChange={(e) => setFormData({...formData, orgId: e.target.value})}
                         />
                      </FormGroup>
                      <FormGroup label="模型版本号">
                         <input 
                           className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl text-white text-sm focus:border-sap-blue/50 outline-none" 
                           value={formData.version}
                           onChange={(e) => setFormData({...formData, version: e.target.value})}
                         />
                      </FormGroup>
                    </>
                 )}
                 <FormGroup label="安全性过滤等级">
                    <select className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl text-white text-sm outline-none focus:border-sap-blue/50">
                       <option className="bg-[#1A2B3C]">标准模式</option>
                       <option className="bg-[#1A2B3C]">宽松模式</option>
                       <option className="bg-[#1A2B3C]">严谨模式</option>
                    </select>
                 </FormGroup>
              </div>
           </div>

           {/* Parameters */}
           <div className="pt-6 border-t border-white/5">
              <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sliders size={12} /> 共有调节参数
              </h5>
              <div className="space-y-6">
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[11px] font-bold text-gray-400">温度值 (Temperature)</label>
                       <span className="text-xs font-mono text-sap-blue">{formData.temperature.toFixed(1)}</span>
                    </div>
                    <input 
                      type="range" min="0" max="2" step="0.1" 
                      value={formData.temperature} 
                      onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value)})}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sap-blue" 
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <div className="flex justify-between items-center">
                          <label className="text-[11px] font-bold text-gray-400">最大 Token 数</label>
                          <span className="text-xs font-mono text-sap-blue">{formData.maxTokens}</span>
                       </div>
                       <input 
                        type="range" min="512" max="8192" step="128" 
                        value={formData.maxTokens} 
                        onChange={(e) => setFormData({...formData, maxTokens: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sap-blue" 
                       />
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center">
                          <label className="text-[11px] font-bold text-gray-400">核采样 (Top P)</label>
                          <span className="text-xs font-mono text-sap-blue">{formData.topP.toFixed(2)}</span>
                       </div>
                       <input 
                        type="range" min="0" max="1" step="0.05" 
                        value={formData.topP} 
                        onChange={(e) => setFormData({...formData, topP: parseFloat(e.target.value)})}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sap-blue" 
                       />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Modal Footer */}
        <div className="p-8 border-t border-white/5 flex items-center justify-end bg-black/10 gap-3">
           <Button onClick={onClose} variant="ghost" className="text-gray-400 font-bold px-6">取消</Button>
           <Button onClick={handleSave} className="bg-sap-blue text-white shadow-xl shadow-sap-blue/20 font-bold px-10 rounded-xl" leftIcon={<Save size={16} />}>
             保存配置
           </Button>
        </div>
      </motion.div>
    </div>
  );
}

function FormGroup({ label, children, required }: { label: string, children: React.ReactNode, required?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
        {label} {required && <span className="text-[#FD7E14]">*</span>}
      </label>
      {children}
    </div>
  );
}
