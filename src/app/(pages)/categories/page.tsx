import { CategoryI } from '@/interfaces'
import Image from 'next/image'
import Link from 'next/link'
import {
  Card,
  CardContent,
} from "@/components/ui/card"

export default async function Categories() {
  const response = await fetch('https://ecommerce.routemisr.com/api/v1/categories', {
    next: {
      revalidate: 10 * 60
    }
  })
  
  const { data: categories }: { data: CategoryI[] } = await response.json()

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">All Categories</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link 
            key={category._id} 
            href={`/products?category=${category._id}`}
            className="transition-transform hover:scale-105"
          >
            <Card className="h-full overflow-hidden">
              <div className="aspect-video relative">
                <Image 
                  src={category.image} 
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-center font-bold text-lg">
                  {category.name}
                </h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
