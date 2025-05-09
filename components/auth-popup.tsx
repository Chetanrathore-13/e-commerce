"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import LoginImg from "../public/loginimage/login.jpg"

const AuthPopup = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPopup, setShowPopup] = useState(true) // Set to true by default
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid"

    if (!password) newErrors.password = "Password is required"
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters"

    if (isSignUp) {
      if (!firstName) newErrors.firstName = "First name is required"
      if (!lastName) newErrors.lastName = "Last name is required"
      if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password"
      else if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match"
      if (!acceptTerms) newErrors.terms = "You must accept the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Here you would typically call your authentication API
      console.log("Form submitted:", { email, password, firstName, lastName })

      // For demo purposes, just close the popup
      alert(`${isSignUp ? "Sign up" : "Sign in"} successful!`)
      setShowPopup(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setFirstName("")
    setLastName("")
    setConfirmPassword("")
    setAcceptTerms(false)
    setErrors({})
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    resetForm()
  }

  // Handle escape key to close popup
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowPopup(false)
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [])

  return (
    <>
      {/* Popup Form - Always visible */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="flex h-[90vh] w-full max-w-5xl bg-white rounded-lg overflow-hidden relative shadow-lg">
            {/* Left Image Section */}
            <div className="w-1/2 h-full hidden md:block bg-gray-100 relative">
              <Image src={LoginImg} alt="login visual" fill className="object-cover" priority />
            </div>

            {/* Right Form Section */}
            <div className="w-full md:w-1/2 flex justify-center items-center p-6 md:p-10 relative">
              <div className="w-full max-w-md">
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </button>

                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-teal-900">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <Input
                      type="email"
                      placeholder="E-mail address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full p-3 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-teal-900`}
                      required
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {isSignUp && (
                    <>
                      <div>
                        <Input
                          type="text"
                          placeholder="First name *"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={`w-full p-3 border ${errors.firstName ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-teal-900`}
                          required
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>

                      <div>
                        <Input
                          type="text"
                          placeholder="Last name *"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={`w-full p-3 border ${errors.lastName ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-teal-900`}
                          required
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </>
                  )}

                  <div>
                    <Input
                      type="password"
                      placeholder="Password *"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full p-3 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-teal-900`}
                      required
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  {isSignUp && (
                    <div>
                      <Input
                        type="password"
                        placeholder="Confirm password *"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full p-3 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-teal-900`}
                        required
                      />
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                  )}

                  {!isSignUp && (
                    <a href="#" className="text-sm text-gray-500 block text-right hover:text-teal-900">
                      Forgot Password?
                    </a>
                  )}

                  {isSignUp && (
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                        className="mt-1"
                      />
                      <div>
                        <Label htmlFor="terms" className="text-sm">
                          I accept{" "}
                          <a href="#" className="text-teal-900 underline">
                            terms and conditions
                          </a>{" "}
                          *
                        </Label>
                        {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-teal-900 hover:bg-teal-800 text-white p-3 rounded font-semibold"
                  >
                    {isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
                  </Button>
                </form>

                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                    <button onClick={toggleMode} className="text-teal-900 underline font-medium" type="button">
                      {isSignUp ? "Sign in" : "Sign up"}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AuthPopup
