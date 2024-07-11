"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import API from "@/lib/axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { AlertCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
    CognomeNomeRichiedente: z.string().min(1),
    Importo: z.string().regex(/^\d+$/, "Max must be a numeric and grater than 0").transform((val) => (val ? parseInt(val, 10) : undefined)),
    NumeroRate: z.string().regex(/^\d+$/, "Max must be a numeric and grater than 0").transform((val) => (val ? parseInt(val, 10) : undefined))
})

const Page = () => {
    const [pending, setPending] = useState<boolean>(false)
    const [errors, setErrors] = useState<string | undefined>(undefined)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            CognomeNomeRichiedente: "",
            Importo: undefined,
            NumeroRate: undefined
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setPending(true)
        API.post('/api/richieste', values).then(() => {

        }).catch((error: AxiosError<{ message: string }>) => {
            setErrors(error.response?.data.message)
        }).finally(() => {
            setPending(false)
        })
    }

    return (
        <div className="w-full flex flex-col items-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full relative">
                    <FormField
                        control={form.control}
                        name="CognomeNomeRichiedente"
                        disabled={pending}
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
        </div>
    )
}

export default Page