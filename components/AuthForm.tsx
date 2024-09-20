"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";

const authFormSchema = (type: String) =>
  z.object({
    firstName: type === "sign-in" ? z.string().optional() : z.string().min(2),
    lastName: type === "sign-in" ? z.string().optional() : z.string().min(2),
    address:
      type === "sign-in" ? z.string().optional() : z.string().min(2).max(100),
    state:
      type === "sign-in" ? z.string().optional() : z.string().min(2).max(2),
    city: type === "sign-in" ? z.string().optional() : z.string().min(2),
    postalCode:
      type === "sign-in" ? z.string().optional() : z.string().min(3).max(6),
    dateOfBirth: type === "sign-in" ? z.string().optional() : z.string().min(2),
    ssn: type === "sign-in" ? z.string().optional() : z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  });

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      dateOfBirth: "",
      ssn: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // sign up with appwrite & create plaid token
      if (type === "sign-up") {
        const newUser = await signUp(data);
        setUser(newUser);
      }

      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        console.log("RESPONSE: " + response);

        if (response) {
          router.push("/");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link className="cursor-pointer flex items-center gap-1" href="/">
          <Image
            src={"/icons/logo.svg"}
            width={34}
            height={34}
            alt="Horizon Logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">{/* PlaidLink */}</div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <div className="form-item">
                          <FormLabel className="form-label">
                            First Name
                          </FormLabel>
                          <div className="flex w-full flex-col">
                            <FormControl>
                              <Input
                                placeholder="Enter your first name"
                                className="input-class"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="form-message mt-2" />
                          </div>
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <div className="form-item">
                          <FormLabel className="form-label">
                            Last Name
                          </FormLabel>
                          <div className="flex w-full flex-col">
                            <FormControl>
                              <Input
                                placeholder="Enter your last name"
                                className="input-class"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="form-message mt-2" />
                          </div>
                        </div>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <div className="form-item">
                        <FormLabel className="form-label">Address</FormLabel>
                        <div className="flex w-full flex-col">
                          <FormControl>
                            <Input
                              placeholder="Enter your address"
                              className="input-class"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="form-message mt-2" />
                        </div>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <div className="form-item">
                        <FormLabel className="form-label">City</FormLabel>
                        <div className="flex w-full flex-col">
                          <FormControl>
                            <Input
                              placeholder="Enter your city"
                              className="input-class"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="form-message mt-2" />
                        </div>
                      </div>
                    )}
                  />
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <div className="form-item">
                          <FormLabel className="form-label">State</FormLabel>
                          <div className="flex w-full flex-col">
                            <FormControl>
                              <Input
                                placeholder="Example: NY"
                                className="input-class"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="form-message mt-2" />
                          </div>
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <div className="form-item">
                          <FormLabel className="form-label">
                            Postal Code
                          </FormLabel>
                          <div className="flex w-full flex-col">
                            <FormControl>
                              <Input
                                placeholder="Example: 11101"
                                className="input-class"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="form-message mt-2" />
                          </div>
                        </div>
                      )}
                    />
                  </div>
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <div className="form-item">
                          <FormLabel className="form-label">
                            Date of Birth
                          </FormLabel>
                          <div className="flex w-full flex-col">
                            <FormControl>
                              <Input
                                placeholder="mm-dd-yyyy"
                                className="input-class"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="form-message mt-2" />
                          </div>
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ssn"
                      render={({ field }) => (
                        <div className="form-item">
                          <FormLabel className="form-label">SSN</FormLabel>
                          <div className="flex w-full flex-col">
                            <FormControl>
                              <Input
                                placeholder="Example: 1234"
                                className="input-class"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="form-message mt-2" />
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <div className="form-item">
                    <FormLabel className="form-label">Email</FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          className="input-class"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="form-message mt-2" />
                    </div>
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <div className="form-item">
                    <FormLabel className="form-label">Password</FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          className="input-class"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage className="form-message mt-2" />
                    </div>
                  </div>
                )}
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" disabled={isLoading} className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      &nbsp; Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign in"
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              className="form-link"
              href={type === "sign-in" ? "/sign-up" : "sign-in"}
            >
              {type === "sign-in" ? "Sign up" : "Sign in"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
