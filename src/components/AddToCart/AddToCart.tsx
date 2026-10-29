"use client"

import React, { useContext, useState } from 'react'
import { CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { HeartIcon, Loader2, ShoppingCartIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { cartContext } from '../Context/cartContext'
import { addToCartAction } from '@/app/(pages)/products/_action/addToCart.action'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AddToCart({ productId }: { productId: string }) {
    const [isLoading, setIsLoading] = useState(false)

    const { setCartData } = useContext(cartContext)
    const session = useSession();
    const router = useRouter()
    async function addProductToCart() {

        if (session.status == 'authenticated') {
            setIsLoading(true);
            const data = await addToCartAction(productId)
            // await getCart();
            setCartData(data);

            if (data.status == 'success') {
                toast.success(data.message);
            }

            setIsLoading(false);

            console.log(data);
        } else {
            router.push('/login')
        }

    }



    return <>
        <CardFooter className="gap-1.5">
            <Button disabled={isLoading} onClick={addProductToCart} className="grow cursor-pointer"> {isLoading ? <Loader2 className='animate-spin' /> : <ShoppingCartIcon />} Add to cart</Button>
            <HeartIcon />
        </CardFooter>
    </>
}
