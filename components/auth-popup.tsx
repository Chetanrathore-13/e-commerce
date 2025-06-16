"use client"

import Image from "next/image"
import { X, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import LoginImg from "../public/loginimage/login.jpg"
import { useSession } from "next-auth/react"

type AuthPopupProps = {
  onClose: () => void
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const signupSchema = loginSchema.extend({
  name: z.string().min(1, "Name is required"),
  acceptTerms: z.literal(true, {
    errorMap: () => ({
      message: "You must accept the terms and conditions",
    }),
  }),
})

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const AuthPopup = ({ onClose }: AuthPopupProps) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [showPopup, setShowPopup] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { data: session, status } = useSession()
  const role = session?.user?.role
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof signupSchema | typeof loginSchema>>({
    resolver: zodResolver(isSignUp ? signupSchema : loginSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const toggleMode = () => {
    setIsSignUp((prev) => !prev)
    setIsForgotPassword(false)
    setEmailSent(false)
    form.reset()
    forgotPasswordForm.reset()
  }

  const handleForgotPassword = () => {
    setIsForgotPassword(true)
    setIsSignUp(false)
    setEmailSent(false)
    form.reset()
    forgotPasswordForm.reset()
  }

  const handleBackToLogin = () => {
    setIsForgotPassword(false)
    setEmailSent(false)
    forgotPasswordForm.reset()
  }

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowPopup(false)
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [onClose])

  const onSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      if (isSignUp) {
        // Implement actual signup request
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })

        const data = await response.json()

        if (!response.ok) {
          toast({
            variant: "destructive",
            title: "Registration failed",
            description: data.error || "Something went wrong",
          })
          setIsLoading(false)
          return
        }

        toast({
          title: "Welcome to Parpra!",
          description: "Your account has been created successfully",
          className: "border-teal-200 bg-teal-50 text-teal-800",
        })

        // Auto login after registration
        await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        })

        router.push("/")
        router.refresh()
      } else {
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        })

        if (result?.error) {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: "Invalid email or password. Please try again.",
          })
          setIsLoading(false)
          return
        }

        // Successful login
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in",
          className: "border-teal-200 bg-teal-50 text-teal-800",
        })

        // Fetch session to get the role
        const sessionRes = await fetch("/api/auth/session")
        const session = await sessionRes.json()

        if (session?.user?.role === "admin") {
          router.push("/dashboard")
        }

        router.refresh()
      }

      setShowPopup(false)
      onClose()
    } catch (err) {
      console.error("Auth error:", err)
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "An unexpected error occurred. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onForgotPasswordSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to send reset email",
        })
        return
      }

      setEmailSent(true)
      toast({
        title: "Reset Email Sent!",
        description: "Check your email for password reset instructions",
        className: "border-teal-200 bg-teal-50 text-teal-800",
      })
    } catch (error) {
      console.error("Forgot password error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!showPopup) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[999] p-4">
      <div className="flex h-[90vh] w-full max-w-5xl bg-white rounded-lg overflow-hidden relative shadow-lg">
        <div className="w-1/2 h-full hidden md:block bg-gray-100 relative">
          <Image
            src={LoginImg || "/placeholder.svg"}
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
                setShowPopup(false)
                onClose()
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Forgot Password View */}
            {isForgotPassword ? (
              <div className="space-y-6">
                {!emailSent ? (
                  <>
                    <div className="text-center">
                      <h2 className="text-2xl md:text-3xl font-bold text-teal-900 mb-2">Forgot Password?</h2>
                      <p className="text-gray-600 text-sm">
                        Enter your email address and we'll send you a link to reset your password.
                      </p>
                    </div>

                    <Form {...forgotPasswordForm}>
                      <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
                        <FormField
                          name="email"
                          control={forgotPasswordForm.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Enter your email address *"
                                  {...field}
                                  className="focus:border-teal-500 focus:ring-teal-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full bg-teal-700 hover:bg-teal-800" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending Reset Link...
                            </>
                          ) : (
                            "Send Reset Link"
                          )}
                        </Button>
                      </form>
                    </Form>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleBackToLogin}
                        className="text-sm text-teal-700 hover:text-teal-800 flex items-center justify-center gap-1"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Login
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-teal-900">Check Your Email</h2>
                    <p className="text-gray-600 text-sm">
                      We've sent a password reset link to your email address. Please check your inbox and follow the
                      instructions to reset your password.
                    </p>
                    <div className="space-y-2">
                      <Button
                        onClick={handleBackToLogin}
                        variant="outline"
                        className="w-full border-teal-200 text-teal-700 hover:bg-teal-50"
                      >
                        Back to Login
                      </Button>
                      <button
                        type="button"
                        onClick={() => setEmailSent(false)}
                        className="text-sm text-gray-500 hover:text-teal-700 w-full"
                      >
                        Didn't receive the email? Try again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login/Signup View */
              <>
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-teal-900">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h2>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {isSignUp && (
                      <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Your name *"
                                {...field}
                                className="focus:border-teal-500 focus:ring-teal-500"
                              />
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
                            <Input
                              placeholder="E-mail address *"
                              {...field}
                              className="focus:border-teal-500 focus:ring-teal-500"
                            />
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
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password *"
                                {...field}
                                className="focus:border-teal-500 focus:ring-teal-500 pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-700 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {!isSignUp && (
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-sm text-gray-500 hover:text-teal-900 transition-colors"
                        >
                          Forgot Password?
                        </button>
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
                                className="data-[state=checked]:bg-teal-700 data-[state=checked]:border-teal-700"
                              />
                            </FormControl>
                            <Label htmlFor="acceptTerms" className="text-sm">
                              I agree to the{" "}
                              <Link href="/terms" className="text-teal-600 hover:text-teal-800 hover:underline">
                                Terms & Conditions
                              </Link>
                            </Label>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <Button type="submit" className="w-full bg-teal-700 hover:bg-teal-800" disabled={isLoading}>
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
                      {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                      <button
                        type="button"
                        onClick={toggleMode}
                        className="text-teal-700 hover:text-teal-800 hover:underline ml-1 transition-colors"
                      >
                        {isSignUp ? "Log In" : "Sign Up"}
                      </button>
                    </div>
                  </form>
                </Form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPopup
