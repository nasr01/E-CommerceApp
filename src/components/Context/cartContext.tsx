"use client"

import { CartResponse } from '@/interfaces';
import { useSession } from 'next-auth/react';
import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react'

export const cartContext = createContext<{
    cartData: CartResponse | null,
    setCartData: (value: CartResponse | null) => void,
    isLoading: boolean,
    setIsLoading: (value: boolean) => void,
    getCart: () => void,



}>({
    cartData: null,
    setCartData: () => { },
    isLoading: false,
    setIsLoading: () => { },
    getCart: () => { },


});

export default function CartContextProvider({ children }: { children: ReactNode }) {

    const [cartData, setCartData] = useState<CartResponse | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const session = useSession()

    const getCart = useCallback(async () => {

        if (session.status == 'authenticated') {

            const response = await fetch('http://localhost:3000/api/get-cart');
            const data: CartResponse = await response.json();

            setCartData(data);
            if (data?.data?.cartOwner) {
                localStorage.setItem('userId', data.data.cartOwner)

            }
            console.log(data);
        }
        setIsLoading(false);

    }, [session.status])
    
    useEffect(() => {
        if (session.status == "authenticated") {

            getCart()
        }

    }, [session.status, getCart])

    return <cartContext.Provider value={{ cartData, setCartData, isLoading, setIsLoading, getCart }}>
        {children}
    </cartContext.Provider>


}