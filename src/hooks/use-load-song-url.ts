import { useSupabaseClient } from '@supabase/auth-helpers-react'

import type { Song } from '@/types/types'

export const useLoadSongUrl = (song: Song): string => {
  const supabaseClient = useSupabaseClient()

  if (!song) return ''

  const { data: songData } = supabaseClient.storage
    .from('songs')
    .getPublicUrl(song.song_path)

  return songData.publicUrl
}
