"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, SproutIcon } from "lucide-react"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation';
import io from "@/logic/socket"

const formSchema = z.object({
    Email: z.string().email({message: 'Please Enter a Valid Email Address'}),
    Password: z.string()
  })

export const Login = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    function onSubmit(values: z.infer<typeof formSchema>) {
        io.emit("accountLoginAuth", values)

        io.on("accountAuthResponse", (response) =>  {
          if (response.success) {
            alert(`Login Successful! ${response.message}`);
            sessionStorage.setItem("user_id", response.user_id);
            console.log(response);
            router.push('/PlotStatus')
            io.off("accountAuthResponse")
          } else {
            alert(`Login Failed! ${response.message}`);
            io.off("accountAuthResponse")
          }
        });
    }

  return (
    
    <div className="flex min-h-[75vh]">
      <div className="flex w-1/2 items-center justify-center">
        <SproutIcon className="text-green-600 w-96 h-96" />
      </div>
      <div className="flex w-1/2 items-center justify-start">
        <div className="w-full max-w-md">
          <Form {...form}>
            <div className="text-center text-2xl font-bold text-green-500">Login to PlantPulse</div>
            <div className="text-center text-sm mb-3">Enter your email and password below to login</div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="Email"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative flex items-center">
                      <MailIcon className="absolute left-2 text-gray-400" />
                      <FormControl>
                        <Input placeholder="Type your email" {...field} className="pl-10 border-green-600 bg-blue-50" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Password"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative flex items-center">
                      <LockIcon className="absolute left-2 text-gray-400" />
                      <FormControl>
                        <Input placeholder="Type your password" type={showPassword ? "text" : "password"} {...field} className="pl-10 border-green-600 bg-blue-50" />
                      </FormControl>
                      <div className="absolute right-2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOffIcon className="text-gray-400" /> : <EyeIcon className="text-gray-400" />}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="underline mt-2 text-left cursor-pointer">
                <Link href="/ForgetPassword">Forget Password?</Link>
              </p>
              <Button type="submit" className="w-full mt-4">Login</Button>
            </form>
            <div className="flex items-center justify-center my-4">
              <Separator className="border-t-2 border-gray-300 w-24" />
              <div className="mx-2">Don't have an account?</div>
              <Separator className="border-t-2 border-gray-300 w-24" />
            </div>
            <div className="flex justify-center">
              <Button variant="outline" asChild className="bg-green-600 text-white w-full">
                <Link href="SignUp">Sign Up </Link>
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
