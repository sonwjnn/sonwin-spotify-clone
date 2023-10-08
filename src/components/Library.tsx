"use client";

import { LibraryIcon } from "@/public/icons";

import UploadDropdown from "./UploadDropdown";
import PlaylistSidebar from "./PlaylistSidebar/PlaylistSidebar";
import { Playlist } from "@/types/types";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import ListItem from "./ListItem";
import useUserStore from "@/stores/useUserStore";

interface LibraryProps {
  playlists: Playlist[];
  isScroll?: boolean;
}

const Library: React.FC<LibraryProps> = ({ playlists, isScroll = false }) => {
  const { user, subscription } = useUser();
  const { likedSongs, likedPlaylists } = useUserStore();
  const authModal = useAuthModal();
  const subcribeModal = useSubscribeModal();

  const handleClick = () => {
    if (!user) {
      return authModal.onOpen();
    }
    if (!subscription) {
      return subcribeModal.onOpen();
    }
  };

  if (!user || !subscription) {
    return (
      <div
        onClick={handleClick}
        className="flex justify-center items-center text-center w-full px-4 mt-8 text-neutral-400 hover:text-white transition cursor-pointer"
      >
        Log in and subscribe to view your playlists.
      </div>
    );
  }

  return (
    <div className="flex flex-col ">
      <div
        className={`flex flex-col items-center px-5 pt-4 sticky top-0 bg-neutral-900 z-10 pb-0 ${
          isScroll ? "shadow-2xl" : ""
        }`}
      >
        <div className="w-full flex items-center justify-between">
          <div className="inline-flex items-center gap-x-2 ">
            <button className="text-neutral-400">
              <LibraryIcon />
            </button>
            <p className="text-neutral-400 text-base font-bold">Your Library</p>
          </div>

          <div className={"min-h-8  flex flex-row justify-end"}>
            <UploadDropdown />
          </div>
        </div>

        <div className="h-12 w-full flex items-center gap-x-2 mt-2">
          <button
            disabled={playlists.length ? false : true}
            className="rounded-full bg-neutral-800 text-white text-sm border border-transparent py-1 px-3  disabled:opacity-50 transition hover:brightness-110"
          >
            Playlists
          </button>
          <button
            disabled
            className=" rounded-full bg-neutral-800 text-white text-sm border border-transparent py-1 px-3 disabled:select-none  disabled:opacity-50 transition hover:brightness-110"
          >
            Albums
          </button>
        </div>
      </div>
      {!playlists.length && !likedPlaylists.length ? (
        <div
          onClick={handleClick}
          className="flex justify-center items-center text-center w-full px-4 my-8 text-neutral-400 hover:text-white transition cursor-pointer"
        >
          You have no any playlists, create your playlists.
        </div>
      ) : (
        <PlaylistSidebar data={playlists} likedPlaylist={likedPlaylists} />
      )}

      <div className="mt-2 px-3 pb-2">
        <ListItem
          image="/images/liked.png"
          name="Liked Songs"
          href="/liked"
          count={likedSongs.length}
        />
      </div>
    </div>
  );
};

export default Library;