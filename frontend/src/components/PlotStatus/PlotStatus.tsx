"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import io from "@/logic/socket";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import Link from "next/link";
  
interface PlotStatus {
    plot_id: number;
    garden_id: string;
    status: string;
    crop_name: string;
    button_text: string;
}

export const PlotStatus = () => {
    const user_id = sessionStorage.getItem('user_id');
    const router = useRouter();

    if (!user_id) {
        router.push('/NotLoggedIn');
    }

    const [plotStatusList, setPlotStatusList] = useState<PlotStatus[]>([]);

    useEffect(() => {
        io.emit('requestPlotStatus', {
            plot_selection: "All",
        });

        io.on('plotStatusResponse', (data) => {
            if (JSON.stringify(data.plot_status) !== JSON.stringify(plotStatusList))
                setPlotStatusList(data.plot_status_list);
            io.off('plotStatusResponse')
        })
    });

    const [selectedGardenId, setSelectedGardenId] = useState<string>("all");
    
    const handleGardenIdChange = (gardenId: string) => {
        setSelectedGardenId(gardenId);
    };

    const filteredPlotStatusList = selectedGardenId === "all"
    ? plotStatusList
    : plotStatusList.filter(plot => plot.garden_id === selectedGardenId.toUpperCase());


    return (
        <div className="container w-full min-h-[75vh] max-h-max mt-8">
            <div className="flex justify-end">
                <div className="content-center mr-2">Garden ID:</div>
                <Select onValueChange={handleGardenIdChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="ALL" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">ALL</SelectItem>
                        <SelectItem value="nyp">NYP</SelectItem>
                        <SelectItem value="yck">YCK</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4 mt-5">
                {filteredPlotStatusList.map(
                    ({ plot_id, status, garden_id, crop_name, button_text }: PlotStatus) => (
                        <Card key={plot_id} className="col-span-1">
                            <CardHeader>
                                <div className="flex justify-between w-full">
                                    <CardTitle>Plot {plot_id}</CardTitle>
                                    <CardDescription className="font-bold">Garden: {garden_id}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p>Crop: {crop_name}</p>
                            </CardContent>
                            <CardFooter>
                                <p>Status: {status}</p>
                            </CardFooter>
                            <div className="flex justify-center w-full">
                                {button_text === "CLAIM" ? (
                                    <Button asChild className="w-10/12 mb-5">
                                        <Link href={`/PlotStatus/${garden_id}/${plot_id}/ClaimPlot`}>
                                            {button_text}
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button asChild className="w-10/12 mb-5">
                                        <Link href={`/PlotStatus/${garden_id}/${plot_id}/Dashboard`}>
                                            {button_text}
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </Card>
                    )
                )}
            </div>
        </div>
    );
}
