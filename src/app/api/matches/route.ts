import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";


export async function GET(){
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();
    if(!user) return NextResponse.json(null,{status:401});

    const pref = await prisma.preference.findUnique({
        where:{
            userId: user.id
        }
    });
    if(!pref) return NextResponse.json([],{status:200});

    // same gender & location
  const others = await prisma.preference.findMany({
    where: {
      NOT: { userId: user.id },
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