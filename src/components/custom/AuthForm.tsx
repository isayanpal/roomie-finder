"use client";

import { signinWithGoogle } from "@/utils/actions";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      formAction={signinWithGoogle}
      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-[#100e06] border border-[#ebd98d] h-12 rounded-xl text-base font-medium shadow-sm transition-all hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? (
        <Loader2 className="w-5 h-5 animate-spin text-[#d2b53b]" />
      ) : (
        <FcGoogle className="w-6 h-6" />
      )}
      {pending ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
}

export default function AuthForm() {
  return (
    <div className="w-full">
      <form className="w-full">
        <SubmitButton />
      </form>
    </div>
  );
}
