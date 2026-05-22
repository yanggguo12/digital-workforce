import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Image as ImageIcon, Music, Download, ExternalLink, Paperclip } from 'lucide-react';
import { Button } from './Button';

interface AttachmentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  attachments: string[];
  orderId?: string;
}

export function AttachmentViewer({ isOpen, onClose, attachments, orderId }: AttachmentViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedAttachments, setLoadedAttachments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    const loadPersisted = async () => {
      // If we have an order ID, try to load its real uploaded files from IndexedDB
      if (orderId) {
        setLoading(true);
        try {
          const { AttachmentStore } = await import('../../lib/attachmentDb');
          const saved = await AttachmentStore.get(orderId);
          if (saved && saved.length > 0) {
            setLoadedAttachments(saved);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error("Failed to load persistent attachments in viewer:", err);
        }
      }
      setLoadedAttachments(attachments || []);
      setLoading(false);
    };

    loadPersisted();
    setActiveIndex(0); // Reset index on open
  }, [isOpen, orderId, attachments]);

  if (!isOpen) return null;

  const validAttachments = loadedAttachments?.length > 0 ? loadedAttachments : ['mock:未命名附件.pdf'];
  const activeAtt = validAttachments[activeIndex] || '';
  
  const isVoice = activeAtt.includes('voice') || activeAtt.includes('.mp3');
  const isRealData = activeAtt.startsWith('data:');
  const isImage = activeAtt.includes('image') || activeAtt.includes('.jpg') || activeAtt.includes('.png') || isRealData;

  // Render the real uploaded preview
  let previewContent = null;
  if (loading) {
    previewContent = (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
         <div className="w-10 h-10 border-4 border-sap-blue border-t-transparent rounded-full animate-spin" />
         <p className="text-xs font-bold text-gray-400">正在调取云端图像库...</p>
      </div>
    );
  } else if (isVoice) {
    previewContent = (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl w-full h-full min-h-[300px]">
        <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
          <Music size={48} />
        </div>
        <p className="text-gray-900 font-bold text-lg mb-2">语音记录已就绪</p>
        <p className="text-gray-500 text-sm mb-6">该附件为音频文件，请下载或使用本地支持的播放器打开。</p>
        <div className="w-full max-sm h-12 bg-white rounded-full border border-gray-200 flex items-center px-6 shadow-sm">
           <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
             <div className="w-1/3 h-full bg-red-500 rounded-full"></div>
           </div>
           <span className="text-xs text-gray-500 font-mono ml-4">0:45</span>
        </div>
      </div>
    );
  } else if (isImage) {
    previewContent = (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl overflow-hidden p-4 min-h-[400px]">
        <img 
          src={isRealData ? activeAtt : "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=1200"} 
          alt="Preview" 
          className="max-w-full max-h-[70vh] object-contain shadow-sm rounded border border-gray-200/50"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  } else {
    // PDF / File
    previewContent = (
       <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden p-8 border border-gray-100 min-h-[400px]">
         <img 
          src="https://images.unsplash.com/photo-1568227451433-286e9275afba?auto=format&fit=crop&q=80&w=1200" 
          alt="PDF Preview" 
          className="max-w-full max-h-[70vh] object-contain shadow-lg border border-gray-200 rounded-sm"
          referrerPolicy="no-referrer"
        />
       </div>
    );
  }

  const getExt = (name: string): "MP3" | "PNG" | "PDF" => {
    if (name.includes('voice') || name.includes('.mp3')) return 'MP3';
    if (name.includes('image') || name.includes('.png') || name.startsWith('data:image/')) return 'PNG';
    return 'PDF';
  };

  const getCleanName = (name: string, index: number) => {
    if (!name) return `附件_${index + 1}`;
    if (name.startsWith('data:')) {
      return `单据页面 #${index + 1}`;
    }
    return name;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-sap-gray-900/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4 lg:p-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-6xl h-[85vh] bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl relative"
        >
          {/* Header */}
          <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sap-blue/10 flex items-center justify-center text-sap-blue">
                <Paperclip size={16} />
              </div>
              <h3 className="font-bold text-sap-gray-900 text-lg">附件预览</h3>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-bold ml-2">
                {validAttachments.length} 个文件
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="h-9 px-4 max-md:hidden" leftIcon={<Download size={14} />} onClick={() => alert('已开始打包下载附件！')}>下载全部</Button>
              <button 
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-sap-gray-900 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar List */}
            {validAttachments.length > 0 && (
              <div className="w-72 border-r border-gray-100 bg-gray-50/50 p-4 overflow-y-auto shrink-0 max-md:hidden">
                <div className="space-y-2">
                  {validAttachments.map((att, idx) => {
                    const isActive = idx === activeIndex;
                    const ext = getExt(att);
                    const cleanName = getCleanName(att, idx);
                    
                    return (
                      <button 
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all border text-left ${
                          isActive 
                            ? 'bg-white border-sap-blue/20 shadow-sm ring-1 ring-sap-blue/10' 
                            : 'bg-transparent border-transparent hover:bg-black/5'
                        }`}
                      >
                         <div className={`mt-1 shrink-0 ${isActive ? 'text-sap-blue' : 'text-gray-400'}`}>
                           {ext === 'MP3' ? <Music size={16} /> : ext === 'PNG' ? <ImageIcon size={16} /> : <FileText size={16} />}
                         </div>
                         <div className="flex-1 min-w-0 pr-2">
                           <p className={`text-sm font-bold truncate ${isActive ? 'text-sap-gray-900' : 'text-gray-600'}`}>{cleanName}</p>
                           <p className="text-[11px] text-gray-400 font-mono mt-0.5">{ext} • {isRealData ? (att.length * 0.75 / 1024 / 1024).toFixed(2) : '1.2'} MB</p>
                         </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Preview Area */}
            <div className="flex-1 bg-white p-4 lg:p-6 overflow-hidden relative">
              <div className="w-full h-full flex flex-col">
                 <div className="flex items-center justify-between mb-4">
                   <h4 className="text-gray-900 font-bold truncate max-w-sm">
                     {getCleanName(activeAtt, activeIndex)}
                   </h4>
                   <Button variant="outline" className="h-8 px-3 text-xs" leftIcon={<ExternalLink size={14} />} onClick={() => {
                     if (isRealData) {
                       const w = window.open();
                       if (w) w.document.write(`<img src="${activeAtt}" style="max-width:100%; height:auto;" />`);
                     } else {
                       window.open(window.location.href, '_blank');
                     }
                   }}>在新窗口打开/预览</Button>
                 </div>
                 <div className="flex-1 overflow-auto rounded-2xl relative custom-scrollbar">
                   {previewContent}
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
