'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export function QueryInput({ onSubmit, isLoading }: QueryInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query);
    }
  };

  const exampleQueries = [
    "What is the weather today?",
    "Explain quantum computing in detail",
    "How do I center a div?",
    "Compare React and Vue.js frameworks"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <motion.div
            className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            style={{ backgroundSize: '200% 200%' }}
          />
          <div className="relative flex items-center bg-gray-900 rounded-2xl border border-gray-700 focus-within:border-gray-500 transition-colors">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything... routing happens automatically"
              className="flex-1 bg-transparent px-6 py-4 text-white placeholder-gray-500 outline-none"
              disabled={isLoading}
            />
            <motion.button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="mr-3 p-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-gray-600/50 transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </form>

      {/* Example Queries */}
      <div className="flex flex-wrap gap-2">
        {exampleQueries.map((example, index) => (
          <motion.button
            key={index}
            onClick={() => !isLoading && setQuery(example)}
            className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {example}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
