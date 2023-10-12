import './globals.css'

import localFont from 'next/font/local'

import MainContent from '@/components/MainContent/MainContent'
import MusicPlayer from '@/components/MusicPlayer/MusicPlayer'
import ModalProvider from '@/providers/ModalProvider'
import SkeletonProvider from '@/providers/SkeletonProvider'
import SupabaseProvider from '@/providers/SupabaseProvider'
import ToasterProvider from '@/providers/ToasterProvider'
import UserProvider from '@/providers/UserProvider'
import getLikedPlaylists from '@/server-actions/playlists/getLikedPlaylists'
import getPlaylistsByUserId from '@/server-actions/playlists/getPlaylistsByUserId'
import getActiveProductsWithPrices from '@/server-actions/products/getActiveProductsWithPrices'
import getLikedSongs from '@/server-actions/songs/getLikedSongs'
import getSongsByUserId from '@/server-actions/songs/getSongsByUserId'

const circularSp = localFont({
  src: [
    {
      path: '../../public/fonts/CircularSp-Book.woff2',
      weight: '400',
    },
    {
      path: '../../public/fonts/CircularSp-Bold.woff2',
      weight: '700',
    },
  ],
  variable: '--font-circularSp',
})

export const metadata = {
  title: 'Spotify Clone',
  description: 'Listen to music!',
}

export const revalidate = 0

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<JSX.Element> {
  const products = await getActiveProductsWithPrices()
  const userSongs = await getSongsByUserId()
  const playlists = await getPlaylistsByUserId()
  const likedSongs = await getLikedSongs()
  const likedPlaylists = await getLikedPlaylists()

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${circularSp.variable} font-sans`}>
        <ToasterProvider />
        <SkeletonProvider>
          <SupabaseProvider>
            <UserProvider>
              <ModalProvider products={products} />
              <MainContent
                songs={userSongs}
                playlists={playlists}
                likedSongs={likedSongs}
                likedPlaylists={likedPlaylists}
              >
                {children}
              </MainContent>
              <MusicPlayer />
            </UserProvider>
          </SupabaseProvider>
        </SkeletonProvider>
      </body>
    </html>
  )
}
