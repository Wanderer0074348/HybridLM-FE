'use client';

import { motion } from 'framer-motion';

interface AnimatedPathProps {
  d: string;
  isActive: boolean;
  color: string;
  delay: number;
  withParticle?: boolean;
}

export function AnimatedPath({ d, isActive, color, delay, withParticle }: AnimatedPathProps) {
  return (
    <>
      {/* The path line */}
      <motion.path
        d={d}
        stroke={color}
        strokeWidth={isActive ? '5' : '2'}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: isActive ? 1 : 0.3,
          opacity: isActive ? 1 : 0.15
        }}
        transition={{
          pathLength: { duration: 1, delay, ease: 'easeInOut' },
          opacity: { duration: 0.3, delay }
        }}
      />

      {/* Animated particle along the path */}
      {withParticle && (
        <>
          {/* Glow effect */}
          <motion.circle
            r="10"
            fill={color}
            opacity="0.4"
            filter="blur(6px)"
          >
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              path={d}
              begin={`${delay + 1}s`}
            />
          </motion.circle>

          {/* Main particle */}
          <motion.circle
            r="6"
            fill={color}
          >
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              path={d}
              begin={`${delay + 1}s`}
            />
          </motion.circle>

          {/* Inner highlight */}
          <motion.circle
            r="3"
            fill="white"
            opacity="0.9"
          >
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              path={d}
              begin={`${delay + 1}s`}
            />
          </motion.circle>
        </>
      )}
    </>
  );
}
