import PrismaClient from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = PrismaClient
const patchRichiestaSchema = z.object({
    CognomeNomeRichiedente: z.string().min(1).optional(),
    Importo: z.number().min(1).optional(),
    NumeroRate: z.number().optional()
})

const idSchema = z.object({
    id: z.string().regex(/^\d+$/, "ID must be a numeric string").refine(val => parseInt(val) >= 0, {
        message: "ID must be greater than zero",
      }),
})

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const route = idSchema.safeParse(params)
    if(!route.success) {
        return NextResponse.json(route.error, { status: 400 })
    }

    const id = Number(params.id)

    const data = await prisma.tRichieste.findUnique({ where: { RichiestaID: id } })
    
    return NextResponse.json(data, { status: 200 })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const route = idSchema.safeParse(params)
    if(!route.success) {
        return NextResponse.json(route.error, { status: 400 })
    }

    const id = Number(params.id)

    const body = patchRichiestaSchema.safeParse(await req.json())
    if(!body.success) {
        return NextResponse.json(body.error, { status: 400 })
    }

    const exsist = await prisma.tRichieste.findUnique({ where: { RichiestaID: id } })
    if(!exsist) {
        return NextResponse.json({ message: "Richiesta not found" }, { status: 404 })
    }

    const data = await prisma.tRichieste.update({ 
        where: { RichiestaID: id },
        data: body.data
    })

    return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const route = idSchema.safeParse(params)
    if(!route.success) {
        return NextResponse.json(route.error, { status: 400 })
    }

    const id = Number(params.id)

    const data = await prisma.tRichieste.delete({ where: { RichiestaID: id } })

    return NextResponse.json(data, { status: 201 })
}