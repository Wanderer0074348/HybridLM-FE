'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QueryInput } from '@/components/QueryInput';
import { ResponseDisplay } from '@/components/ResponseDisplay';
import { RoutingVisualization } from '@/components/RoutingVisualization';
import { FlowDiagram } from '@/components/FlowDiagram';
import { Statistics } from '@/components/Statistics';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/layout/Hero';
import { Features } from '@/components/layout/Features';
import { Footer } from '@/components/layout/Footer';
import { BackgroundEffects } from '@/components/layout/BackgroundEffects';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { apiClient } from '@/lib/api';
import { InferenceResponse } from '@/types/api';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<InferenceResponse | null>(null);
  const [responses, setResponses] = useState<InferenceResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.inference({ query });
      setCurrentResponse(response);
      setResponses((prev) => [response, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <BackgroundEffects />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Hero Section */}
        <Hero />

        {/* Query Input */}
        <QueryInput onSubmit={handleQuery} isLoading={isLoading} />

        {/* Error Display */}
        <ErrorMessage message={error} />

        {/* Routing Visualization */}
        {(isLoading || currentResponse) && (
          <RoutingVisualization
            response={currentResponse!}
            isLoading={isLoading}
          />
        )}

        {/* Response Display */}
        {currentResponse && !isLoading && (
          <ResponseDisplay response={currentResponse} />
        )}

        {/* Flow Diagram */}
        {currentResponse && !isLoading && (
          <FlowDiagram response={currentResponse} />
        )}

        {/* Statistics */}
        {responses.length > 0 && (
          <div className="pt-8 border-t border-gray-800/50">
            <Statistics responses={responses} />
          </div>
        )}

        {/* Feature Cards */}
        {responses.length === 0 && <Features />}
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
