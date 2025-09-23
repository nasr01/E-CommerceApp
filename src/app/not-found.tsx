// src/app/not-found.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Frown } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="text-center p-6">
        <Frown className="mx-auto h-24 w-24 text-red-500 animate-bounce" />
        <h1 className="mt-6 text-6xl font-extrabold">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-gray-400">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="mt-6 flex gap-4 justify-center">
          <Link href="/">
            <Button className="rounded-2xl px-6 py-3 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-transform hover:scale-105">
              Go Home
            </Button>
          </Link>
          <Link href="/contact">

          </Link>
        </div>
      </div>
    </div>
  )
}
