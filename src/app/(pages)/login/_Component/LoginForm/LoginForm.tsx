"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    email: z.email('Invalid Email').nonempty('Email Is Required'),
    password: z.string('Invalid Password').nonempty('Password Is Required')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,20}$/, 'Invalid Password')
})

type FormFields = z.infer<typeof formSchema>
export function LoginForm() {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    let searchParams = useSearchParams();
    const callbackURL = searchParams.get('callback-url')


    // 1. Define your form.
    const form = useForm<FormFields>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: FormFields) {
        setIsLoading(true)
        const response = await signIn('credentials', {
            callbackUrl: callbackURL ?? '/',
            redirect: true,
            email: values.email,
            password: values.password
        })
        // console.log(response);
        setIsLoading(false)


    }
    return <>
        <Card className="p-6 w-sm">

            <Form {...form}>
                {searchParams.get('error') ?
                    <h1 className="text-destructive text-2xl text-center py-3">{searchParams.get('error')}</h1>
                    : ''
                }
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="ali@example.com" type="email" {...field} />
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
                    <Button disabled={isLoading} type="submit" className="cursor-pointer w-full">{isLoading && <Loader2 className="animate-spin" />} Submit</Button>
                </form>
            </Form>
        </Card>

    </>
}