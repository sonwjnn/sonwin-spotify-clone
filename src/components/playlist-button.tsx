'use client'

import { useSessionContext } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

import { useAuthModal } from '@/hooks/modals/use-auth-modal'
import { usePlaylist } from '@/hooks/use-playlist'
import { useUser } from '@/hooks/use-user'
import type { Playlist, Song } from '@/types/types'

import { Spinner } from './spinner'
import { Tooltip } from './ui/tooltip'
import { AiOutlinePlus } from 'react-icons/ai'

interface PlaylistButtonProps {
  type: 'add' | 'remove'
  song: Song
  playlist: Playlist
}

export const PlaylistButton: React.FC<PlaylistButtonProps> = ({
  type,
  song,
  playlist,
}) => {
  const { supabaseClient } = useSessionContext()

  const { user } = useUser()

  const { setDuration, removePlaylistSong, addPlaylistSong } = usePlaylist()

  const authModal = useAuthModal()

  const [isRequired, setRequired] = useState<boolean>(false)

  const handleLike = async (): Promise<string | void> => {
    if (!user) {
      authModal.onOpen()
      return
    }

    if (isRequired) return

    setRequired(true)

    if (type === 'add') {
      const { error } = await supabaseClient
        .from('playlist_songs')
        .insert({ playlist_id: playlist.id, song_id: song.id })

      if (error) {
        toast.error(error.message)
        return
      }

      const updatedDuration = (playlist?.duration_ms || 0) + song.duration_ms

      const { error: playlistError } = await supabaseClient
        .from('playlists')
        .update({ duration_ms: updatedDuration })
        .eq('id', playlist.id)

      if (playlistError) {
        toast.error(playlistError.message)
        return
      }

      setDuration(updatedDuration >= 0 ? updatedDuration : song.duration_ms)
      addPlaylistSong(song)

      toast.success('Added!')
    } else {
      const { error } = await supabaseClient
        .from('playlist_songs')
        .delete()
        .eq('playlist_id', playlist.id)
        .eq('song_id', song.id)

      if (error) {
        toast.error(error.message)
        return
      }

      removePlaylistSong(song.id)
      toast.success('Removed!')
    }

    setRequired(false)
  }

  return (
    <Tooltip text="Add to playlist">
      <div
        onClick={handleLike}
        className={`flex h-8 min-w-[50px] cursor-pointer items-center justify-center rounded-full border border-neutral-400 bg-transparent p-2  font-semibold text-white  transition hover:scale-105 active:scale-100 ${
          isRequired ? 'cursor-not-allowed opacity-50' : null
        }`}
      >
        {/* eslint-disable-next-line no-nested-ternary */}
        {isRequired ? (
          <Spinner />
        ) : type === 'add' ? (
          <AiOutlinePlus color="#a3a3a3" />
        ) : (
          'Remove'
        )}
      </div>
    </Tooltip>
  )
}
