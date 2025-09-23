"use client"
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import CartContextProvider from "@/components/Context/cartContext";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
export default function Provider({ children }: { children: ReactNode }) {
    return <>
        <SessionProvider>
            <CartContextProvider>

                <Navbar />

                <div className="container py-5">
                    {children}
                    <Toaster />
                </div>

                <Footer />

            </CartContextProvider>
        </SessionProvider>
    </>
}
