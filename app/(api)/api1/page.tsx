"use client"

import Loading from "@/components/Loading"
import RichiestaCard from "@/components/RichiestaCard"
import RichiestaTitle from "@/components/RichiestaTitle"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import API from "@/lib/axios"
import { tRichieste } from "@/lib/definitions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
    max: z.string().regex(/^\d+$/, "Max must be a numeric and grater than 0")
})

const Page = () => {
    const [data, setData] = useState<tRichieste[] | undefined>()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          max: undefined,
        },
      })

    useEffect(() => {
        API.get("/api/richieste").then((res) => {
            setData(res.data)
        })
    }, [])

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setData(undefined)
        API.get(`/api/richieste?max=${values.max}`).then((res) => {
            setData(res.data)
        })
    }

    return (
        <div className="w-full flex flex-col items-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full">
                    <FormField
                        control={form.control}
                        name="max"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="number" className="w-[300px]" placeholder="max" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="ml-3" type="submit">Apply</Button>
                </form>
            </Form>
            {data != undefined ? (
                <div className="w-full">
                    <RichiestaTitle />
                    {data.map(ric => (
                        <RichiestaCard key={ric.RichiestaID} richiesta={ric} />
                    ))}
                </div>
            ) : <Loading />}
        </div>
    )
}

export default Page