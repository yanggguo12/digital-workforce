import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ModelSettings {
  temperature: number;
  maxTokens: number;
  topP: number;
  [key: string]: any;
}

export interface ModelProviderConfig {
  id: string;
  name: string;
  activeModel: string;
  settings: ModelSettings;
}

interface ModelContextType {
  defaultProvider: string;
  activeModel: string;
  setDefaultProvider: (provider: string) => void;
  setActiveModelForProvider: (providerId: string, model: string) => void;
  providerConfigs: Record<string, ModelProviderConfig>;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: ReactNode }) {
  const [defaultProvider, setDefaultProvider] = useState('Gemini');
  const [providerConfigs, setProviderConfigs] = useState<Record<string, ModelProviderConfig>>({
    'Gemini': {
      id: 'Gemini',
      name: 'Gemini',
      activeModel: 'Gemini 3.1 Pro',
      settings: { temperature: 1.0, maxTokens: 2048, topP: 0.95 }
    },
    'OpenAI': {
      id: 'OpenAI',
      name: 'OpenAI',
      activeModel: 'GPT-4o',
      settings: { temperature: 0.7, maxTokens: 4096, topP: 1.0 }
    }
  });

  const setActiveModelForProvider = (providerId: string, model: string) => {
    setProviderConfigs(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        activeModel: model
      }
    }));
  };

  const activeModel = providerConfigs[defaultProvider]?.activeModel || 'Unknown';

  return (
    <ModelContext.Provider value={{ 
      defaultProvider, 
      activeModel, 
      setDefaultProvider, 
      setActiveModelForProvider,
      providerConfigs 
    }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
}
