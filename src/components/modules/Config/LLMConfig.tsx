import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings,
  HelpCircle,
  Plus,
  Bot
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '../../ui/Button';
import { useModel } from '@/src/contexts/ModelContext';

interface AIModel {
  id: string;
  name: string;
}

interface ModelProvider {
  id: string;
  name: string;
  icon: string | React.ElementType;
  tags: string[];
  models: AIModel[];
  description?: string;
}

const LLM_PROVIDERS: ModelProvider[] = [
  {
    id: 'OpenAI',
    name: 'OpenAI',
    icon: 'https://openai.com/favicon.ico',
    tags: ['LLM', 'TEXT EMBEDDING', 'SPEECH2TEXT', 'MODERATION', 'TTS'],
    models: [
      { id: 'gpt-4', name: 'GPT-4' },
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'text-embedding-3-small', name: 'text-embedding-3-small' },
      { id: 'whisper-1', name: 'whisper-1' },
      { id: 'tts-1-hd', name: 'tts-1-hd' },
    ]
  },
  {
    id: 'Anthropic',
    name: 'ANTHROP\\C',
    icon: 'https://www.anthropic.com/favicon.ico',
    tags: ['LLM'],
    models: [
      { id: 'claude-3-opus', name: 'Claude 3 Opus' },
      { id: 'claude-3-sonnet', name: 'Claude 3.5 Sonnet' },
    ]
  },
  {
    id: 'Cohere',
    name: 'cohere',
    icon: 'https://cohere.com/favicon.ico',
    tags: ['LLM', 'TEXT EMBEDDING', 'RERANK'],
    models: [
      { id: 'command-r-plus', name: 'Command R+' },
      { id: 'embed-multilingual', name: 'embed-multilingual' },
      { id: 'rerank-english-v2.0', name: 'rerank-english-v2.0' },
    ]
  }
];

const MORE_PROVIDERS: ModelProvider[] = [
  {
    id: 'Azure',
    name: 'Azure OpenAI Service',
    icon: 'https://azure.microsoft.com/favicon.ico',
    tags: ['LLM', 'TEXT EMBEDDING', 'SPEECH2TEXT', 'TTS'],
    models: [],
    description: '微软提供的云端 OpenAI 服务'
  },
  {
    id: 'Gemini',
    name: 'Gemini',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/120px-Google_Gemini_logo.svg.png',
    tags: ['LLM'],
    models: [],
    description: '谷歌提供的 Gemini 模型。'
  },
  {
    id: 'VertexAI',
    name: 'Vertex AI',
    icon: 'https://cloud.google.com/favicon.ico',
    tags: ['LLM', 'TEXT EMBEDDING'],
    models: [],
    description: 'Vertex AI in Google Cloud Platform.'
  },
  {
    id: 'NVIDIA',
    name: 'NVIDIA',
    icon: 'https://www.nvidia.com/favicon.ico',
    tags: ['LLM', 'TEXT EMBEDDING', 'RERANK'],
    models: [],
    description: 'NVIDIA NIM.'
  },
  {
    id: 'Bedrock',
    name: 'Bedrock',
    icon: 'https://aws.amazon.com/favicon.ico',
    tags: ['LLM', 'TEXT EMBEDDING'],
    models: [],
    description: 'AWS Bedrock managed service.'
  }
];

export function LLMConfig() {
  const { systemModels, setSystemModels } = useModel();
  const [showSystemConfig, setShowSystemConfig] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden font-sans relative">
      <div className="p-8 h-full overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-bold text-gray-800 mb-6">模型供应商</h2>
        
        <div className="max-w-4xl space-y-8">
          
          {/* Main Providers Section */}
          <div>
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-700">模型列表</h3>
                
                {/* System Model Settings Button & Popover anchor */}
                <div className="relative">
                  <Button 
                    onClick={() => setShowSystemConfig(!showSystemConfig)}
                    variant="outline" 
                    className="h-8 text-xs font-semibold px-3 text-gray-600 border-gray-300 hover:bg-gray-50 flex items-center gap-1.5"
                  >
                    <Settings size={14} />
                    系统模型设置
                  </Button>
                  
                  {/* System Modal Popover */}
                  <AnimatePresence>
                    {showSystemConfig && (
                      <>
                        {/* Overlay to close popover */}
                        <div className="fixed inset-0 z-40" onClick={() => setShowSystemConfig(false)} />
                        
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-80 bg-white shadow-2xl rounded-xl border border-gray-100 z-50 overflow-hidden"
                        >
                          <div className="p-5 space-y-4">
                             <SelectField 
                               label="系统推理模型" 
                               value={systemModels.inference}
                               options={LLM_PROVIDERS.flatMap(p => p.models).map(m => ({ label: m.name, value: m.id }))}
                               onChange={(val) => setSystemModels({...systemModels, inference: val})}
                               isChat
                             />
                             <SelectField 
                               label="Embedding 模型" 
                               value={systemModels.embedding}
                               options={LLM_PROVIDERS.flatMap(p => p.models).map(m => ({ label: m.name, value: m.id }))}
                               onChange={(val) => setSystemModels({...systemModels, embedding: val})}
                             />
                             <SelectField 
                               label="Rerank 模型" 
                               value={systemModels.rerank}
                               options={LLM_PROVIDERS.flatMap(p => p.models).map(m => ({ label: m.name, value: m.id }))}
                               onChange={(val) => setSystemModels({...systemModels, rerank: val})}
                             />
                             <SelectField 
                               label="语音转文本模型" 
                               value={systemModels.speech2text}
                               options={LLM_PROVIDERS.flatMap(p => p.models).map(m => ({ label: m.name, value: m.id }))}
                               onChange={(val) => setSystemModels({...systemModels, speech2text: val})}
                             />
                             <SelectField 
                               label="文本转语音模型" 
                               value={systemModels.tts}
                               options={LLM_PROVIDERS.flatMap(p => p.models).map(m => ({ label: m.name, value: m.id }))}
                               onChange={(val) => setSystemModels({...systemModels, tts: val})}
                             />
                          </div>
                          
                          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
                             <Button size="sm" variant="outline" className="h-8 text-xs font-semibold px-4 text-gray-600 bg-white" onClick={() => setShowSystemConfig(false)}>取消</Button>
                             <Button size="sm" className="h-8 text-xs font-semibold px-4 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowSystemConfig(false)}>保存</Button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
             </div>

             <div className="space-y-4">
                {LLM_PROVIDERS.map(provider => (
                  <div key={provider.id} className="border border-gray-200 rounded-xl bg-gray-50/50 overflow-hidden">
                     <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white">
                        <div className="space-y-2">
                           <div className="flex items-center gap-2">
                              {typeof provider.icon === 'string' ? (
                                <img src={provider.icon} alt="" className="w-5 h-5 object-contain" onError={(e) => (e.target as HTMLImageElement).style.display='none'} />
                              ) : null}
                              <h4 className="text-xl font-bold font-serif tracking-tight text-gray-800">{provider.name}</h4>
                           </div>
                           <div className="flex flex-wrap gap-1.5">
                              {provider.tags.map(tag => (
                                <span key={tag} className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase">{tag}</span>
                              ))}
                           </div>
                        </div>
                     </div>
                     <div className="px-4 py-2.5 bg-gray-50/80 hover:bg-gray-100/80 transition-colors cursor-pointer text-sm font-semibold text-gray-600">
                        显示模型
                     </div>
                  </div>
                ))}
             </div>
          </div>
          
          {/* Add More Providers */}
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-4 divider">
              <span className="text-gray-400">+ 添加更多模型提供商</span>
              <div className="flex-1 h-px bg-gray-200 ml-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {MORE_PROVIDERS.map(provider => (
                  <div key={provider.id} className="border border-gray-200 rounded-xl p-4 bg-white hover:border-blue-400 transition-colors cursor-pointer group flex flex-col justify-between min-h-[140px]">
                     <div>
                        <div className="flex items-center gap-2 mb-2">
                           {typeof provider.icon === 'string' ? (
                             <img src={provider.icon} alt="" className="w-5 h-5 object-contain" onError={(e) => (e.target as HTMLImageElement).style.display='none'} />
                           ) : null}
                           <h5 className="font-bold text-gray-800">{provider.name}</h5>
                        </div>
                        {provider.description && (
                          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{provider.description}</p>
                        )}
                     </div>
                     <div className="flex flex-wrap gap-1">
                        {provider.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-bold bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded uppercase">{tag}</span>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

// ----------------

function SelectField({ 
  label, 
  value, 
  options, 
  onChange,
  isChat = false
}: { 
  label: string, 
  value: string, 
  options: {label: string, value: string}[],
  onChange: (v: string) => void,
  isChat?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
       <div className="flex items-center gap-1">
          <label className="text-[13px] font-bold text-gray-700">{label}</label>
          <HelpCircle size={12} className="text-gray-400 cursor-help" />
       </div>
       <div className="relative">
          {/* Simplified mock dropdown */}
          <select 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-[36px] bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-8 text-[13px] font-medium text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
          >
             {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
             ))}
          </select>
          {isChat && (
             <div className="absolute right-8 top-1/2 -translate-y-1/2">
                <span className="text-[9px] font-bold bg-[#EBF5FF] text-[#1D4ED8] px-1.5 py-0.5 border border-[#BFDBFE] rounded uppercase tracking-wider">CHAT</span>
             </div>
          )}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none w-[18px] h-[18px] bg-green-100 rounded flex items-center justify-center mr-2">
            <Bot size={12} className="text-green-600" />
          </div>
       </div>
    </div>
  );
}
