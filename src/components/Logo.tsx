import Link from "next/link";
import React from "react";
import Image from "next/image";
import LogoImg from "../public/logo.png";

function Logo() {
  return (
    <div className="flex items-center">
      <Image src={LogoImg} alt="Logo" width={50} height={50} />
      <Link
        href="/"
        className="font-bold text-3xl bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text hover:cursor-pointer ml-2"
      >
        FoxForms
      </Link>
    </div>
  );
}

export default Logo;
