'use client'

import { useRef } from 'react'
import Marquee from 'react-fast-marquee'

import { useIsOverflow } from '@/hooks/use-is-overflow'

interface MarqueeWrapperProps {
  children: React.ReactNode
  pauseOnHover?: true
  speed?: number
  direction?: 'left' | 'right' | 'up' | 'down'
}

export const MarqueeWrapper: React.FC<MarqueeWrapperProps> = ({
  children,
  pauseOnHover = false,
  speed = 20,
  direction = 'left',
}) => {
  const marqueeRef = useRef<HTMLDivElement>(null)

  const isOverflow = useIsOverflow(marqueeRef)

  return (
    <div className="h-8 w-full" ref={marqueeRef}>
      {isOverflow ? (
        <Marquee
          pauseOnHover={pauseOnHover}
          speed={speed}
          direction={direction}
        >
          {children}
        </Marquee>
      ) : (
        children
      )}
    </div>
  )
}
