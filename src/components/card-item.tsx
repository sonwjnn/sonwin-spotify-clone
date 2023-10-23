'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useLoadImage } from '@/hooks/use-load-image'
import { useUser } from '@/hooks/use-user'
import { MusicNote } from '@/public/icons'
import { usePlayer } from '@/stores/use-player'
import type { Playlist } from '@/types/types'
import { buckets } from '@/utils/constants'

import { PlayButton } from './play-button'

interface CartItemProps {
  data: Playlist
  onClick?: (id: string) => void
  type: 'track' | 'playlist'
}

export const CartItem: React.FC<CartItemProps> = ({
  data,
  // onClick,
  type = 'track',
}) => {
  const { currentTrack, isPlaying, handlePlay } = usePlayer()
  const { userDetails } = useUser()
  const router = useRouter()

  const isPlayingCurrentTrack = currentTrack?.id === data.id && isPlaying

  const bucket = type === 'track' ? buckets.images : buckets.playlist_images
  const imagePath = useLoadImage(data.image_path, bucket)
  return (
    <div
      onClick={() => router.push(`/playlist/${data.id}`)}
      className="group relative mb-3 flex cursor-pointer flex-col items-center justify-center gap-x-4 overflow-hidden rounded-md bg-neutral-400/5 p-4 transition hover:bg-neutral-400/10"
    >
      <div className="relative aspect-square h-full w-full overflow-hidden rounded-md shadow-base">
        {imagePath ? (
          <Image
            className="object-cover"
            src={imagePath}
            fill
            alt="song img"
            sizes="100%"
            priority={true}
            blurDataURL={imagePath}
            placeholder="blur"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-white">
            <MusicNote size={50} />
          </div>
        )}
      </div>

      <div className="flex w-full flex-col items-start gap-y-1 pt-4">
        <p className="w-full truncate font-semibold text-white">{data.title}</p>
        <p className="w-full truncate pb-4 text-sm text-neutral-400">
          By {userDetails?.full_name}
        </p>
      </div>
      <div className="absolute bottom-[102px] right-6">
        <PlayButton onClick={handlePlay} isPlaying={isPlayingCurrentTrack} />
      </div>
    </div>
  )
}
