'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ImmersiveModeContextType {
  immersiveMode: boolean;
  setImmersiveMode: (value: boolean) => void;
  toggleImmersiveMode: () => void;
}

const ImmersiveModeContext = createContext<ImmersiveModeContextType | null>(null);

export function ImmersiveModeProvider({ children }: { children: ReactNode }) {
  const [immersiveMode, setImmersiveMode] = useState(false);

  const toggleImmersiveMode = useCallback(() => {
    setImmersiveMode(prev => !prev);
  }, []);

  return (
    <ImmersiveModeContext.Provider value={{ immersiveMode, setImmersiveMode, toggleImmersiveMode }}>
      {children}
    </ImmersiveModeContext.Provider>
  );
}

export function useImmersiveMode() {
  const context = useContext(ImmersiveModeContext);
  if (!context) {
    throw new Error('useImmersiveMode must be used within an ImmersiveModeProvider');
  }
  return context;
}
