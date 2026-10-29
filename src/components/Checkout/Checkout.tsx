import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "../ui/button"
import { useRef } from "react"

export default function Checkout({ cartId }: { cartId: string }) {

    const detailsInput = useRef<HTMLInputElement | null>(null);
    const cityInput = useRef<HTMLInputElement | null>(null);
    const phoneInput = useRef<HTMLInputElement | null>(null);

    async function checkOutSession() {

        const shippingAddress = {
            details: detailsInput.current?.value,
            city: cityInput.current?.value,
            phone: phoneInput.current?.value,


        }
        console.log(shippingAddress);

        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=http://localhost:3000`, {
            method: 'POST',
            body: JSON.stringify({ shippingAddress }),
            headers: {
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODY1YmQ2NDA5YTQ0MzA0MTkxNzU5NiIsIm5hbWUiOiJBaG1lZCBBYmQgQWwtTXV0aSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU3OTUyODY3LCJleHAiOjE3NjU3Mjg4Njd9.ert4_SIIuwK2YErGrWwDKrXwjXD_rcQ_nVKAQNKnIr4",
                "Content-Type": "application/json"
            }
        });


        const data = await response.json();

        if (data.status == 'success') {
            location.href = data.session.url

        }


    }
    return <>


        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button className="w-full">Proceed to Checkout</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Shipping Address</DialogTitle>
                        <DialogDescription>
                            Please Add Shipping Address
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="city">City</Label>
                            <Input ref={cityInput} id="city" />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="details">Details</Label>
                            <Input ref={detailsInput} id="details" />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="phone">Phone</Label>
                            <Input ref={phoneInput} id="phone" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Cash</Button>
                        <Button onClick={checkOutSession} className="cursor-pointer" type="submit">Visa</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>

    </>
}
