import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModuleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const ModuleDrawer: React.FC<ModuleDrawerProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-0 w-full h-full bg-white z-[65] flex flex-col overflow-hidden"
        >
          {/* 全屏顶部标题栏 */}
          <div className="h-[56px] border-b border-[#E2E8F0] flex items-center justify-between px-4 lg:px-6 bg-white shrink-0 z-10 w-full shadow-sm">
            <div className="flex items-center gap-4">
              <h2 className="text-[18px] font-bold text-sap-gray-900 tracking-tight">{title}</h2>
              <div className="h-4 w-px bg-[#E2E8F0] hidden md:block" />
              <div className="hidden md:flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-sap-blue animate-pulse" />
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mt-0.5">全屏作业模式 / 实时数据同步</span>
              </div>
            </div>
            
            <button 
              onClick={onClose} 
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-sap-gray-900 hover:bg-sap-blue/5 hover:border-sap-blue/30 hover:text-sap-blue transition-all group active:scale-95 shadow-sm"
              id="module-close-btn"
            >
              <span className="text-[12px] font-bold">返回驾驶舱中心</span>
              <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
            </button>
          </div>
          
          {/* 主体作业区：100% 填充 */}
          <div className="flex-1 overflow-hidden bg-[#F1F5F9] relative flex flex-col">
             <div className="flex-1 w-full h-full flex flex-col relative">
               {children}
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
