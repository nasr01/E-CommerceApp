import { ProductI } from "@/interfaces";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import StarIcon from "@/components/Icons/StarIcon";
import { Button } from "@/components/ui/button";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import AddToCart from "@/components/AddToCart/AddToCart";

export default async function Products() {

    const response = await fetch('https://ecommerce.routemisr.com/api/v1/products', {
        next: {
            revalidate: 10 * 60
        }
    })
    const { data: products }: { data: ProductI[] } = await response.json();


    // console.log(products[0]);


    return <>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {
                products.map((product) => <div key={product.id} className=" ">
                    <Card>
                        <Link href={'/products/' + product.id}>
                            <Image src={product.imageCover} className='w-full' alt={product.title} width={300} height={300} />
                            <CardHeader>
                                <CardTitle className="line-clamp-1">{product.title}</CardTitle>
                                <CardDescription>{product.category.name}</CardDescription>
                                <CardAction>{product.brand.name}</CardAction>
                            </CardHeader>
                            <CardContent>


                                <div className="flex">
                                    <StarIcon />
                                    <p> {product.ratingsAverage} </p>

                                    <p className="ms-auto font-bold pt-1"> Price :  {product.price}  </p>
                                </div>


                            </CardContent>
                        </Link>
                        <AddToCart productId={product.id} />
                    </Card>
                </div>)
            }
        </div>


    </>
}
