import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";


export async function GET(){
    const supabase = await createClient();
    const {data: {session}} = await supabase.auth.getSession();
    if(!session) return NextResponse.json(null,{status:401});

    const pref = await prisma.preference.findUnique({
        where:{
            userId: session.user.id
        }
    });
    if(!pref) return NextResponse.json([],{status:200});

    // same gender & location
  const others = await prisma.preference.findMany({
    where: {
      NOT: { userId: session.user.id },
      gender: {
        equals: pref.gender,
        mode: "insensitive"
      },
      location: {
        equals: pref.location,
        mode: "insensitive"
      }
    }
  });

    return NextResponse.json(others);
}