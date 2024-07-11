import PrismaClient from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = PrismaClient

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);
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
        where: whereClause, select: { Importo: true }
    })

    let res: number = 0

    data.map((element: { Importo: number }) => {
      res += element.Importo
    });

    if(data.length)
        return NextResponse.json({ sum: res }, { status: 200 })
    else
        return NextResponse.json({ sum: null }, { status: 200 })
}