"use client";

import useComponentSize from "@/hooks/useComponentSize";
import useHeader from "@/stores/useHeader";
import useMainLayout from "@/stores/useMainLayout";
import { Playlist } from "@/types/types";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
  data?: Playlist;
  bgColor?: string;
  type?: string;
}

const Header: React.FC<HeaderProps> = ({
  children,
  className,
  data,
  bgColor,
  type,
}) => {
  const { setHeight } = useHeader();
  const { width } = useMainLayout();
  const headerRef = useRef<HTMLDivElement>(null);

  const size = useComponentSize(headerRef);

  useEffect(() => {
    setHeight(size.height);
  }, [size.height, setHeight]);

  return (
    <div
      className={twMerge(
        ` h-fit flex ${
          type === "playlist" ? "justify-center" : "justify-start"
        } md:justify-start items-end  p-6 pt-16 ${
          type === "playlist" && width <= 768 ? "550px" : "340px"
        }`,
        className
      )}
      style={{
        backgroundImage: `linear-gradient(to bottom, ${
          bgColor || data?.bg_color
        }, rgba(255,0,0,0))`,
      }}
      ref={headerRef}
    >
      {children}
    </div>
  );
};

export default Header;
