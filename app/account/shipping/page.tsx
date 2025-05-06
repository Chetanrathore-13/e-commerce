"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AccountSidebar from "@/components/account-sidebar"

interface Address {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipcode: string
  country: string
  phone: string
  isDefault: boolean
}

export default function ShippingPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Chetan Rathore",
      address: "123 Main Street, Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      zipcode: "400001",
      country: "India",
      phone: "9876543210",
      isDefault: true,
    },
  ])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Address, "id" | "isDefault">>({
    name: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "India",
    phone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      // Update existing address
      setAddresses(addresses.map((addr) => (addr.id === editingId ? { ...addr, ...formData } : addr)))
      setEditingId(null)
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0, // Make default if it's the first address
      }
      setAddresses([...addresses, newAddress])
    }

    setIsAddingNew(false)
    resetForm()
  }

  const startEditing = (address: Address) => {
    setFormData({
      name: address.name,
      address: address.address,
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
      country: address.country,
      phone: address.phone,
    })
    setEditingId(address.id)
    setIsAddingNew(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      zipcode: "",
      country: "India",
      phone: "",
    })
  }

  const cancelForm = () => {
    setIsAddingNew(false)
    setEditingId(null)
    resetForm()
  }

  const setAsDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    )
  }

  const deleteAddress = (id: string) => {
    const isDefault = addresses.find((addr) => addr.id === id)?.isDefault
    let newAddresses = addresses.filter((addr) => addr.id !== id)

    // If we deleted the default address and there are other addresses, make the first one default
    if (isDefault && newAddresses.length > 0) {
      newAddresses = newAddresses.map((addr, index) => ({
        ...addr,
        isDefault: index === 0,
      }))
    }

    setAddresses(newAddresses)
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <span className="font-medium">My Shipping Details</span>
        </nav>

        <h1 className="text-2xl font-bold mb-8">MY SHIPPING DETAILS</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <AccountSidebar activeItem="shipping" />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white p-4 md:p-6 rounded-md shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">My Addresses</h2>
                {!isAddingNew && (
                  <Button
                    className="bg-amber-700 hover:bg-amber-800 flex items-center gap-2"
                    onClick={() => setIsAddingNew(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Add New Address
                  </Button>
                )}
              </div>

              {isAddingNew ? (
                <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md">
                  <h3 className="font-medium text-lg">{editingId ? "Edit Address" : "Add New Address"}</h3>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipcode">Zipcode</Label>
                      <Input id="zipcode" name="zipcode" value={formData.zipcode} onChange={handleChange} required />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button type="submit" className="bg-amber-700 hover:bg-amber-800">
                      {editingId ? "Update Address" : "Save Address"}
                    </Button>
                    <Button type="button" variant="outline" onClick={cancelForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You don't have any saved addresses yet.</p>
                  <Button className="bg-amber-700 hover:bg-amber-800" onClick={() => setIsAddingNew(true)}>
                    Add Your First Address
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-md p-4 relative">
                      {address.isDefault && (
                        <span className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                      <div className="mb-4">
                        <h3 className="font-medium">{address.name}</h3>
                        <p className="text-gray-600">{address.address}</p>
                        <p className="text-gray-600">
                          {address.city}, {address.state} {address.zipcode}
                        </p>
                        <p className="text-gray-600">{address.country}</p>
                        <p className="text-gray-600">Phone: {address.phone}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditing(address)}
                          className="text-amber-700 border-amber-700"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteAddress(address.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                        {!address.isDefault && (
                          <Button variant="outline" size="sm" onClick={() => setAsDefault(address.id)}>
                            Set as Default
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
