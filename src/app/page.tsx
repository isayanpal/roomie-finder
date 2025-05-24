import { Button } from "@/components/ui/button";
import { signout } from "@/utils/actions";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";


export default async function Home() {
  const supabase = await createClient();

  
  const session =  await supabase.auth.getSession();

  if(!session.data.session?.user){
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-screen">
        <h1>Not Authenticated</h1>
        <Link href={"/auth"}>
        Sign in
        </Link>
      </div>
    )
  }

  console.log(session);

  const {
    data:{
      session:{
        user:{user_metadata,app_metadata},
      }
    }
  } = session

  const {name, email, avatar_url} = user_metadata
  
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen">
    <div>Home</div>

    {avatar_url && (
      <img
      src={avatar_url}
      alt={name}
      width={100}
      height={100}
      className="rounded-full"
      />
    )}

    {name && (
      <div> name : {name}</div>
    )}
    {email && (
      <div> email : {email}</div>
    )}

    <Button variant={"destructive"} onClick={signout}>
      Logout
    </Button>
    </div>
  );
}
