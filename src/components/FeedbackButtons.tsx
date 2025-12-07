'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Star, MessageSquare, Send, X } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { FeedbackRequest } from '@/types/api';

interface FeedbackButtonsProps {
  decisionId?: string;
}

export function FeedbackButtons({ decisionId }: FeedbackButtonsProps) {
  const [thumbsState, setThumbsState] = useState<'up' | 'down' | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!decisionId) {
    return null;
  }

  const handleThumbsClick = async (thumbs: 'up' | 'down') => {
    if (submitted) return;

    setThumbsState(thumbs);
    setError(null);

    try {
      setIsSubmitting(true);
      const feedback: FeedbackRequest = {
        decision_id: decisionId,
        thumbs,
      };

      await apiClient.submitFeedback(feedback);
      setSubmitted(true);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
      setThumbsState(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRating = async (newRating: number) => {
    if (submitted) return;

    setRating(newRating);
    setError(null);

    try {
      setIsSubmitting(true);
      const feedback: FeedbackRequest = {
        decision_id: decisionId,
        rating: newRating,
      };

      await apiClient.submitFeedback(feedback);
      setSubmitted(true);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
      setRating(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim() || submitted) return;

    setError(null);

    try {
      setIsSubmitting(true);
      const feedback: FeedbackRequest = {
        decision_id: decisionId,
        comment: comment.trim(),
        thumbs: thumbsState || undefined,
        rating: rating || undefined,
      };

      await apiClient.submitFeedback(feedback);
      setSubmitted(true);
      setShowCommentBox(false);
      setComment('');

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-xl border border-gray-700/50 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          How was this response?
        </h4>
        {submitted && (
          <span className="text-xs text-green-400 font-medium">
            Thank you for your feedback!
          </span>
        )}
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        {/* Thumbs Up/Down */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleThumbsClick('up')}
            disabled={isSubmitting || submitted}
            className={`p-2 rounded-lg transition-all ${
              thumbsState === 'up'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gray-700/20 text-gray-400 border border-gray-600/30 hover:bg-gray-600/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Helpful"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleThumbsClick('down')}
            disabled={isSubmitting || submitted}
            className={`p-2 rounded-lg transition-all ${
              thumbsState === 'down'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-gray-700/20 text-gray-400 border border-gray-600/30 hover:bg-gray-600/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Not helpful"
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              disabled={isSubmitting || submitted}
              className={`p-1 transition-all ${
                star <= rating
                  ? 'text-yellow-400'
                  : 'text-gray-600 hover:text-yellow-400'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={`Rate ${star} stars`}
            >
              <Star className="w-4 h-4" fill={star <= rating ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>

        {/* Comment Button */}
        <button
          onClick={() => setShowCommentBox(!showCommentBox)}
          disabled={isSubmitting || submitted}
          className="p-2 rounded-lg bg-gray-700/20 text-gray-400 border border-gray-600/30 hover:bg-gray-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Add comment"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>

      {/* Comment Box */}
      {showCommentBox && (
        <div className="mt-4 space-y-2">
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your feedback..."
              disabled={isSubmitting || submitted}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/30 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 resize-none disabled:opacity-50"
              rows={3}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setShowCommentBox(false);
                setComment('');
              }}
              disabled={isSubmitting}
              className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleCommentSubmit}
              disabled={!comment.trim() || isSubmitting || submitted}
              className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium hover:bg-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
