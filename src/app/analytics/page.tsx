'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Play, StopCircle, TrendingUp, Database, Zap, RefreshCw } from 'lucide-react';
import { Statistics } from '@/components/Statistics';
import { CostDashboard } from '@/components/CostDashboard';
import { Sidebar } from '@/components/layout/Sidebar';
import { BackgroundEffects } from '@/components/layout/BackgroundEffects';
import { apiClient } from '@/lib/api';
import { InferenceResponse, ABTestConfig, MLTrainingResponse } from '@/types/api';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const { responses, clearResponses } = useAnalytics();
  const router = useRouter();
  const [activeTest, setActiveTest] = useState<ABTestConfig | null>(null);
  const [isLoadingTest, setIsLoadingTest] = useState(true);
  const [trainingStatus, setTrainingStatus] = useState<string | null>(null);
  const [trainingResult, setTrainingResult] = useState<MLTrainingResponse | null>(null);
  const [isTraining, setIsTraining] = useState(false);

  // Convert ChatResponse to InferenceResponse for existing components
  const inferenceResponses: InferenceResponse[] = responses.map(r => ({
    response: r.response,
    model_used: r.model_used,
    routing_reason: r.routing_reason,
    latency: r.latency,
    cache_hit: r.cache_hit,
    timestamp: r.timestamp,
    cost_metrics: r.cost_metrics,
  }));

  // Load active A/B test
  useEffect(() => {
    loadActiveTest();
  }, []);

  const loadActiveTest = async () => {
    try {
      setIsLoadingTest(true);
      const test = await apiClient.getActiveABTest();
      setActiveTest(test);
    } catch (err) {
      console.error('Failed to load A/B test:', err);
    } finally {
      setIsLoadingTest(false);
    }
  };

  const handleStartABTest = async () => {
    try {
      const test = await apiClient.createABTest({
        name: `ML vs Rule-Based Test ${new Date().toLocaleDateString()}`,
        description: 'Compare ML-enhanced routing with rule-based routing',
        control_group: 'rule-based',
        treatment_group: 'ml-enhanced',
        traffic_split: 0.5, // 50/50 split
      });
      setActiveTest(test);
      alert('A/B test started successfully!');
    } catch (err) {
      alert('Failed to start A/B test: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleEndABTest = async () => {
    if (!activeTest) return;

    if (!confirm('Are you sure you want to end this A/B test?')) return;

    try {
      await apiClient.endABTest(activeTest.id);
      setActiveTest(null);
      alert('A/B test ended successfully!');
    } catch (err) {
      alert('Failed to end A/B test: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleTrainModel = async () => {
    if (responses.length < 10) {
      alert('Need at least 10 queries with feedback to train the model. Keep chatting!');
      return;
    }

    if (!confirm(`Train ML model with ${responses.length} samples?`)) return;

    try {
      setIsTraining(true);
      setTrainingStatus('Training model...');
      const result = await apiClient.trainMLModel();
      setTrainingResult(result);
      setTrainingStatus('Training completed!');
      alert(`Model trained successfully!\nVersion: ${result.version}\nAccuracy: ${(result.metrics.accuracy * 100).toFixed(1)}%`);
    } catch (err) {
      setTrainingStatus('Training failed');
      alert('Failed to train model: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsTraining(false);
    }
  };

  const handleNewChat = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleSelectSession = useCallback((sessionId: string) => {
    router.push(`/?session=${sessionId}`);
  }, [router]);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white relative overflow-hidden flex">
        {/* Animated Background */}
        <BackgroundEffects />

        {/* Sidebar */}
        <Sidebar
          currentSessionId={null}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
        />

        {/* Main Content */}
        <div className="flex-1 ml-[280px] relative z-10">
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Monitor performance, manage A/B tests, and train ML models
            </p>
          </div>

          {/* ML Training Section */}
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-700/50 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-purple-400" />
                <div>
                  <h3 className="text-xl font-semibold text-white">ML Classifier Training</h3>
                  <p className="text-sm text-gray-400">Train the routing model with collected data</p>
                </div>
              </div>
              <button
                onClick={handleTrainModel}
                disabled={isTraining || responses.length < 10}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTraining ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Training...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Train Model
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">{responses.length}</div>
                <div className="text-xs text-gray-500">Training Samples</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">
                  {trainingResult ? `${(trainingResult.metrics.accuracy * 100).toFixed(1)}%` : 'N/A'}
                </div>
                <div className="text-xs text-gray-500">Model Accuracy</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">
                  {trainingResult ? trainingResult.version : 'Not trained'}
                </div>
                <div className="text-xs text-gray-500">Model Version</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">
                  {responses.length >= 100 ? '100+' : `${responses.length}/100`}
                </div>
                <div className="text-xs text-gray-500">Min Required: 100</div>
              </div>
            </div>

            {trainingStatus && (
              <div className="text-sm text-gray-400 mt-2">
                Status: {trainingStatus}
              </div>
            )}

            {trainingResult && (
              <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Training Metrics</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Precision:</span>
                    <span className="text-gray-300">{(trainingResult.metrics.precision * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Recall:</span>
                    <span className="text-gray-300">{(trainingResult.metrics.recall * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">F1 Score:</span>
                    <span className="text-gray-300">{(trainingResult.metrics.f1_score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Training Samples:</span>
                    <span className="text-gray-300">{trainingResult.metrics.training_samples}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* A/B Testing Section */}
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-700/50 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="text-xl font-semibold text-white">A/B Testing</h3>
                  <p className="text-sm text-gray-400">Compare routing strategies</p>
                </div>
              </div>
              {activeTest ? (
                <button
                  onClick={handleEndABTest}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <StopCircle className="w-4 h-4" />
                  End Test
                </button>
              ) : (
                <button
                  onClick={handleStartABTest}
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start A/B Test
                </button>
              )}
            </div>

            {isLoadingTest ? (
              <div className="text-center text-gray-500 py-8">Loading A/B test status...</div>
            ) : activeTest ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Test Name</div>
                    <div className="font-medium text-gray-200">{activeTest.name}</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Traffic Split</div>
                    <div className="font-medium text-gray-200">{(activeTest.traffic_split * 100).toFixed(0)}% / {(100 - activeTest.traffic_split * 100).toFixed(0)}%</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Control Group</div>
                    <div className="font-medium text-blue-400">{activeTest.control_group}</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Treatment Group</div>
                    <div className="font-medium text-purple-400">{activeTest.treatment_group}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Started: {new Date(activeTest.started_at).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No active A/B test. Start one to compare routing strategies!
              </div>
            )}
          </div>

          {/* Analytics Data */}
          {inferenceResponses.length > 0 ? (
            <>
              <div className="flex items-center justify-between border-t border-gray-800/50 pt-8">
                <h2 className="text-2xl font-bold">Performance Analytics</h2>
                <button
                  onClick={clearResponses}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-400 transition-colors"
                >
                  Clear Data
                </button>
              </div>

              <CostDashboard responses={inferenceResponses} />
              <Statistics responses={inferenceResponses} />
            </>
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto">
                <Database className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400">No Analytics Data</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Start chatting to collect analytics data. Your conversation history will appear here for analysis.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-emerald-400 font-medium transition-colors"
              >
                Go to Chat
              </Link>
            </div>
          )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
