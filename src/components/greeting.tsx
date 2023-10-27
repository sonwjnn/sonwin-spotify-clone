'use client'

import { memo, useEffect, useMemo, useState } from 'react'

import { useHeader } from '@/hooks/use-header'
import { useMainLayout } from '@/hooks/use-main-layout'
import type { Playlist } from '@/types/types'
import cn from '@/utils/cn'

import { RecommendPlaylist } from './recommend-playlist'

interface GreetingProps {
  playlists: Playlist[]
}

// eslint-disable-next-line react/display-name
export const Greeting: React.FC<GreetingProps> = memo(({ playlists }) => {
  const [currentHour, setCurrentHour] = useState(new Date().getHours())
  const [isHover, setHover] = useState(false)
  const { width } = useMainLayout()
  const { setBgBase } = useHeader()

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHour(new Date().getHours())
    }, 1000 * 60)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (isHover) {
      if (playlists[0]?.bg_color) {
        setBgBase(playlists[0]?.bg_color)
      }
    }
  }, [isHover, setBgBase, playlists])

  const greeting = useMemo(() => {
    if (currentHour >= 5 && currentHour <= 11) return 'Good morning'
    if (currentHour >= 12 && currentHour <= 17) return 'Good afternoon'
    return 'Good evening'
  }, [currentHour])

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white">
        <p>{greeting}</p>
      </h1>
      <div
        className={cn(`grid mt-4 grid-cols-3 gap-3`, {
          'grid-cols-1': width <= 519,
          'grid-cols-2': width <= 878,
        })}
      >
        {playlists
          ?.slice(0, 6)
          .map((item: Playlist, index) => (
            <RecommendPlaylist
              key={index}
              data={item}
              index={index}
              isHover={isHover}
              setHover={setHover}
            />
          ))}
      </div>
    </div>
  )
})
