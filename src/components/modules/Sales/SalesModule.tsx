import React, { useState } from 'react';
import { SalesOrderModule } from '../SalesOrder/SalesOrderModule';
import { OrdersModule } from '../Orders/OrdersModule';
import { cn } from '@/src/lib/utils';
import { FileText, Library } from 'lucide-react';

interface SalesModuleProps {
  inputSource: 'Upload' | 'Email' | 'Voice';
}

export function SalesModule({ inputSource }: SalesModuleProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'center'>('upload');

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white h-full">
      <div className="bg-white border-b border-gray-100 flex items-center px-12 gap-2 pt-6">
        <button
          onClick={() => setActiveTab('upload')}
          className={cn(
            "px-8 py-4 text-[11px] font-black transition-all border-b-2 flex items-center gap-3 uppercase tracking-widest",
            activeTab === 'upload' 
              ? "border-sap-blue text-sap-blue bg-white shadow-[0_15px_30px_rgba(0,0,0,0.05)] rounded-t-2xl" 
              : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-white/30 rounded-t-2xl"
          )}
        >
          <div className={cn("w-2 h-2 rounded-full", activeTab === 'upload' ? 'bg-sap-blue' : 'bg-gray-300')} />
          AI Neural Extraction
        </button>
        <button
          onClick={() => setActiveTab('center')}
          className={cn(
            "px-8 py-4 text-[11px] font-black transition-all border-b-2 flex items-center gap-3 uppercase tracking-widest",
            activeTab === 'center' 
              ? "border-sap-blue text-sap-blue bg-white shadow-[0_15px_30px_rgba(0,0,0,0.05)] rounded-t-2xl" 
              : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-white/30 rounded-t-2xl"
          )}
        >
          <div className={cn("w-2 h-2 rounded-full", activeTab === 'center' ? 'bg-sap-blue' : 'bg-gray-300')} />
          SAP Order Repository
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'upload' ? (
          <SalesOrderModule inputSource={inputSource} />
        ) : (
          <OrdersModule />
        )}
      </div>
    </div>
  );
}
