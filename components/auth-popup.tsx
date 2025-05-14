"use client";

import Image from "next/image";
import { X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import LoginImg from "../public/loginimage/login.jpg";
import { useSession } from "next-auth/react";

type AuthPopupProps = {
  onClose: () => void;
};

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(1, "Name is required"),
  acceptTerms: z.literal(true, {
    errorMap: () => ({
      message: "You must accept the terms and conditions",
    }),
  }),
});

export const AuthPopup = ({ onClose }: AuthPopupProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const form = useForm<z.infer<typeof signupSchema | typeof loginSchema>>({
    resolver: zodResolver(isSignUp ? signupSchema : loginSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      // acceptTerms: false,
    },
  });

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    form.reset();
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowPopup(false);
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, []);

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        // TODO: Implement actual signup request
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          toast({
            title: "Error",
            description: data.error || "Something went wrong",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Account created successfully",
        });

        // Auto login after registration
        await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        router.push("/");
        router.refresh();
      } else {
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        console.log("result", result);
        if (result?.error) {
          toast({
            title: "Login failed",
            description: "Invalid email or password",
            variant: "destructive",
          });
        }

        if (result?.ok) {
          // Fetch session to get the role
          const sessionRes = await fetch("/api/auth/session");
          const session = await sessionRes.json();
          console.log("session", session);
          if (session?.user?.role === "admin") router.push("/dashboard");
        }

        toast({
          title: "Login successful",
          description: "Redirecting...",
        });
        router.refresh();
      }

      setShowPopup(false);
    } catch (err) {
      console.error("Auth error:", err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 backgroundcolor flex justify-center items-center z-50 p-4">
      <div className="flex h-[90vh] w-full max-w-5xl bg-white rounded-lg overflow-hidden relative shadow-lg">
        <div className="w-1/2 h-full hidden md:block bg-gray-100 relative">
          <Image
            src={LoginImg}
            alt="login visual"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="w-full md:w-1/2 flex justify-center items-center p-6 md:p-10 relative">
          <div className="w-full max-w-md">
            <button
              onClick={() => {
                setShowPopup(false);
                onClose();
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-teal-900">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {isSignUp && (
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Your name *" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="E-mail address *" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password *"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!isSignUp && (
                  <div className="text-right">
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-teal-900"
                    >
                      Forgot Password?
                    </a>
                  </div>
                )}

                {isSignUp && (
                  <FormField
                    name="acceptTerms"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <Label htmlFor="acceptTerms" className="text-sm">
                          I agree to the{" "}
                          <a href="#" className="text-teal-600 underline">
                            Terms & Conditions
                          </a>
                        </Label>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isSignUp ? "Creating account..." : "Logging in..."}
                    </>
                  ) : isSignUp ? (
                    "Sign Up"
                  ) : (
                    "Log In"
                  )}
                </Button>

                <div className="text-center text-sm text-gray-900 mt-4">
                  {isSignUp
                    ? "Already have an account?"  
                    : "Don't have an account?"}{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-teal-700 hover:underline ml-1"
                  >
                    {isSignUp ? "Log In" : "Sign Up"}
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;
