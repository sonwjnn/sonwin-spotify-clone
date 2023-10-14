import type { NextPage } from 'next'

import Alert from '@/components/Alert'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import getPlaylistById from '@/server-actions/playlists/getPlaylistById'
import getSongsByIds from '@/server-actions/songs/getSongsByIds'
import getSongsByTitle from '@/server-actions/songs/getSongsByTitle'

import HeaderPlaylistContent from './_components/HeaderPlaylistContent'
import PlaylistContent from './_components/PlaylistContent'

interface PlaylistPageProps {
  params: {
    id: string
  }
  searchParams: { [key: string]: string }
}

export const revalidate = 0

const PlaylistPage: NextPage<PlaylistPageProps> = async ({
  params,
  searchParams,
}: PlaylistPageProps) => {
  const playlist = await getPlaylistById(params.id)

  if (!playlist) {
    return <Alert type="notfound" />
  }

  const addedSongs = await getSongsByIds(playlist?.song_ids || [])
  const songs = await getSongsByTitle(searchParams?.title as string)

  return (
    <div className="h-full w-full">
      <Navbar type="playlist" data={playlist} songs={addedSongs} hasPlayBtn />
      <Header data={playlist} type="playlist">
        <HeaderPlaylistContent data={playlist} songs={addedSongs} />
      </Header>
      <PlaylistContent
        playlist={playlist}
        songs={songs}
        addedSongs={addedSongs}
      />
      <Footer />
    </div>
  )
}

export default PlaylistPage
