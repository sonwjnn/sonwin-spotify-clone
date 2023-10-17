'use client'

import { useRef, useState } from 'react'

import { MediaItem } from '@/components/media-item'
import { useClickOutside } from '@/hooks/use-click-outside'
import { useOnPlay } from '@/hooks/use-on-play'
import { ClockIcon } from '@/public/icons'
import { useMainLayout } from '@/stores/use-main-layout'
import { usePlayer } from '@/stores/use-player'
import type { MediaListProps } from '@/types/track'
import cn from '@/utils/cn'

interface ListBarProps {
  className?: string
  type: 'default' | 'playlist' | 'album' | 'search' | 'artist' | 'queue'
}

const ListBar: React.FC<ListBarProps> = ({ className, type }) => {
  const { width } = useMainLayout()
  return (
    <div
      className={cn(
        `
        grid grid-cols-list-5 group gap-4
        w-full z-10  items-center px-4 h-9 border border-transparent border-b border-b-[hsla(0,0%,100%,0.1)] mb-2
        `,
        className,
        {
          'grid-cols-list-4': width <= 780 && type !== 'album',
          '!grid-cols-list-3': width <= 640 && type !== 'album',
          '!grid-cols-list-2': width <= 480 && type !== 'album',
          '!grid-cols-album-3': type === 'album',
          '!grid-cols-search-2': type === 'search',
        }
      )}
    >
      {type !== 'search' && width > 480 && (
        <div className="relative text-right text-base text-neutral-400">#</div>
      )}
      <div className={`flex items-center gap-4 pr-2`}>
        <div
          className={`flex h-full flex-1 flex-col justify-between gap-[5px] overflow-hidden`}
        >
          <p className="text-sm text-neutral-400">Title</p>
        </div>
      </div>
      {type !== 'album' && type !== 'search' && (
        <>
          {width > 640 && (
            <p className="truncate text-sm text-neutral-400">Album</p>
          )}
          {width > 780 && (
            <div className={'text-sm text-neutral-400'}>Date added</div>
          )}
        </>
      )}
      <div
        className={`flex gap-x-3 text-neutral-400 ${
          type === 'playlist'
            ? 'translate-x-2 justify-center'
            : 'translate-x-[-5px] justify-end'
        } items-center `}
      >
        <ClockIcon />
      </div>
    </div>
  )
}

export const MediaList: React.FC<MediaListProps> = ({
  songs,
  playlist,
  type = 'default',
}) => {
  const player = usePlayer()
  const onPlay = useOnPlay(songs)
  const [selectedId, setSelectedId] = useState<string>('')

  const wrapperRef = useRef(null)
  useClickOutside(wrapperRef, () => {
    setSelectedId('')
  })

  const handleOnPlay = (songId: string): void => {
    onPlay(songId)
    if (type === 'playlist') {
      player.setPlaylistActiveId(playlist?.id)
    }
  }

  return (
    <>
      <div
        className="z-10 flex min-h-[20vh]  w-full flex-col px-6 pb-2"
        ref={wrapperRef}
      >
        {songs.length ? <ListBar type={type} /> : null}
        {songs.map((song, index) => (
          <div
            key={song.id}
            onClick={() => setSelectedId(song.id)}
            onDoubleClick={() => {
              handleOnPlay(song.id)
            }}
            className="z-10 flex w-full items-center gap-x-4"
          >
            <MediaItem
              type={type}
              song={song}
              playlist={playlist}
              index={type !== 'queue' ? index + 1 : index + 2}
              isSelected={selectedId === song.id}
              isActived={player.activeId === song.id}
            />
          </div>
        ))}
      </div>
    </>
  )
}