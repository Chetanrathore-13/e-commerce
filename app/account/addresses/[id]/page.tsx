"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import UserAccountSidebar from "@/components/user-account-sidebar"

interface Address {
  _id: string
  full_name: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
  is_default: boolean
}

export default function EditAddressPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Form state
  const [fullName, setFullName] = useState("")
  const [addressLine1, setAddressLine1] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("India")
  const [phone, setPhone] = useState("")
  const [isDefault, setIsDefault] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?redirect=/account/addresses/${params.id}`)
    }

    if (status === "authenticated") {
      fetchAddress()
    }
  }, [status, router, params.id])

  const fetchAddress = async () => {
    try {
      const response = await fetch(`/api/user/addresses/${params.id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch address")
      }
      const data = await response.json()
      const address = data.address

      setFullName(address.full_name)
      setAddressLine1(address.address_line1)
      setAddressLine2(address.address_line2 || "")
      setCity(address.city)
      setState(address.state)
      setPostalCode(address.postal_code)
      setCountry(address.country)
      setPhone(address.phone)
      setIsDefault(address.is_default)
    } catch (error) {
      console.error("Error fetching address:", error)
      toast({
        title: "Error",
        description: "Failed to load address",
        variant: "destructive",
      })
      router.push("/account/addresses")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/user/addresses/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          address_line1: addressLine1,
          address_line2: addressLine2,
          city,
          state,
          postal_code: postalCode,
          country,
          phone,
          is_default: isDefault,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update address")
      }

      toast({
        title: "Success",
        description: "Address updated successfully",
      })

      router.push("/account/addresses")
    } catch (error) {
      console.error("Error updating address:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update address",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="bg-neutral-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <Skeleton className="h-[400px] w-full rounded-md" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-12 w-1/3 mb-6" />
              <Skeleton className="h-[400px] w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <UserAccountSidebar activeItem="addresses" />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white p-6 rounded-md shadow-sm">
              <h1 className="text-2xl font-medium mb-6">Edit Address</h1>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1</Label>
                  <Input
                    id="addressLine1"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                  <Input id="addressLine2" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" value={state} onChange={(e) => setState(e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isDefault"
                    checked={isDefault}
                    onCheckedChange={(checked) => setIsDefault(checked as boolean)}
                  />
                  <Label htmlFor="isDefault" className="cursor-pointer">
                    Set as default address
                  </Label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button type="submit" className="bg-amber-700 hover:bg-amber-800" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Update Address"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.push("/account/addresses")}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
