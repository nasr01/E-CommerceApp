'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Package, Calendar, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from "next-auth/react"

interface Order {
    _id: string
    cartItems: Array<{
        count: number
        price: number
        product: {
            _id: string
            title: string
            imageCover: string
            category: {
                name: string
            }
            brand: {
                name: string
            }
        }
    }>
    totalOrderPrice: number
    paymentMethodType: string
    isPaid: boolean
    isDelivered: boolean
    createdAt: string
    user: {
        name: string
        email: string
    }
}

export default function AllOrders() {
    const { status } = useSession()
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)

    async function getOrders() {
        try {
            const userId = localStorage.getItem('userId')
            if (userId) {
                const response = await fetch(
                    `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`
                )
                const data = await response.json()
                setOrders(data)
                console.log(data)
            }
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (status === 'authenticated') {
            getOrders()
        }
    }, [status])

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <Loader2 className="animate-spin size-12" />
            </div>
        )
    }

    return (
        <div className="space-y-6 px-4 md:px-20 py-6">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold flex items-center gap-3">
                    <ShoppingBag className="size-10" />
                    All Orders
                </h1>
                <Badge variant="outline" className="text-lg px-4 py-2">
                    {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </Badge>
            </div>

            {orders.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Package className="size-20 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-2xl font-semibold mb-2">No orders found</h3>
                        <p className="text-muted-foreground mb-6">
                            You haven&apos;t placed any orders yet. Start shopping now!
                        </p>
                        <Link href="/products">
                            <Button size="lg">Browse Products</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card key={order._id} className="overflow-hidden">
                            <CardHeader className="bg-muted/50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl">
                                            Order #{order._id.slice(-8).toUpperCase()}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-2">
                                            <Calendar className="size-4" />
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-primary">
                                            EGP {order.totalOrderPrice.toLocaleString()}
                                        </p>
                                        <div className="flex gap-2 mt-3 justify-end">
                                            <Badge variant={order.isPaid ? 'default' : 'destructive'}>
                                                {order.isPaid ? 'Paid' : 'Unpaid'}
                                            </Badge>
                                            <Badge
                                                variant={order.isDelivered ? 'default' : 'secondary'}
                                            >
                                                {order.isDelivered ? 'Delivered' : 'In Progress'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4 pb-4 border-b">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Customer
                                            </label>
                                            <p className="font-semibold">{order.user.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.user.email}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Payment Method
                                            </label>
                                            <p className="font-semibold capitalize">
                                                {order.paymentMethodType}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-lg mb-4">
                                            Order Items ({order.cartItems.length})
                                        </h4>
                                        <div className="space-y-3">
                                            {order.cartItems.map((item, index) => (
                                                <Link
                                                    key={index}
                                                    href={`/products/${item.product._id}`}
                                                    className="block"
                                                >
                                                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                                                        <Image
                                                            src={item.product.imageCover}
                                                            alt={item.product.title}
                                                            width={100}
                                                            height={100}
                                                            className="rounded-md object-cover"
                                                        />
                                                        <div className="flex-1">
                                                            <h5 className="font-semibold text-lg line-clamp-2">
                                                                {item.product.title}
                                                            </h5>
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {item.product.brand.name} •{' '}
                                                                {item.product.category.name}
                                                            </p>
                                                            <div className="flex items-center gap-4 mt-2">
                                                                <span className="text-sm">
                                                                    Quantity:{' '}
                                                                    <span className="font-semibold">
                                                                        {item.count}
                                                                    </span>
                                                                </span>
                                                                <span className="text-sm">
                                                                    Price:{' '}
                                                                    <span className="font-semibold">
                                                                        EGP {item.price}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xl font-bold">
                                                                EGP {(item.count * item.price).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

