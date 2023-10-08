import { Playlist } from "@/types/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getLikedPlaylists = async (): Promise<Playlist[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data } = await supabase
    .from("liked_playlists")
    .select(`*,  playlists(*)`)
    .eq("user_id", session?.user.id)
    .order("created_at", { ascending: false });

  if (!data) return [];

  return data.map((item) => ({
    ...item.playlists,
  }));
};

export default getLikedPlaylists;
