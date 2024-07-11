"use client"

import Loading from "@/components/Loading"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import API from "@/lib/axios"
import { cn } from "@/lib/utils"
import { format, subDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import React, { useEffect, useState } from "react"
import { DateRange } from "react-day-picker"

const Page = () => {
    const [data, setData] = useState<{sum: number}>()
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 20),
        to: new Date(),
    })

    useEffect(() => {
        API.get("/api/richieste/sum").then((res) => {
            setData(res.data)
        })
    }, [])

    const onSubmit = () => {
        setData(undefined)
        console.log(date)
        const dateMin = date?.from!.toISOString()
        const dateMax = date?.to!.toISOString()
        API.get(`/api/richieste/sum?dataMin=${dateMin}&dataMax=${dateMax}`).then((res) => {
            setData(res.data)
        })
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex w-full">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-[300px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
                <Button onClick={onSubmit} className="ml-3" type="submit">Apply</Button>
            </div>
            {data != undefined ? (
                <div className="w-full mt-3 flex">
                    <div className="mr-2">Somma:</div> {data.sum ? <div>{data.sum}</div> : <div className="italic">No data</div>}
                </div>
            ) : <Loading />}
        </div>
    )
}

export default Page