import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient()
const richiesteSchema = z.object({
    CognomeNomeRichiedente: z.string().min(1),
    Importo: z.number().min(1),
    NumeroRate: z.number()
})

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const dataMin = searchParams.get("dataMin") && new Date(Date.parse(searchParams.get("dataMin")!))
    const dataMax = searchParams.get("dataMax") && new Date(Date.parse(searchParams.get("dataMax")!))
    let max = undefined

    if(searchParams.get("max") != null)
        max = !isNaN(Number(searchParams.get("max"))) ? Number(searchParams.get("max")) : undefined

    const whereClause: any = {};

    if (dataMin && !isNaN(dataMin.getTime())) {
      whereClause.DataInserimentoRichiesta = { ...whereClause.DataInserimentoRichiesta, gte: dataMin };
    }
  
    if (dataMax && !isNaN(dataMax.getTime())) {
      whereClause.DataInserimentoRichiesta = { ...whereClause.DataInserimentoRichiesta, lte: dataMax };
    }

    const data = await prisma.tRichieste.findMany({ 
        where: whereClause, take: max
    })

    return NextResponse.json(data, { status: 200 })
}

export async function POST(req: NextRequest) {
    const body = richiesteSchema.safeParse(await req.json())
    if(!body.success) {
        return NextResponse.json(body.error, { status: 400 })
    }

    const exsist = await prisma.tRichieste.findFirst({ where: { CognomeNomeRichiedente: body.data.CognomeNomeRichiedente } })
    if(exsist) {
        return NextResponse.json({ message: `${body.data.CognomeNomeRichiedente} already exsist` }, { status: 401 })
    }

    const data = await prisma.tRichieste.create({ data: body.data })
    return NextResponse.json(data, { status: 201 })
}