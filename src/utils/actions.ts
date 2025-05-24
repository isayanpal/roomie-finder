"use server";

import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

const signInWith = (provider: any) => async () => {
  const supabase = await createClient();

  const auth_callback_url = `${process.env.SITE_URL}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
    },
  });
  console.log(data);

  if (error) {
    console.log(error);
  }
  if (!data?.url) {
    throw new Error("No redirect URL returned from OAuth sign-in.");
  }
  redirect(data.url);
};

const signinWithGoogle = signInWith("google");

export async function signout(){
    const supabase = await createClient();

    let {error} = await supabase.auth.signOut();

    if(error){
        console.log("Sign out failed",error);
        throw new Error(error.message);
    }
    redirect("/auth")
}

export { signinWithGoogle };
