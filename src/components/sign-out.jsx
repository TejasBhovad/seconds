"use client";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import React from "react";

const SignOut = () => {
  return (
    <Button
      variant="ghost"
      className={"hover:bg-muted"}
      onClick={() => signOut()}
    >
      Sign Out
    </Button>
  );
};

export default SignOut;
