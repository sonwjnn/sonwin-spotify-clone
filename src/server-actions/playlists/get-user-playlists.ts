import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import type { Playlist } from '@/types/types'

export const getUserPlaylists = async (): Promise<Playlist[]> => {
  const supabase = createServerComponentClient({
    cookies,
  })

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession()

  if (sessionError) {
    console.log(sessionError.message)

    return []
  }

  const { data, error } = await supabase
    .from('playlists')
    .select('*, users!playlists_user_id_fkey(*)')
    .eq('user_id', sessionData.session?.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.log(error)
  }

  return (data as any) || []
}
