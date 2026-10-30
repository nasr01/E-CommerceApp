"use client"

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Mail, User, ShoppingBag, Package, Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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

export default function Profile() {
    const { data: session, status } = useSession()
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoadingOrders, setIsLoadingOrders] = useState(true)

    useEffect(() => {
        async function fetchOrders() {
            if (status === 'authenticated') {
                try {
                    const userId = localStorage.getItem('userId')
                    if (userId) {
                        const response = await fetch(
                            `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`
                        )
                        const data = await response.json()
                        setOrders(data)
                    }
                } catch (error) {
                    console.error('Error fetching orders:', error)
                } finally {
                    setIsLoadingOrders(false)
                }
            }
        }

        fetchOrders()
    }, [status])

    if (status === 'loading') {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <Loader2 className="animate-spin size-12" />
            </div>
        )
    }

    if (!session) {
        return (
            <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
                <h2 className="text-2xl font-semibold">Please login to view your profile</h2>
                <Link href="/login">
                    <Button>Go to Login</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-8 px-4 md:px-20 py-6">
            {/* Profile Header */}
            <div className="flex items-center gap-6">
                <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="size-12 text-primary" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold">{session.user.name}</h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-2">
                        <Mail className="size-4" />
                        {session.user.email}
                    </p>
                    <Badge variant="secondary" className="mt-2 capitalize">
                        {session.user.role}
                    </Badge>
                </div>
            </div>

            {/* Profile Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Full Name
                            </label>
                            <p className="text-lg font-semibold">{session.user.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Email Address
                            </label>
                            <p className="text-lg font-semibold">{session.user.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Account Type
                            </label>
                            <p className="text-lg font-semibold capitalize">{session.user.role}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                        <ShoppingBag className="size-8" />
                        My Orders
                    </h2>
                    <Badge variant="outline" className="text-lg px-4 py-2">
                        {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                    </Badge>
                </div>

                {isLoadingOrders ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="animate-spin size-12" />
                    </div>
                ) : orders.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Package className="size-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Start shopping to see your orders here
                            </p>
                            <Link href="/products">
                                <Button>Browse Products</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Card key={order._id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl">
                                                Order #{order._id.slice(-8).toUpperCase()}
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-2 mt-1">
                                                <Calendar className="size-4" />
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </CardDescription>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">
                                                EGP {order.totalOrderPrice}
                                            </p>
                                            <div className="flex gap-2 mt-2">
                                                <Badge
                                                    variant={order.isPaid ? 'default' : 'secondary'}
                                                >
                                                    {order.isPaid ? 'Paid' : 'Unpaid'}
                                                </Badge>
                                                <Badge
                                                    variant={
                                                        order.isDelivered ? 'default' : 'outline'
                                                    }
                                                >
                                                    {order.isDelivered ? 'Delivered' : 'Pending'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span className="font-medium">Payment Method:</span>
                                            <span className="capitalize">
                                                {order.paymentMethodType}
                                            </span>
                                        </div>

                                        <div className="border-t pt-3">
                                            <h4 className="font-semibold mb-3">
                                                Order Items ({order.cartItems.length})
                                            </h4>
                                            <div className="space-y-3">
                                                {order.cartItems.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                                                    >
                                                        <Image
                                                            src={item.product.imageCover}
                                                            alt={item.product.title}
                                                            width={80}
                                                            height={80}
                                                            className="rounded-md object-cover"
                                                        />
                                                        <div className="flex-1">
                                                            <h5 className="font-semibold line-clamp-1">
                                                                {item.product.title}
                                                            </h5>
                                                            <p className="text-sm text-muted-foreground">
                                                                {item.product.brand.name} •{' '}
                                                                {item.product.category.name}
                                                            </p>
                                                            <p className="text-sm mt-1">
                                                                Quantity: {item.count} × EGP{' '}
                                                                {item.price}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold">
                                                                EGP {item.count * item.price}
                                                            </p>
                                                        </div>
                                                    </div>
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
        </div>
    )
}
