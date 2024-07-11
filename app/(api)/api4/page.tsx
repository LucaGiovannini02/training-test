'use client'

import Loading from "@/components/Loading"
import RichiestaCard from "@/components/RichiestaCard"
import RichiestaTitle from "@/components/RichiestaTitle"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import API from "@/lib/axios"
import { tRichieste } from "@/lib/definitions"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { AlertCircle, Loader2, Pen } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
    RichiestaID: z.number(),
    CognomeNomeRichiedente: z.string().min(1),
    Importo: z.number(),
    NumeroRate: z.number(),
})


const Page = () => {
    const [data, setData] = useState<tRichieste[] | undefined>()
    const [pending, setPending] = useState<boolean>(false)
    const [errors, setErrors] = useState<string | undefined>(undefined)

    useEffect(() => {
        API.get("/api/richieste").then((res) => {
            setData(res.data)
        })
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            RichiestaID: undefined,
            CognomeNomeRichiedente: undefined,
            Importo: undefined,
            NumeroRate: undefined
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setPending(true)
        const { RichiestaID, ...res } = values
        API.patch(`/api/richieste/${RichiestaID}`, res).then(() => {
            setData(undefined)
            API.get("/api/richieste").then((res) => {
                setData(res.data)
                setPending(false)
            })
        }).catch((error: AxiosError<{ message: string }>) => {
            setErrors(error.response?.data.message)
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
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button onClick={() => form.reset()} className="ml-3"><Pen /></Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Modifica richiesta</DialogTitle>
                                    </DialogHeader>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full relative">
                                            <FormField
                                                control={form.control}
                                                name="RichiestaID"
                                                disabled={pending}
                                                defaultValue={ric.RichiestaID}
                                                render={({ field }) => (
                                                    <Input className="hidden" placeholder="Name" {...field} />
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="CognomeNomeRichiedente"
                                                disabled={pending}
                                                defaultValue={ric.CognomeNomeRichiedente}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input className="w-full" placeholder="Name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="Importo"
                                                disabled={pending}
                                                defaultValue={ric.Importo}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input type="number" className="w-full mt-3" placeholder="Importo" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="NumeroRate"
                                                disabled={pending}
                                                defaultValue={ric.NumeroRate}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input type="number" className="w-full mt-3" placeholder="Rate" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button disabled={pending} className="mt-3" type="submit">{!pending ? <div>Add</div> : <div className="flex"><Loader2 className="animate-spin mr-3" /> Adding...</div>}</Button>
                                        </form>
                                    </Form>
                                    {errors && (
                                        <Alert className="mt-3" variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>Error</AlertTitle>
                                            <AlertDescription>
                                                {errors}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </div>
                    ))}
                </div>
            ) : <Loading />
            }
        </div >
    )
}

export default Page