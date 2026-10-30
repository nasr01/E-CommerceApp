'use client'

import { ProductI, CategoryI, BrandI } from "@/interfaces"
import { useEffect, useState, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import StarIcon from "@/components/Icons/StarIcon"
import Link from "next/link"
import AddToCart from "@/components/AddToCart/AddToCart"
import { 
    Loader2, 
    Search, 
    SlidersHorizontal, 
    X, 
    ChevronDown,
    ShoppingBag
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Products() {
    const searchParams = useSearchParams()
    const router = useRouter()
    
    const [products, setProducts] = useState<ProductI[]>([])
    const [categories, setCategories] = useState<CategoryI[]>([])
    const [brands, setBrands] = useState<BrandI[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showFilters, setShowFilters] = useState(false)
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '')
    const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get('brand') || '')
    const [sortBy, setSortBy] = useState<string>('default')
    
    // Fetch categories and brands
    useEffect(() => {
        async function fetchFiltersData() {
            try {
                const [categoriesRes, brandsRes] = await Promise.all([
                    fetch('https://ecommerce.routemisr.com/api/v1/categories'),
                    fetch('https://ecommerce.routemisr.com/api/v1/brands')
                ])
                
                const categoriesData = await categoriesRes.json()
                const brandsData = await brandsRes.json()
                
                setCategories(categoriesData.data || [])
                setBrands(brandsData.data || [])
            } catch (error) {
                console.error('Error fetching filters:', error)
            }
        }
        
        fetchFiltersData()
    }, [])
    
    // Fetch products
    const fetchProducts = useCallback(async () => {
        setIsLoading(true)
        try {
            const queryParams = new URLSearchParams()
            
            if (selectedBrand) queryParams.append('brand', selectedBrand)
            if (selectedCategory) queryParams.append('category', selectedCategory)
            
            const url = `https://ecommerce.routemisr.com/api/v1/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`
            
            const response = await fetch(url)
            const data = await response.json()
            
            let fetchedProducts = data.data || []
            
            // Client-side search filter
            if (searchTerm) {
                fetchedProducts = fetchedProducts.filter((product: ProductI) =>
                    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            }
            
            // Client-side sorting
            if (sortBy === 'price-asc') {
                fetchedProducts.sort((a: ProductI, b: ProductI) => a.price - b.price)
            } else if (sortBy === 'price-desc') {
                fetchedProducts.sort((a: ProductI, b: ProductI) => b.price - a.price)
            } else if (sortBy === 'rating') {
                fetchedProducts.sort((a: ProductI, b: ProductI) => b.ratingsAverage - a.ratingsAverage)
            } else if (sortBy === 'name') {
                fetchedProducts.sort((a: ProductI, b: ProductI) => a.title.localeCompare(b.title))
            }
            
            setProducts(fetchedProducts)
        } catch (error) {
            console.error('Error fetching products:', error)
            setProducts([])
        } finally {
            setIsLoading(false)
        }
    }, [selectedBrand, selectedCategory, searchTerm, sortBy])
    
    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])
    
    // Handle filter changes
    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId)
        updateURL({ category: categoryId, brand: selectedBrand })
    }
    
    const handleBrandChange = (brandId: string) => {
        setSelectedBrand(brandId)
        updateURL({ category: selectedCategory, brand: brandId })
    }
    
    const clearFilters = () => {
        setSelectedCategory('')
        setSelectedBrand('')
        setSearchTerm('')
        setSortBy('default')
        updateURL({})
    }
    
    const updateURL = (params: { category?: string; brand?: string }) => {
        const query = new URLSearchParams()
        if (params.category) query.append('category', params.category)
        if (params.brand) query.append('brand', params.brand)
        router.push(`/products${query.toString() ? '?' + query.toString() : ''}`)
    }
    
    const selectedCategoryName = categories.find(c => c._id === selectedCategory)?.name
    const selectedBrandName = brands.find(b => b._id === selectedBrand)?.name
    
    return (
        <div className="space-y-6 px-4 md:px-20 py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold">Products</h1>
                    <p className="text-gray-600 mt-1">
                        {isLoading ? 'Loading...' : `${products.length} products`}
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Sort Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full sm:w-auto">
                                Sort By
                                <ChevronDown className="ml-2 size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => setSortBy('default')}>
                                Default
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('price-asc')}>
                                Price: Low to High
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('price-desc')}>
                                Price: High to Low
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('rating')}>
                                Highest Rated
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('name')}>
                                Name: A to Z
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    
                    {/* Toggle Filters Button (Mobile) */}
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden"
                    >
                        <SlidersHorizontal className="mr-2 size-4" />
                        Filters
                    </Button>
                </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search products, brands, categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        <X className="size-5 text-gray-400 hover:text-gray-600" />
                    </button>
                )}
            </div>
            
            {/* Active Filters */}
            {(selectedCategory || selectedBrand) && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {selectedCategoryName && (
                        <Badge variant="secondary" className="gap-2">
                            {selectedCategoryName}
                            <button onClick={() => handleCategoryChange('')}>
                                <X className="size-3" />
                            </button>
                        </Badge>
                    )}
                    {selectedBrandName && (
                        <Badge variant="secondary" className="gap-2">
                            {selectedBrandName}
                            <button onClick={() => handleBrandChange('')}>
                                <X className="size-3" />
                            </button>
                        </Badge>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-sm"
                    >
                        Clear all
                    </Button>
                </div>
            )}
            
            <div className="flex gap-6">
                {/* Sidebar Filters */}
                <aside className={`
                    w-full md:w-64 shrink-0 space-y-6
                    md:sticky md:top-18 md:self-start
                    ${showFilters ? 'block' : 'hidden md:block'}
                `}>
                    <Card>
                        <CardContent className="p-4 space-y-6">
                            {/* Categories Filter */}
                            <div>
                                <h3 className="font-semibold mb-3">Categories</h3>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {categories.map((category) => (
                                        <button
                                            key={category._id}
                                            onClick={() => handleCategoryChange(
                                                selectedCategory === category._id ? '' : category._id
                                            )}
                                            className={`
                                                w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                                                ${selectedCategory === category._id 
                                                    ? 'bg-black text-white' 
                                                    : 'hover:bg-gray-100'}
                                            `}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="border-t pt-4">
                                {/* Brands Filter */}
                                <h3 className="font-semibold mb-3">Brands</h3>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {brands.map((brand) => (
                                        <button
                                            key={brand._id}
                                            onClick={() => handleBrandChange(
                                                selectedBrand === brand._id ? '' : brand._id
                                            )}
                                            className={`
                                                w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                                                ${selectedBrand === brand._id 
                                                    ? 'bg-black text-white' 
                                                    : 'hover:bg-gray-100'}
                                            `}
                                        >
                                            {brand.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
                
                {/* Products Grid */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[400px]">
                            <Loader2 className="size-12 animate-spin text-gray-400" />
                        </div>
                    ) : products.length === 0 ? (
                        <Card>
                            <CardContent className="py-16 text-center">
                                <ShoppingBag className="size-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-2xl font-semibold mb-2">No products found</h3>
                                <p className="text-gray-600 mb-6">
                                    Try adjusting your filters or search terms
                                </p>
                                <Button onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {products.map((product) => (
                                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                                    <Link href={`/products/${product.id}`}>
                                        <div className="aspect-square relative bg-gray-50 overflow-hidden">
                                            <Image
                                                src={product.imageCover}
                                                alt={product.title}
                                                fill
                                                className="object-contain p-4 group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                    </Link>
                                    
                                    <CardContent className="p-4 space-y-3">
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                {product.brand.name}
                                            </p>
                                            <Link href={`/products/${product.id}`}>
                                                <h3 className="font-semibold line-clamp-2 hover:underline min-h-[2.5rem]">
                                                    {product.title}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-gray-600">
                                                {product.category.name}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                <StarIcon />
                                                <span className="text-sm font-medium">
                                                    {product.ratingsAverage}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                ({product.ratingsQuantity})
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-2 border-t">
                                            <div>
                                                <p className="text-2xl font-bold">
                                                    EGP {product.price}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    
                                    <AddToCart productId={product.id} />
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
