"use client";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

import React from "react";

const SignIn = () => {
  return <Button onClick={() => signIn("google")}>Join Now</Button>;
};

export default SignIn;
