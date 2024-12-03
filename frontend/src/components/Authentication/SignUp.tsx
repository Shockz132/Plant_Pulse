"use client"

import { buttonVariants } from "@/components/ui/button";
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { AccountCreateIcon } from "@/components/Icons";
import Link from "next/link";
import { useRouter }  from "next/navigation";
import io from "@/logic/socket";

const formSchema = z.object({
    FirstName: z.string().min(1, { message: 'First Name is required'})
    .regex(/^[A-Za-z]+$/, { message: 'Enter only letters'}),
    LastName: z.string().min(1, { message: 'Last Name is required'})
    .regex(/^[A-Za-z]+$/, { message: 'Enter only letters'}),
    Gender: z.enum(["Male", "Female", "NotSay"], {
      required_error: "Please select your gender.",
    }),
    Email: z.string().email({message: 'Please Enter a Valid Email Address'}),
    Password: z.string()
    .min(10, { message: 'Password must be at least 10 characters long' })
    .max(40, { message: 'Password must not be more than 40 characters' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' }),
    ConfirmPassword: z.string().min(1, { message:"Please enter your password again" }),
  }).refine((data) => data.Password === data.ConfirmPassword, {
    message: "Passwords don't match, please double check",
    path: ["ConfirmPassword"],
  })
    
export const SignUp = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    alert('Account created successfully!');
    io.emit('accountCreated', values);
    router.push('/Login')
  }

  return (
    <Form {...form}>
      <div className="min-h-[70vh]">
        <div className="text-center text-3xl font-extrabold mb-3 flex justify-center">
            <span className="mt-4 bg-gradient-to-tr from-primary/60 to-primary text-transparent bg-clip-text">
              Create An Account
            </span>
            <span className="mt-4"><AccountCreateIcon /></span>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-center">
          <div>
            <div className="flex justify-between">
              <FormField
                control={form.control}
                name="FirstName"
                render={({ field }) => (
                  <FormItem className="mr-5">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter First Name" {...field} className="ring-1 ring-green-600 shadow-md"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="LastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Last Name" {...field} className="ring-1 ring-green-600 shadow-md"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="Gender"
              render={({ field }) => (
                <FormItem className="space-y-2 mt-4">
                  <FormLabel>Gender</FormLabel>
                  <FormControl className="flex justify-around">
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl className="ring-1 ring-green-600">
                          <RadioGroupItem value="Male" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Male
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl className="ring-1 ring-green-600">
                          <RadioGroupItem value="Female" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Female
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl className="ring-1 ring-green-600">
                          <RadioGroupItem value="NotSay" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Rather not say
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
              name="Email"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} className="ring-1 ring-green-600 shadow-md"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Password"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password has to meet the requirements below" type={showPassword ? "text" : "password"} 
                    {...field} className="ring-1 ring-green-600 shadow-md"/>
                  </FormControl>
                  <FormMessage />
                  <p>*10 to 40 characters </p>
                  <p>*At least 1 uppercase and lowercase letter</p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ConfirmPassword"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Re-enter password" type={showPassword ? "text" : "password"} 
                    {...field} className="ring-1 ring-green-600 shadow-md"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <label className="flex items-center mt-2">
              <Checkbox className="mr-1"
                checked={showPassword}
                onCheckedChange={() => setShowPassword(!showPassword)} 
              />
              Show Password
            </label>
            <FormMessage />
            <Button type="submit" className="mt-5 w-full">Create Account</Button>
          </div>
        </form>
        <div className="flex justify-center my-4">
          <Separator className="mt-3 border-t-2 border-gray-300 w-36" />
          <div className="mt-1 mx-2">OR CONTINUE WITH</div>
          <Separator className="mt-3 border-t-2 border-gray-300 w-36" />
        </div>
        <div className="flex justify-center">
          <Link
            rel="noreferrer noopener"
            href={"http://linkedin.com"}
            target="_blank"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
            })}
          >
            <div className="flex">
              <Linkedin size={20}/>
              <p className="font-bold text-base ml-1">Linkedin</p>
            </div>
          </Link>
          <Link
            rel="noreferrer noopener"
            href={"http://facebook.com"}
            target="_blank"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
            })}
          >
            <div className="flex">
              <Facebook size={20}/>
              <p className="font-bold text-base ml-0">Facebook</p>
            </div>
          </Link>
          <Link
            rel="noreferrer noopener"
            href={"http://instagram.com"}
            target="_blank"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
            })}
          >
            <div className="flex">
            <Instagram size={20}/>
            <p className="font-bold text-base ml-1">Instagram</p>
            </div>
          </Link>
        </div>
        <br></br>
      </div>
    </Form>
  )        
}