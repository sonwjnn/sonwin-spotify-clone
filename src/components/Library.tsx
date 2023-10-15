'use client'

import { HiArrowLeft, HiArrowRight } from 'react-icons/hi'

import useAuthModal from '@/hooks/useAuthModal'
import useSubscribeModal from '@/hooks/useSubscribeModal'
import { useUser } from '@/hooks/useUser'
import { LibraryActiveIcon, LibraryIcon } from '@/public/icons'
import useSidebar from '@/stores/useSideBar'
import useUserStore from '@/stores/useUserStore'
import type { Playlist } from '@/types/types'
import cn from '@/utils/cn'

import ListColapse from './ListColapse'
import ListItem from './ListItem'
import PlaylistSidebar from './PlaylistSidebar/PlaylistSidebar'
import UploadDropdown from './UploadDropdown'

interface LibraryProps {
  playlists: Playlist[]
  isScroll?: boolean
}

const Library: React.FC<LibraryProps> = ({ playlists, isScroll = false }) => {
  const { user, subscription } = useUser()
  const { likedSongs, likedPlaylists } = useUserStore()
  const { isCollapsed, isMaxWidth, collapsed, resetMinWidth, resetMaxWidth } =
    useSidebar()
  const authModal = useAuthModal()
  const subcribeModal = useSubscribeModal()

  const handleClick = (): void => {
    if (!user) {
      authModal.onOpen()
      return
    }
    if (!subscription) {
      subcribeModal.onOpen()
    }
  }

  const handleScale = (): void => {
    if (isCollapsed) {
      resetMinWidth()
    } else {
      collapsed()
    }
  }

  const handleShowMore = (): void => {
    if (isMaxWidth) {
      resetMinWidth()
    } else {
      resetMaxWidth()
    }
  }

  return (
    <div className="flex flex-col ">
      <div
        className={cn(
          `sticky top-0 z-10 flex flex-col items-center bg-neutral-900 px-5 pb-0 pt-4`,
          {
            'shadow-2xl': isScroll,
            'pb-3': isCollapsed,
          }
        )}
      >
        <div className={`flex h-8 w-full items-center justify-between `}>
          <div className="flex gap-x-2 ">
            <div
              className=" cursor-pointer pl-1 text-neutral-400 transition hover:text-white"
              onClick={handleScale}
            >
              {isCollapsed ? <LibraryActiveIcon /> : <LibraryIcon />}
            </div>
            {!isCollapsed && (
              <p className=" truncate pl-2 text-base font-bold text-neutral-400">
                Your Library
              </p>
            )}
          </div>

          {!isCollapsed ? (
            <div className={'flex flex-row justify-end gap-x-2'}>
              <UploadDropdown />
              <div
                onClick={handleShowMore}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
              >
                {isMaxWidth ? (
                  <HiArrowLeft size={20} />
                ) : (
                  <HiArrowRight size={20} />
                )}
              </div>
            </div>
          ) : null}
        </div>
        {!isCollapsed ? (
          <>
            <div className="mt-2 flex h-12 w-full items-center gap-x-2">
              <button
                disabled={!playlists.length}
                className="rounded-full border border-transparent bg-neutral-800 px-3 py-1 text-sm text-white  transition hover:brightness-110 disabled:opacity-50"
              >
                Playlists
              </button>
              <button
                disabled
                className=" rounded-full border border-transparent bg-neutral-800 px-3 py-1 text-sm text-white transition  hover:brightness-110 disabled:select-none disabled:opacity-50"
              >
                Albums
              </button>
            </div>
          </>
        ) : null}
      </div>

      {/* eslint-disable-next-line no-nested-ternary */}
      {!user || !subscription ? (
        <div
          onClick={handleClick}
          className={`${
            isCollapsed && 'hidden'
          } my-8 line-clamp-2 flex w-full cursor-pointer items-center justify-center px-4 text-center text-neutral-400 transition hover:text-white`}
        >
          Log in and subscribe to view your playlists.
        </div>
      ) : !playlists.length && !likedPlaylists.length ? (
        <div
          onClick={handleClick}
          className={`${
            isCollapsed && 'hidden'
          } my-8 line-clamp-2 flex w-full cursor-pointer items-center justify-center px-4 text-center text-neutral-400 transition hover:text-white`}
        >
          You have no any playlists, create your playlists.
        </div>
      ) : (
        <>
          {isCollapsed ? (
            <ListColapse playlists={[...playlists, ...likedPlaylists]} />
          ) : (
            <>
              <PlaylistSidebar
                data={playlists}
                likedPlaylist={likedPlaylists}
              />
              <div className="px-3 pb-2">
                <ListItem
                  image="/images/liked.png"
                  name="Liked Songs"
                  href="/liked"
                  count={likedSongs.length}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Library
