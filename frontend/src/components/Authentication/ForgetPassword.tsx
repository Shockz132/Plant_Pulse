"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { SproutIcon } from "lucide-react";
import { useState } from "react";
import io from "@/logic/socket";

interface OTPRequestData {
  email: string;
}

interface OTPSubmitData {
  pin: string;
}

interface ChangePasswordData {
  email: string;
  newPassword: string;
  confirmNewPassword: string;
}

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  newPassword: z.string()
    .min(10, { message: "Password must be at least 10 characters" })
    .max(40, { message: "Password must not be more than 40 characters" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }),
  confirmNewPassword: z.string().min(1, { message: "Please enter your password again" }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match, please double check",
  path: ["confirmNewPassword"],
});

const otpSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 digits.",
  }),
});

export const ForgetPassword = () => {
  const [isOTPRequested, setIsOTPRequested] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<ChangePasswordData>({
    resolver: zodResolver(formSchema),
  });

  const otpForm = useForm<OTPSubmitData>({
    resolver: zodResolver(otpSchema),
  });
  
  const handleOTPRequest: SubmitHandler<OTPRequestData> = (values) => {
    console.log("handleOTPRequest values:", values);

    io.emit('OTPRequest', {
      email: values.email,
    })
    let otpRecieved = false;
    io.on('OTPRecieved', (response) => {
      if (response.status) {
        otpRecieved = true;
        alert(`OTP sent to ${response.email}`);
        setIsOTPRequested(true);
      }
      else {
        alert(`Failed to send OTP to ${values.email}`);
      }
    });
  };

  const handleOTPSubmit: SubmitHandler<OTPSubmitData> = (data) => {
    console.log("handleOTPSubmit data:", data);
    // const response = await axios.post('http://localhost:3000/api/verify-otp', { email: form.getValues().email, pin: data.pin });
    // if (response.data.success) {
    //   setIsOTPVerified(true);
    //   alert("OTP verified successfully!");
    // } else {
    //   alert("Invalid OTP. Please try again.");
    // }
  };

  const handleChangePassword: SubmitHandler<ChangePasswordData> = (values) => {
    console.log("handleChangePassword values:", values);
    // if (isOTPVerified) {
    //   try {
    //     await axios.post('http://localhost:3000/api/change-password', { email: values.email, newPassword: values.newPassword });
    //     alert("Password changed successfully!");
    //   } catch (error) {
    //     console.error(error);
    //     alert("Failed to change password. Please try again.");
    //   }
    // }
  };

  const onSubmit: SubmitHandler<OTPRequestData> = (values) => {
    console.log("onSubmit values:", values);
  };

  return (
    <div className="flex min-h-[75vh]">
      <div className="flex w-1/2 items-center justify-center">
        <SproutIcon className="text-green-600 w-96 h-96" />
      </div>
      <div className="flex w-1/2 items-center justify-start">
        <div className="w-full max-w-md">
          {!isOTPRequested ? (
            <Form {...form}>
              <div className="underline text-center text-2xl font-bold text-green-500 mb-3">Forget Password</div>
              <form onSubmit={form.handleSubmit(handleOTPRequest)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} className="ring-1 ring-green-600 shadow-md" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="mt-5 w-full">Request OTP</Button>
              </form>
            </Form>
          ) : (
            !isOTPVerified ? (
              <Form {...otpForm}>
                <div className="underline text-center text-2xl font-bold text-green-500 mb-3">Enter OTP</div>
                <form onSubmit={otpForm.handleSubmit(handleOTPSubmit)} className="space-y-4">
                  <FormField
                    control={otpForm.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>One-Time Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter OTP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-5 w-full">Verify OTP</Button>
                </form>
              </Form>
            ) : (
              <Form {...form}>
                <div className="underline text-center text-2xl font-bold text-green-500 mb-3">Change Password</div>
                <form onSubmit={form.handleSubmit(handleChangePassword)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Password has to meet the requirements below"
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="ring-1 ring-green-600 shadow-md"
                          />
                        </FormControl>
                        <FormMessage />
                        <p>*10 to 40 characters </p>
                        <p>*At least 1 uppercase and lowercase letter</p>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Re-enter new password"
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="ring-1 ring-green-600 shadow-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <label className="relative flex items-center">
                    <Checkbox
                      className="mr-1"
                      checked={showPassword}
                      onCheckedChange={() => setShowPassword(!showPassword)}
                    />
                    Show Password
                  </label>
                  <Button type="submit" className="mt-5 w-full">Change Password</Button>
                </form>
              </Form>
            )
          )}
        </div>
      </div>
    </div>
  );
};

