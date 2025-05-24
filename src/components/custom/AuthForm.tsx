"use client"

import { signinWithGoogle } from "@/utils/actions"
import { Button } from "../ui/button"

export default function AuthForm() {
  return (
    <div>
        <form >
            <Button formAction={signinWithGoogle}>
                Sign in with google
            </Button>
        </form>
    </div>
  )
}
