"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1 flex-1 min-w-0">
          <p className="text-sm font-medium leading-none truncate">Organic Cotton T-Shirt</p>
          <p className="text-sm text-muted-foreground">Added 2 hours ago</p>
        </div>
        <div className="ml-auto font-medium">+$29.99</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1 flex-1 min-w-0">
          <p className="text-sm font-medium leading-none truncate">Leather Jacket</p>
          <p className="text-sm text-muted-foreground">Added 4 hours ago</p>
        </div>
        <div className="ml-auto font-medium">+$199.99</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1 flex-1 min-w-0">
          <p className="text-sm font-medium leading-none truncate">Summer Dress</p>
          <p className="text-sm text-muted-foreground">Added 6 hours ago</p>
        </div>
        <div className="ml-auto font-medium">+$49.99</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>SW</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1 flex-1 min-w-0">
          <p className="text-sm font-medium leading-none truncate">Sports Watch</p>
          <p className="text-sm text-muted-foreground">Added 12 hours ago</p>
        </div>
        <div className="ml-auto font-medium">+$129.99</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>CS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1 flex-1 min-w-0">
          <p className="text-sm font-medium leading-none truncate">Casual Sneakers</p>
          <p className="text-sm text-muted-foreground">Added 1 day ago</p>
        </div>
        <div className="ml-auto font-medium">+$89.99</div>
      </div>
    </div>
  )
}
