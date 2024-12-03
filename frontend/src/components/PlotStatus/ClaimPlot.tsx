"use client"

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import io from "@/logic/socket";
import { useParams, useRouter } from "next/navigation";

const formSchema = z.object({
    CropName: z.string().min(1, { message: 'Crop Type is required'})
})

export const ClaimPlotForm = () => {
  const user_id = sessionStorage.getItem('user_id');
  const router = useRouter();
  const params = useParams<{ garden_id: string, plot_id: string}>();

  if (!user_id) {
    router.push('/NotLoggedIn');
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    alert('Plot Claimed successfully!');
    io.emit('PlotClaimed', {
      ...values,
      garden_id: params.garden_id,
      plot_id: params.plot_id,
      user_id: user_id
    });
    router.push(`/PlotStatus/${params.garden_id}/${params.plot_id}/Dashboard`);
  }

  return (
    <Form {...form}>
      <div className="min-h-[70vh]">
        <div className="text-center text-3xl font-extrabold mb-3 flex justify-center">
            <span className="mt-4 bg-gradient-to-tr from-primary/60 to-primary text-transparent bg-clip-text">
              Claim A Plot
            </span>
            <span className="mt-5"></span>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-center">
          <div className="min-w-[30%]">
            <FormField
              control={form.control}
              name="CropName"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Crop Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Crop Name" {...field} className="ring-1 ring-green-600 shadow-md"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-5 w-full">Claim Plot</Button>
          </div>
        </form>
        <br></br>
      </div>
    </Form>
  )        
}
