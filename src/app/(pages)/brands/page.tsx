import { BrandI } from '@/interfaces/category'
import Image from 'next/image'
import Link from 'next/link'
import {
  Card,
  CardContent,
} from "@/components/ui/card"

export default async function Brands() {
  const response = await fetch('https://ecommerce.routemisr.com/api/v1/brands', {
    next: {
      revalidate: 10 * 60
    }
  })
  
  const { data: brands }: { data: BrandI[] } = await response.json()

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">All Brands</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {brands.map((brand) => (
          <Link 
            key={brand._id} 
            href={`/products?brand=${brand._id}`}
            className="transition-transform hover:scale-105"
          >
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="aspect-square relative mb-3">
                  <Image 
                    src={brand.image} 
                    alt={brand.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-center font-semibold text-sm line-clamp-1">
                  {brand.name}
                </h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
