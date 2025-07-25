"use client";
import React from "react";
import { useSession } from "next-auth/react";
import SignIn from "./sign-in";
import SignOut from "./sign-out";
import Link from "next/link";

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
          {session ? <SignOut /> : <SignIn />}
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
