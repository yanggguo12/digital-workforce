import React, { useRef, useEffect, useState } from 'react';
import { Reorder, AnimatePresence, motion } from 'motion/react';
import { X, ArrowRightFromLine, ArrowLeftRight, XSquare } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ModuleType } from '@/src/types';

export interface TabData {
  id: string;
  module: ModuleType;
  title: string;
  payload?: any;
}

interface TabBarProps {
  tabs: TabData[];
  setTabs: (tabs: TabData[]) => void;
  activeTabId: string;
  setActiveTabId: (id: string) => void;
  closeTab: (id: string) => void;
}

export function TabBar({ tabs, setTabs, activeTabId, setActiveTabId, closeTab }: TabBarProps) {
  const containerRef = useRef<HTMLUListElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    tabId: string | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    tabId: null,
  });

  const handleWheel = (e: React.WheelEvent) => {
    if (containerRef.current) {
      if (e.deltaY !== 0 && !e.shiftKey) {
        containerRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const activeElement = containerRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTabId, tabs]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('contextmenu', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('contextmenu', handleClickOutside);
    };
  }, [contextMenu.visible]);

  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // adjust X to prevent overflow if near edge, but simplified here
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: Math.min(e.clientY, window.innerHeight - 150),
      tabId
    });
  };

  const handleCloseCurrent = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (contextMenu.tabId && contextMenu.tabId !== 'home') {
      closeTab(contextMenu.tabId);
    }
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const handleCloseOthers = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (contextMenu.tabId) {
      const newTabs = tabs.filter(t => t.id === 'home' || t.id === contextMenu.tabId);
      setTabs(newTabs);
      setActiveTabId(contextMenu.tabId);
    }
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const handleCloseAll = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newTabs = tabs.filter(t => t.id === 'home');
    setTabs(newTabs);
    setActiveTabId('home');
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="bg-[#f0f2f5] border-b border-[#E2E8F0] shadow-sm relative z-30 pt-1 pb-0 px-2 flex-shrink-0 w-full overflow-hidden">
      <Reorder.Group 
        axis="x" 
        values={tabs} 
        onReorder={setTabs} 
        ref={containerRef}
        onWheel={handleWheel}
        className="flex overflow-x-auto no-scrollbar gap-1 w-full relative"
      >
        <AnimatePresence initial={false}>
          {tabs.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <Reorder.Item
                key={tab.id}
                value={tab}
                layout
                data-active={isActive}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                transition={{ 
                  type: 'spring', 
                  bounce: 0, 
                  duration: 0.2 // About 200ms
                }}
                whileDrag={{ scale: 1.05, zIndex: 50, opacity: 0.9 }}
                onClick={() => setActiveTabId(tab.id)}
                onContextMenu={(e) => handleContextMenu(e, tab.id)}
                className={cn(
                  "h-9 px-4 flex items-center shrink-0 cursor-pointer text-[13px] font-medium transition-colors relative group rounded-t-md select-none border border-b-0",
                  isActive 
                    ? "bg-[#1677FF] text-white border-[#1677FF] z-10 shadow-sm" 
                    : "bg-[#e2e8f0] text-gray-600 border-[#cbd5e1] hover:bg-[#d1d5db] z-0"
                )}
              >
                <span className="whitespace-nowrap">{tab.title}</span>
                
                {isActive && (
                   <motion.div 
                     layoutId="activeTabUnderline"
                     className="absolute bottom-0 left-0 right-0 h-[3px] bg-white rounded-t-sm" 
                   />
                )}

                {tab.id !== 'home' && (
                  <div
                    className={cn(
                      "ml-2 -mr-1 flex items-center justify-center w-5 h-5 rounded-full transition-opacity duration-200 opacity-0 group-hover:opacity-100",
                      isActive ? "hover:bg-white/20" : "hover:bg-black/10"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                  >
                    <X size={14} className={isActive ? "text-white" : "text-gray-500"} />
                  </div>
                )}
              </Reorder.Item>
            );
          })}
        </AnimatePresence>
      </Reorder.Group>

      {/* Context Menu Modal */}
      {contextMenu.visible && (
        <div
          className="fixed z-50 bg-white rounded shadow-lg border border-gray-200 py-1 min-w-[120px] text-[13px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.tabId !== 'home' && (
            <button
              onClick={handleCloseCurrent}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700"
            >
              <X size={14} /> 关闭当前
            </button>
          )}
          <button
            onClick={handleCloseOthers}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700"
          >
            <ArrowLeftRight size={14} /> 关闭其他
          </button>
          <button
            onClick={handleCloseAll}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700"
          >
            <XSquare size={14} /> 关闭全部
          </button>
        </div>
      )}
    </div>
  );
}
