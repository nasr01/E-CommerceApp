"use client"

import Loading from "@/app/loading";
import Checkout from "@/components/Checkout/Checkout";
import { cartContext } from "@/components/Context/cartContext";
import { Button } from "@/components/ui/button";
import { CartResponse } from "@/interfaces";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useContext, useState } from "react";
import toast from "react-hot-toast";


export default function Cart() {



  let { cartData, isLoading, getCart, setCartData } = useContext(cartContext)

  const [removingId, setRemovingId] = useState<string | null>(null)
  const [updateId, setUpdateId] = useState<string | null>(null)
  const [isClearing, setIsClearing] = useState<boolean>(false)

  if (typeof cartData?.data.products[0]?.product == 'string' || cartData == null) { getCart(); }


  async function removeCartItem(productId: string) {
    setRemovingId(productId)
    const response = await fetch('https://ecommerce.routemisr.com/api/v1/cart/' + productId, {
      method: 'DELETE',
      headers: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODY1YmQ2NDA5YTQ0MzA0MTkxNzU5NiIsIm5hbWUiOiJBaG1lZCBBYmQgQWwtTXV0aSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU3OTUyODY3LCJleHAiOjE3NjU3Mjg4Njd9.ert4_SIIuwK2YErGrWwDKrXwjXD_rcQ_nVKAQNKnIr4",
      }
    });
    const data: CartResponse = await response.json();
    console.log(data);

    if (data.status == 'success') {
      toast.success("product Removed Succesfully")
      setCartData(data)

    }

    setRemovingId(null)

  }

  async function clearCart() {
    setIsClearing(true)
    const response = await fetch('https://ecommerce.routemisr.com/api/v1/cart/', {
      method: 'DELETE',
      headers: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODY1YmQ2NDA5YTQ0MzA0MTkxNzU5NiIsIm5hbWUiOiJBaG1lZCBBYmQgQWwtTXV0aSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU3OTUyODY3LCJleHAiOjE3NjU3Mjg4Njd9.ert4_SIIuwK2YErGrWwDKrXwjXD_rcQ_nVKAQNKnIr4",
      }
    });
    const data: CartResponse = await response.json();
    console.log(data);

    if (data.message == 'success') {
      setCartData(null)

    }

    setIsClearing(false)

  }

  async function updateCartItemCount(productId: string, count: number) {
    if (count == 0) {
      removeCartItem(productId)
    } else {
      setUpdateId(productId)
      const response = await fetch('https://ecommerce.routemisr.com/api/v1/cart/' + productId, {
        method: 'PUT',
        body: JSON.stringify({ count }),
        headers: {
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODY1YmQ2NDA5YTQ0MzA0MTkxNzU5NiIsIm5hbWUiOiJBaG1lZCBBYmQgQWwtTXV0aSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU3OTUyODY3LCJleHAiOjE3NjU3Mjg4Njd9.ert4_SIIuwK2YErGrWwDKrXwjXD_rcQ_nVKAQNKnIr4",
          "Content-Type": "application/json"
        }
      });
      const data: CartResponse = await response.json();
      console.log(data);

      if (data.status == 'success') {
        toast.success("product Quantity Updated Succesfully")
        setCartData(data)

      }

      setUpdateId(null)
    }

  }






  return <>

    {isLoading || typeof cartData?.data.products[0]?.product == 'string' ? <Loading /> : cartData?.numOfCartItems! > 0 ?
      <div className="container  mx-auto p-6 ">
        <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
        <p className="text-gray-500 mb-6">{cartData?.numOfCartItems} items in your cart</p>

        <div className="grid xl:grid-cols-3 gap-6 relative">
          {/* Left side */}
          {cartData?.data.products.map((product) =>
            <div key={product._id}
              className="xl:col-span-2">
              <div className="flex items-center justify-between border rounded-lg p-4 shadow-sm">
                {/* Product Image */}
                <img
                  src={product.product.imageCover}
                  alt="Product"
                  className="w-24 h-24 rounded-lg object-cover"
                />

                {/* Product Details */}
                <div className="flex-1 px-4">

                  <h2 className="font-semibold"> {product.product.title} </h2>

                  <p className="text-gray-500 text-sm">
                    {product.product.brand.name} {product.product.category.name}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">

                    <button
                      aria-label="decrease"
                      disabled={product.count == 1}
                      onClick={() => updateCartItemCount(product.product._id, product.count - 1)}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      -
                    </button>

                    <span>{updateId === product.product._id ? <Loader2 className="animate-spin " /> : product.count}</span>

                    <button
                      aria-label="increase"
                      onClick={() => updateCartItemCount(product.product._id, product.count + 1)}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      +
                    </button>

                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="font-semibold">EGP {product.price}</p>
                  <button onClick={() => removeCartItem(product.product.id)}
                    disabled={removingId == product.product.id}
                    className="text-red-500 text-sm mt-2 hover:underline cursor-pointer flex gap-1 items-center">
                    {removingId == product.product.id && <Loader2 className="animate-spin size-3" />} Remove
                  </button>
                </div>
              </div>
            </div>)}


          {/* Right side (Order Summary) */}
          <div className="xl:absolute xl:w-fit top-0 end-0">
            <div className=" xl:col-span-1 border rounded-lg p-4 shadow-sm   ">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal ({cartData?.numOfCartItems} items)</span>
                <span>EGP {cartData?.data.totalCartPrice}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>EGP {cartData?.data.totalCartPrice}</span>
              </div>

              <Checkout cartId={cartData?.cartId!} />

              <Link href={'/products'}>
                <button className="w-full border py-2 mt-2 rounded-lg hover:bg-gray-100">
                  Continue Shopping
                </button>
              </Link>
            </div>

            <Button onClick={clearCart} className="my-2 text-destructive hover:text-destructive ms-auto  flex cursor-pointer" variant={"outline"}>
              {isClearing ? <Loader2 className="animate-spin " /> : <Trash2 />} Clear Cart </Button>
          </div>
        </div>
      </div> : <div className="min-h-[60vh] flex justify-center items-center flex-col">
        <h2 className="text-2xl m-3">Your Cart Is Empty</h2>
        <Link href={'/products'}>
          <Button>
            Shopping And Add Products
          </Button>
        </Link>
      </div>

    }

  </>
}
