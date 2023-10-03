"use client";

import useLoadImage from "@/hooks/useLoadImage";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import { Song } from "@/types";
import durationConvertor from "@/utils/durationConvertor";
import Image from "next/image";
import useSound from "use-sound";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import useMainLayout from "@/stores/useMainLayout";
import usePlayer from "@/stores/usePlayer";
import { MusicNote } from "@/public/icons";

interface MediaItemProps {
  data: Song;
  index?: number;
  isPlaying?: boolean;
  isDuration?: boolean;
  isCreatedAt?: boolean;
  selected?: string;
  actived?: string;
  className?: string;
  onDoubleClick?: (value?: any) => void;
  onClick?: (value?: any) => void;
  children?: React.ReactNode;
}

const MediaItem: React.FC<MediaItemProps> = ({
  data,
  className,
  isDuration = false,
  isCreatedAt = false,
  index,
  isPlaying,
  selected,
  actived,
  onDoubleClick,
  onClick,
  children,
}) => {
  const { width } = useMainLayout();
  const imageUrl = useLoadImage(data.image_path, "images");
  const songUrl = useLoadSongUrl(data!);
  const [play, { duration }] = useSound(songUrl, { format: ["mp4"] });
  const player = usePlayer();

  const isSelected = selected === data.id;
  const isActived = actived === data.id && isPlaying;

  return (
    <div
      className={twMerge(
        `transition cursor-pointer rounded-md p-1 w-full gap-x-2 hover:bg-neutral-800/50 ${
          isSelected && "bg-neutral-800/50"
        }`,
        className
      )}
    >
      {index && player.isPlaying && isActived ? (
        <div className="relative h-full w-3  ml-2 overflow-hidden flex items-center ">
          <Image
            src={"/images/animation/equaliser-animated-green.f5eb96f2.gif"}
            sizes={"100%"}
            height={20}
            width={20}
            alt="equaliser"
          />
        </div>
      ) : (
        <div
          className={`${
            isActived ? "text-[#2ed760]" : "text-neutral-400"
          }  text-sm flex items-center  justify-end w-4 `}
        >
          {index}
        </div>
      )}
      <div
        onDoubleClick={onDoubleClick}
        onClick={onClick}
        className="flex item-center gap-x-3
      "
      >
        <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
          {imageUrl ? (
            <Image
              fill
              src={imageUrl}
              sizes="100%"
              alt="Media-Item"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-800">
              <MusicNote size={50} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-y-1 overflow-hidden">
          <p
            className={` hover:underline  truncate ${
              isActived ? "text-[#2ed760]" : "text-white"
            }`}
          >
            {data.title}
          </p>
          <p className="text-neutral-400 text-sm truncate">{data.author}</p>
        </div>
      </div>

      {isCreatedAt && (
        <div
          className={`${
            width <= 781 ? "hidden" : "flex"
          } text-neutral-400 text-sm items-center justify-end select-none`}
        >
          {dayjs(data.created_at).format("DD-MM-YYYY")}
        </div>
      )}

      {isDuration && (
        <div
          className={`${
            width <= 551 ? "hidden" : "flex"
          } text-neutral-400 text-sm items-center justify-end select-none`}
        >
          {durationConvertor({
            milliseconds: duration ? duration : 0,
          })}
        </div>
      )}

      {children}
    </div>
  );
};

export default MediaItem;
