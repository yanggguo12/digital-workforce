import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { Button } from './Button';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  successCount: number;
  failCount: number;
  type?: "synced" | "draft";
  onViewOrders?: (tab?: string) => void;
}

export function SuccessModal({
  isOpen,
  onClose,
  successCount,
  failCount,
  type = "synced",
  onViewOrders,
}: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[18px] border border-[#E5E7EB] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-[400px] overflow-hidden flex flex-col items-center"
          >
            <div className="w-full px-6 py-5 border-b border-[#F3F4F6]">
              <h3 className="text-[16px] font-bold text-[#111827]">
                操作处理完成
              </h3>
            </div>

            <div className="w-full px-6 py-8 flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F0FDF4] flex items-center justify-center shrink-0 border border-[#DCFCE7]">
                  <CheckCircle2 size={20} className="text-[#16A34A]" />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] text-[#374151]">成功保存/推送</div>
                  <div className="text-[18px] font-bold text-[#16A34A]">
                    {successCount} 个合同
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center shrink-0 border border-[#F3F4F6]">
                  <X size={20} className="text-[#9CA3AF]" />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] text-[#374151]">失败/跳过</div>
                  <div className="text-[18px] font-bold text-[#6B7280]">
                    {failCount} 个合同
                  </div>
                  <div className="text-[11px] text-[#9CA3AF] mt-1 leading-relaxed">
                    原因：置信度低于 95% 或未解析成功
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-6 py-4 bg-[#F9FAFB] border-t border-[#F3F4F6] flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2 text-[13px] font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-[6px] hover:bg-gray-50 transition-colors"
              >
                确定
              </button>
              <button
                onClick={() => onViewOrders?.("暂存中")}
                className="px-5 py-2 text-[13px] font-bold text-white bg-[#1677FF] rounded-[6px] hover:bg-[#0050B3] transition-all shadow-sm"
              >
                前往合同管理中心
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
