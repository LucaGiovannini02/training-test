import { PrismaClient } from "@/prisma/generated/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dataMin = searchParams.get("dataMin") && new Date(Date.parse(searchParams.get("dataMin")!))
  const dataMax = searchParams.get("dataMax") && new Date(Date.parse(searchParams.get("dataMax")!))

  const whereClause: any = {};

  if (dataMin && !isNaN(dataMin.getTime())) {
    whereClause.DataInserimentoRichiesta = { ...whereClause.DataInserimentoRichiesta, gte: dataMin };
  }

  if (dataMax && !isNaN(dataMax.getTime())) {
    whereClause.DataInserimentoRichiesta = { ...whereClause.DataInserimentoRichiesta, lte: dataMax };
  }

  const data = await prisma.tRichieste.findMany({
    where: whereClause, select: { NumeroRate: true }
  })

  let res: number = 0

  data.map((element: { NumeroRate: number }) => {
    res += element.NumeroRate
  });

  return NextResponse.json({ avg: res / data.length }, { status: 200 })
}