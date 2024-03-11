import prisma from "@/lib/db/prisma";
import { createMatchSchema, updateMatchSchema } from "@/lib/validation/match";

import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated");

    const matches = await prisma.match.findMany({ where: { userId } });

    return NextResponse.json(matches, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedRes = createMatchSchema.safeParse(body);

    if (!parsedRes.success) {
      console.error("Error Parsing JSON ----->", parsedRes.error);
      return NextResponse.json({ error: "Invalid inputs" });
    }

    const { name, teamIds, curTeam, overs } = parsedRes.data;

    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const match = await prisma.match.create({
      data: {
        userId,
        name,
        teamIds: { set: teamIds! },
        curTeam,
        overs,
      },
    });

    return NextResponse.json({ match, status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated");

    const body = await req.json();
    const parsedRes = updateMatchSchema.safeParse(body);

    if (!parsedRes.success) {
      console.error("Error Parsing JSON ----->", parsedRes.error);
      return NextResponse.json({ error: "Invalid inputs" });
    }

    const { id: matchId, name, teamIds, curTeam, overs } = parsedRes.data;

    if (!matchId) {
      return NextResponse.json({ error: "Match not found" }, { status: 400 });
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        name,
        teamIds,
        curTeam,
        overs,
      },
    });

    return NextResponse.json({ match: updatedMatch }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
