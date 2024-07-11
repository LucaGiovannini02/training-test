import { NextRequest, NextResponse } from "next/server";
import PrismaClient from "@/lib/prisma";

const prisma = PrismaClient

export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
    const { name } = params
    const query = `%${name}%`;
    
    const data = await prisma.$queryRaw`SELECT * FROM "TRichieste" WHERE "CognomeNomeRichiedente" LIKE ${query}`
    return NextResponse.json(data, { status: 200 })
}