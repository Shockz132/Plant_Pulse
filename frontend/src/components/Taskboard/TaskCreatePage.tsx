"use client"

import { buttonVariants } from "@/components/ui/button";
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {TaskClipBoardIcon } from "@/components/Icons";
import io from "@/logic/socket";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    Title: z.string().min(1, { message: 'Title is required'}).max(15, {message: 'Title is too long'}),
    Status: z.enum(["todo", "in progress"], {
      required_error: "Please select the status.",
    }),
    Label: z.enum(["Maintenance", "Events", "Others"], {
      required_error: "Please select the Label.",
    }),
    Priority: z.enum(["low", "medium", "high"], {
      required_error: "Please select the priority.",
    }),
})

export const TaskForm = () => {
  const user_id = sessionStorage.getItem('user_id');
  const router = useRouter();

  if (!user_id) {
    router.push('/NotLoggedIn');
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    alert('Task created successfully!');
    io.emit('taskCreated', {
      ...values, 
      user_id: user_id
    });
    console.log({
      ...values, 
      user_id: user_id
    })
  }

  return (
    <Form {...form}>
      <div className="min-h-[70vh]">
        <div className="text-center text-3xl font-extrabold mb-3 flex justify-center">
            <span className="mt-4 bg-gradient-to-tr from-primary/60 to-primary text-transparent bg-clip-text">
              Create A Task
            </span>
            <span className="mt-5"><TaskClipBoardIcon/></span>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-center">
          <div className="min-w-[30%]">
            <FormField
              control={form.control}
              name="Title"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Task Title" {...field} className="ring-1 ring-green-600 shadow-md"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Status"
              render={({ field }) => (
                <FormItem className="space-y-2 mt-4">
                  <FormLabel>Status</FormLabel>
                  <FormControl className="flex justify-around">
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl className="ring-1 ring-green-600">
                          <RadioGroupItem value="todo" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          To Do
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl className="ring-1 ring-green-600">
                          <RadioGroupItem value="in progress" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          In Progress
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Label"
              render={({ field }) => (
                <FormItem className="space-y-2 mt-4">
                  <FormLabel>Label</FormLabel>
                  <FormControl className="flex justify-around">
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl className="ring-1 ring-green-600">
                          <RadioGroupItem value="Maintenance" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Maintenance
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl className="ring-1 ring-green-600">
                          <RadioGroupItem value="Events" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Events
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl className="ring-1 ring-green-600">
                          <RadioGroupItem value="Others" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Others
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Priority"
              render={({ field }) => (
                <FormItem className="space-y-2 mt-4">
                  <FormLabel>Priority</FormLabel>
                  <FormControl className="flex justify-around">
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl className="ring-1 ring-green-600">
                          <RadioGroupItem value="low" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Low
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl className="ring-1 ring-green-600">
                          <RadioGroupItem value="medium" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Medium
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl className="ring-1 ring-green-600">
                          <RadioGroupItem value="high" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          High
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-5 w-full">Create Task</Button>
          </div>
        </form>
        <br></br>
      </div>
    </Form>
  )        
}
