"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2, ShoppingCartIcon, UserIcon } from "lucide-react"
import { useContext } from "react"
import { cartContext } from "../Context/cartContext"
import { Badge } from "../ui/badge"
import { signOut, useSession } from "next-auth/react"
export default function Navbar() {

  const { isLoading, cartData } = useContext(cartContext)

  const session = useSession();

  console.log(session);



  return <>

    <nav className="py-3 mb-3 bg-gray-50 shadow text-2xl font-semibold sticky top-0 z-10">
      <div className="container">
        <div className="flex justify-between items-center">

          <h1> <Link href={'/'}> Shop Mart </Link> </h1>

          <NavigationMenu>
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
          <div className="flex items-center">
            {session.status == 'authenticated' && <h2 className="text-sm me-2">Hi {session.data?.user.name}</h2>}
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-0"> <UserIcon /> </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                {session.status == "authenticated" ? <>
                  <Link href={"/profile"}>
                    <DropdownMenuItem>
                      Profile
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

            {session.status == 'authenticated' &&
              <Link href={"/cart"}>
                <div className="ms-2 p-3 relative">

                  <ShoppingCartIcon />

                  <Badge className="  size-4 pb-1.5 pt-1 px-1 rounded-full absolute top-0 end-0 ">
                    <span> {isLoading ? <Loader2 className="animate-spin size-4" /> : cartData?.numOfCartItems} </span>
                  </Badge>

                </div>
              </Link>}

          </div>

        </div>
      </div>
    </nav>

  </>
}
