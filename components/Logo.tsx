"use client";
import Link from "next/link";
import Image from "next/image";
import LogoImg from "../logo.png";

function Logo() {
  return (
    <div className="flex items-center">
      <Link href="/">
        <Image
          src={LogoImg}
          alt="Logo"
          width={150} // Specify the width
          // height is automatically calculated based on the aspect ratio
          className="hover:cursor-pointer"
          priority // Optimize the LCP image
        />
      </Link>
    </div>
  );
}

export default Logo;
