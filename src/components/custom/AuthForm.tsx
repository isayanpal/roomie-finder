"use client"

import { signinWithGoogle } from "@/utils/actions"
import { Button } from "../ui/button"
import { FcGoogle } from "react-icons/fc"

export default function AuthForm() {
  return (
    <div>
        <form >
            <Button formAction={signinWithGoogle} className="flex flex-row gap-2">
                <FcGoogle />Sign in with Google
            </Button>
        </form>
    </div>
  )
}
