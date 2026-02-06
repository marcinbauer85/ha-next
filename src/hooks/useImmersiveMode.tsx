'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type ImmersivePhase = 'normal' | 'preparing' | 'expanded' | 'collapsing';

interface ImmersiveModeContextType {
  immersiveMode: boolean;
  setImmersiveMode: (value: boolean) => void;
  toggleImmersiveMode: () => void;
  immersivePhase: ImmersivePhase;
}

const ImmersiveModeContext = createContext<ImmersiveModeContextType | null>(null);

export function ImmersiveModeProvider({ children }: { children: ReactNode }) {
  const [immersiveMode, setImmersiveMode] = useState(false);

  // Animation phases:
  // normal → preparing (fixed + compensating padding, no visual change)
  // preparing → expanded (padding animates to edge values, dashboard fills area)
  // expanded → collapsing (padding animates back to compensating)
  // collapsing → normal (back to grid flow, chrome fades in)
  const [immersivePhase, setImmersivePhase] = useState<ImmersivePhase>('normal');

  useEffect(() => {
    if (immersiveMode) {
      setImmersivePhase('preparing');
      let id2: number;
      const id1 = requestAnimationFrame(() => {
        id2 = requestAnimationFrame(() => {
          setImmersivePhase('expanded');
        });
      });
      return () => {
        cancelAnimationFrame(id1);
        if (id2) cancelAnimationFrame(id2);
      };
    } else {
      setImmersivePhase(prev =>
        prev === 'expanded' || prev === 'preparing' ? 'collapsing' : prev
      );
      const timer = setTimeout(() => {
        setImmersivePhase('normal');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [immersiveMode]);

  const toggleImmersiveMode = useCallback(() => {
    setImmersiveMode(prev => !prev);
  }, []);

  return (
    <ImmersiveModeContext.Provider value={{ immersiveMode, setImmersiveMode, toggleImmersiveMode, immersivePhase }}>
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
