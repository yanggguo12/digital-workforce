import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { ModuleDrawer } from '../../ui/ModuleDrawer';

export interface TileProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  disabled?: boolean;
  color?: string;
  component?: React.ReactNode;
  kpiIndicator?: string;
  onClick?: () => void;
}

interface WorkstationModuleProps {
  title: string;
  description: string;
  tiles: TileProps[];
  defaultActiveTileId?: string;
}

export const WorkstationModule: React.FC<WorkstationModuleProps> = ({ title, description, tiles, defaultActiveTileId }) => {
  const [activeTile, setActiveTile] = useState<TileProps | null>(null);

  React.useEffect(() => {
    if (defaultActiveTileId) {
      const tile = tiles.find(t => t.id === defaultActiveTileId);
      if (tile && !tile.disabled && tile.component) {
        setActiveTile(tile);
      }
    }
  }, [defaultActiveTileId, tiles]);

  const handleTileClick = (tile: TileProps) => {
    if (tile.disabled) return;
    if (tile.onClick) {
      tile.onClick();
    } else if (tile.component) {
      setActiveTile(tile);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 lg:p-6 overflow-y-auto w-full bg-[#F1F5F9] custom-scrollbar">
      <div className="mb-6">
        <h1 className="text-[18px] font-bold text-sap-gray-900 tracking-tight mb-1">{title}</h1>
        <p className="text-[12px] text-gray-500 max-w-3xl line-clamp-2">{description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
        {tiles.map((tile, idx) => (
          <motion.div
            key={tile.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            onClick={() => handleTileClick(tile)}
            whileHover={{ y: -4 }}
            className={cn(
              "group relative bg-white border border-[#E2E8F0] rounded p-4 transition-all duration-200 flex flex-col h-[180px]",
              tile.disabled 
                ? "opacity-70 cursor-default grayscale-[0.5] shadow-sm" 
                : "cursor-pointer hover:shadow-sm hover:border-sap-blue/40"
            )}
          >
            {/* Top: Icon + Title */}
            <div className="flex items-start gap-3 mb-auto">
              <div className="w-8 h-8 rounded shrink-0 bg-[#F8FAFC] flex items-center justify-center border border-[#E2E8F0] text-sap-blue">
                <div className="scale-[0.8]">{tile.icon}</div>
              </div>
              <h3 className="text-[14px] font-bold text-sap-gray-900 leading-snug line-clamp-2 transition-colors">
                {tile.title}
              </h3>
            </div>
            
            {/* Center: KPI Core Number */}
            <div className="flex flex-col justify-center my-3 items-start">
              {tile.kpiIndicator ? (
                 <div className="flex flex-col">
                   <div className="flex items-baseline gap-1.5">
                     <span className="text-[24px] font-display font-light text-sap-gray-900 tracking-tighter leading-none">
                       {tile.kpiIndicator.split(' ')[0]}
                     </span>
                     {/* The remainder is the KPI label */}
                     <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-none">
                       {tile.kpiIndicator.split(' ').slice(1).join(' ')}
                     </span>
                   </div>
                 </div>
              ) : (
                 <div className="flex flex-col">
                   <span className="text-[24px] font-display font-light text-gray-200 tracking-tighter leading-none">
                     --
                   </span>
                 </div>
              )}
            </div>
            
            {/* Bottom: Description */}
            <div className="mt-auto pt-3 border-t border-[#E2E8F0]">
               <p className="text-[11px] text-gray-500 font-medium leading-relaxed line-clamp-2">
                 {tile.description}
               </p>
            </div>

            {/* Fiori Action Indicator */}
            {!tile.disabled && (
              <div className="absolute top-4 right-4 text-sap-blue opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-1.5 h-1.5 rounded-full bg-sap-blue" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <ModuleDrawer 
        isOpen={!!activeTile} 
        onClose={() => setActiveTile(null)} 
        title={activeTile?.title || ''}
      >
        {activeTile?.component && (
          <div className="w-full h-full relative flex flex-col" style={{ contain: 'layout paint style' }}>
             {activeTile.component}
          </div>
        )}
      </ModuleDrawer>
    </div>
  );
};
