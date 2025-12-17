'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ChatResponse } from '@/types/api';

interface AnalyticsContextType {
  responses: ChatResponse[];
  addResponse: (response: ChatResponse) => void;
  clearResponses: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [responses, setResponses] = useState<ChatResponse[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('hybridlm_analytics');
    if (stored) {
      try {
        setResponses(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load analytics data:', e);
      }
    }
  }, []);

  // Save to localStorage whenever responses change
  useEffect(() => {
    if (responses.length > 0) {
      localStorage.setItem('hybridlm_analytics', JSON.stringify(responses));
    }
  }, [responses]);

  const addResponse = (response: ChatResponse) => {
    setResponses((prev) => [response, ...prev].slice(0, 100)); // Keep last 100
  };

  const clearResponses = () => {
    setResponses([]);
    localStorage.removeItem('hybridlm_analytics');
  };

  return (
    <AnalyticsContext.Provider value={{ responses, addResponse, clearResponses }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
