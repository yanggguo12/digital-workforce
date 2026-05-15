import React from 'react';
import { HomeDashboard } from './HomeDashboard';
import { ModuleType } from '@/src/types';

export function HomeModule({ onNavigate }: { onNavigate: (module: ModuleType) => void }) {
  return <HomeDashboard onNavigate={onNavigate} />;
}
