"use client"

import Loading from "@/components/Loading"
import RichiestaCard from "@/components/RichiestaCard"
import RichiestaTitle from "@/components/RichiestaTitle"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import API from "@/lib/axios"
import { tRichieste } from "@/lib/definitions"
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
    max: z.string().regex(/^\d+$/, "Max must be a numeric and grater than 0")
})

const Page = () => {
    const [data, setData] = useState<tRichieste[] | undefined>()

    useEffect(() => {
        API.get("/api/richieste").then((res) => {
            setData(res.data)
        })
    }, [])

    const deleteRichiesta = (id: number) => {
        setData(undefined)
        API.delete(`/api/richieste/${id}`).then(() => {
            API.get("/api/richieste").then((res) => {
                setData(res.data)
            })
        })
    }

    return (
        <div className="w-full flex flex-col items-center">
            {data != undefined ? (
                <div className="w-full">
                    <div className="flex">
                        <RichiestaTitle />
                        <div className="w-20"></div>
                    </div>
                    {data.map(ric => (
                        <div key={ric.RichiestaID} className="flex items-center">
                            <RichiestaCard key={ric.RichiestaID} richiesta={ric} />
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button className="ml-3"><Trash2 /></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            L'elemento sarà perso per sempre
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteRichiesta(ric.RichiestaID)}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    ))}
                </div>
            ) : <Loading />}
        </div>
    )
}

export default Page