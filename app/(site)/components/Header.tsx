"use client";

import useHeaderColor from "@/stores/useHeaderColor";
import { twMerge } from "tailwind-merge";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const { bgColor, hasBgImage } = useHeaderColor();

  return (
    <div
      className={twMerge(
        ` h-fit  p-6 pt-16  ${hasBgImage && "header-bg-image"}`,
        className
      )}
      style={{
        transition: `all 1s ease`,
        backgroundColor: `${bgColor}`,
      }}
    >
      {children}
    </div>
  );
};

export default Header;
