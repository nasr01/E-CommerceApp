"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { SuccessRegisterResponse, FailedRegisterResponse } from "@/interfaces"

const formSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(50, 'Name must be less than 50 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password must be less than 20 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,20}$/, 
            'Password must contain uppercase, lowercase, number and special character'),
    rePassword: z.string(),
    phone: z.string()
        .regex(/^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/, 'Invalid Egyptian phone number')
}).refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
})

type FormFields = z.infer<typeof formSchema>

export default function Register() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [apiError, setApiError] = useState<string>('')
    const router = useRouter()

    const form = useForm<FormFields>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            rePassword: "",
            phone: ""
        },
    })

    async function onSubmit(values: FormFields) {
        setIsLoading(true)
        setApiError('')

        try {
            const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    rePassword: values.rePassword,
                    phone: values.phone
                }),
            })

            const data: SuccessRegisterResponse | FailedRegisterResponse = await response.json()

            if (response.ok && 'user' in data) {
                toast.success(data.message || 'Registration successful!')
                router.push('/login')
            } else {
                const errorData = data as FailedRegisterResponse
                if (errorData.errors && errorData.errors.length > 0) {
                    const errorMsg = errorData.errors.map(err => err.msg).join(', ')
                    setApiError(errorMsg)
                    toast.error(errorMsg)
                } else {
                    setApiError(errorData.message || 'Registration failed')
                    toast.error(errorData.message || 'Registration failed')
                }
            }
        } catch (error) {
            console.error('Registration error:', error)
            setApiError('Network error. Please try again.')
            toast.error('Network error. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[60vh] flex flex-col justify-center items-center gap-8">
            <h1 className='text-4xl font-bold'>Create Account</h1>
            <Card className="p-6 w-full max-w-md">
                <Form {...form}>
                    {apiError && (
                        <div className="text-destructive text-center py-3 mb-4 bg-destructive/10 rounded">
                            {apiError}
                        </div>
                    )}
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ahmed Ali" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ahmed@example.com" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ahmed@123" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rePassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ahmed@123" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="01012345678" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button 
                            disabled={isLoading} 
                            type="submit" 
                            className="cursor-pointer w-full"
                        >
                            {isLoading && <Loader2 className="animate-spin mr-2" />} 
                            Register
                        </Button>
                    </form>
                </Form>
            </Card>
        </div>
    )
}
