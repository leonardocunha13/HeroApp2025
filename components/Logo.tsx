"use client";
import Link from "next/link";
import Image from "next/image";
import LogoImg from "../logo.png";

function Logo() {
  return (
    <div className="flex items-center">
      <Link href="/">
        <Image src={LogoImg} alt="Logo" width={150} height={60} className="hover:cursor-pointer" />
      </Link>

    </div>
  );
}

export default Logo;
