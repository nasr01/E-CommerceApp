import { ProductI } from '@/interfaces';
import { Params } from 'next/dist/server/request/params'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import StarIcon from '@/components/Icons/StarIcon';
import ProductSlider from '@/components/Carousel/ProductSlider';
import AddToCart from '@/components/AddToCart/AddToCart';


export default async function ProductDetails({ params }: { params: Params }) {

    const { productId } = await params;

    // console.log(productId);

    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products/` + productId);

    const { data: product }: { data: ProductI } = await response.json();

    // console.log(product);

    return <>
        <Card className='grid md:grid-cols-3 items-center '>
            <div className="col-span-1">

                <ProductSlider images={product.images} altContent={product.title} />

            </div>
            <div className="md:col-span-2 w-full space-y-4 p-4">
                <CardHeader>
                    <CardDescription>{product.brand.name}</CardDescription>

                    <CardTitle>{product.title}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    {product.category.name}
                    <div className="flex justify-between items-center mt-3">
                        <p className='flex gap-2'><StarIcon />{product.ratingsAverage}</p>
                        <p className='flex gap-2'>Remaning : {product.ratingsQuantity}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                        <p className='flex gap-2'>Quantity :  {product.quantity}</p>
                        <p className='flex gap-2'> EGP : <span className='font-bold'> {product.price}</span> </p>
                    </div>
                </CardContent>
                <AddToCart productId={product.id} />
            </div>
        </Card>

    </>
}
