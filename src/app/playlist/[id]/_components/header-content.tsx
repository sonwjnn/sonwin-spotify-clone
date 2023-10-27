'use client'

import Image from 'next/image'
import { useCallback } from 'react'

import { useAuthModal } from '@/hooks/use-auth-modal'
import { useLoadImage } from '@/hooks/use-load-image'
import { usePlaylistModal } from '@/hooks/use-playlist-modal'
import { useSubscribeModal } from '@/hooks/use-subcribe-modal'
import { useUser } from '@/hooks/use-user'
import { MusicNote } from '@/public/icons'
import { useMainLayout } from '@/stores/use-main-layout'
import { usePlaylistStore } from '@/stores/use-playlist-store'
import { buckets } from '@/utils/constants'
import { getDurationSong } from '@/utils/duration-convertor'

interface HeaderContentProps {}
export const HeaderContent: React.FC<HeaderContentProps> = () => {
  const { playlist: data, playlistSongs } = usePlaylistStore()
  const { width } = useMainLayout()
  const { user, subscription } = useUser()
  const authModal = useAuthModal()
  const uploadModal = usePlaylistModal()

  const subcribeModal = useSubscribeModal()

  const imagePath = useLoadImage(data?.image_path!, buckets.playlist_images)

  const onClick = (): void => {
    if (!user) {
      return authModal.onOpen()
    }
    if (!subscription) {
      return subcribeModal.onOpen()
    }

    return uploadModal.onOpen()
  }

  const duration = useCallback(() => {
    return getDurationSong({ milliseconds: data?.duration_ms, type: 'long' })
  }, [playlistSongs])

  return (
    <div className="flex flex-col  items-center gap-x-5  md:flex-row md:items-end">
      <div
        className={`${
          width <= 875 && '!h-[192px] !w-[192px]'
        } flex h-[232px] w-[232px] items-center justify-center rounded-sm bg-[#282828] text-white shadow-base `}
      >
        {imagePath ? (
          <div className="relative aspect-square h-full w-full overflow-hidden rounded-sm">
            <Image
              className="
            object-cover
          "
              src={imagePath}
              fill
              alt="playlist image"
              sizes="100%"
              priority={true}
              blurDataURL={imagePath}
              placeholder="blur"
            />
          </div>
        ) : (
          <MusicNote size={50} />
        )}
      </div>
      <div className="mt-4 flex  flex-col gap-y-3 md:mt-0 md:gap-y-6">
        <p className="hidden text-base text-white  md:block">Playlist</p>
        <div
          onClick={onClick}
          className={`${width <= 1012 && '!text-5xl'} ${
            width <= 901 && '!text-3xl'
          } line-clamp-3  cursor-pointer text-center text-7xl font-bold text-white md:text-left`}
        >
          {data?.title || 'Playlist Title'}
        </div>
        <div className="flex flex-col items-center gap-y-2 md:items-start ">
          {data?.description && (
            <p className="hidden text-sm text-desc md:block">
              {data.description}
            </p>
          )}
          <div className="flex gap-x-2 text-sm text-white">
            <p>{`${data?.users?.full_name || 'No name'} - ${
              data?.likes || 0
            } likes - ${playlistSongs?.length} songs
            `}</p>
            <p className="text-desc">{`${duration()}`}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
