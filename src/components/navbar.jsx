"use client";
import React from "react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import SignIn from "./sign-in";
import SignOut from "./sign-out";
import Link from "next/link";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ProfileSection = ({ session }) => {
  return (
    <div className="flex items-center space-x-2">
      <Link href="/dashboard">
        <Button
          href="/dashboard"
          variant="outline"
          className={"hover:bg-muted"}
        >
          Create Count
        </Button>
      </Link>
      <Popover>
        <PopoverTrigger>
          <Image
            src={session.user.image}
            alt={session.user.name}
            width={32}
            height={32}
            className="cursor-pointer rounded-full"
          />
        </PopoverTrigger>
        <PopoverContent className="flex h-fit w-fit flex-col gap-1 p-1">
          <Link href="/profile">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-gray-100"
            >
              Profile
            </Button>
          </Link>
          <SignOut />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const Navbar = ({ session }) => {
  return (
    <nav className="fixed top-0 right-0 left-0 h-14 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="text-lg font-semibold text-gray-800 transition-colors hover:text-gray-600"
        >
          Seconds.
        </Link>
        <div className="flex items-center">
          {session ? <ProfileSection session={session} /> : <SignIn />}
        </div>
      </div>
    </nav>
  );
};

const NavbarWrapper = ({ children }) => {
  const { data: session } = useSession();
  return (
    <main className="flex h-full min-h-screen w-full flex-col bg-white">
      <Navbar session={session} />
      <section className="h-full w-full flex-grow pt-14">{children}</section>
    </main>
  );
};

export default NavbarWrapper;
