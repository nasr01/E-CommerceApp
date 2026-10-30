"use client"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2, ShoppingCartIcon, UserIcon, Menu, X } from "lucide-react"
import { useContext, useState } from "react"
import { cartContext } from "../Context/cartContext"
import { Badge } from "../ui/badge"
import { signOut, useSession } from "next-auth/react"
import { Button } from "../ui/button"

export default function Navbar() {

  const { isLoading, cartData } = useContext(cartContext)
  const session = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  console.log(session);



  return <>

    <nav className="py-3 mb-3 bg-gray-50 shadow text-2xl font-semibold sticky top-0 z-50 px-4 md:px-20">
      <div className="container">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <h1 className="text-xl md:text-2xl"> 
            <Link href={'/'}> Shop Mart </Link> 
          </h1>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/products">Products</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/categories">Categories</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/brands">Brands</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2">
            {/* User Greeting - Hidden on mobile */}
            {session.status == 'authenticated' && (
              <h2 className="hidden sm:block text-sm">Hi {session.data?.user.name}</h2>
            )}

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-0 p-2"> 
                <UserIcon className="size-6" /> 
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                {session.status == "authenticated" ? <>
                  <Link href={"/profile"}>
                    <DropdownMenuItem>
                      Profile
                    </DropdownMenuItem>
                  </Link>

                  <Link href={"/allorders"}>
                    <DropdownMenuItem>
                      My Orders
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuItem onClick={() => signOut({
                    callbackUrl: '/'
                  })}>LogOut</DropdownMenuItem>

                </>
                  :
                  <>
                    <Link href={"/login"}>
                      <DropdownMenuItem>
                        Login
                      </DropdownMenuItem>
                    </Link>
                    <Link href={"/register"}>
                      <DropdownMenuItem>
                        Register
                      </DropdownMenuItem>
                    </Link>
                  </>}

              </DropdownMenuContent>
            </DropdownMenu>

            {/* Shopping Cart */}
            {session.status == 'authenticated' &&
              <Link href={"/cart"}>
                <div className="p-2 relative">
                  <ShoppingCartIcon className="size-6" />
                  <Badge className="size-5 p-0 flex items-center justify-center rounded-full absolute -top-1 -right-1 text-xs">
                    {isLoading ? <Loader2 className="animate-spin size-3" /> : cartData?.numOfCartItems}
                  </Badge>
                </div>
              </Link>
            }

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </Button>
          </div>

        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4 space-y-2">
            <Link 
              href="/products" 
              className="block py-2 px-4 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              href="/categories" 
              className="block py-2 px-4 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              href="/brands" 
              className="block py-2 px-4 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Brands
            </Link>
          </div>
        )}
      </div>
    </nav>

  </>
}
