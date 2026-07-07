import React, { useEffect, useMemo, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ProductCard from '@/components/ProductCard'
import axios from 'axios'
import { toast } from 'sonner'
import { API_BASE_URL } from '@/lib/constants'
import { useLocation } from 'react-router-dom'

const ProductsList = () => {
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('default')
    const location = useLocation()
    const searchQuery = new URLSearchParams(location.search).get('search')?.trim().toLowerCase() || ''

    const getAllProducts = async () => {
        const cacheKey = 'ekart-products-cache'
        const cachedProducts = sessionStorage.getItem(cacheKey)

        if (cachedProducts) {
            try {
                const parsed = JSON.parse(cachedProducts)
                if (Array.isArray(parsed) && parsed.length) {
                    setAllProducts(parsed)
                    setLoading(false)
                }
            } catch (error) {
                console.error('Failed to parse cached products', error)
            }
        }

        try {
            const res = await axios.get(`${API_BASE_URL}/api/v1/product/getallproducts`)
            if (res.data.success) {
                const products = Array.isArray(res.data.products) ? res.data.products : []
                setAllProducts(products)
                sessionStorage.setItem(cacheKey, JSON.stringify(products))
            } else {
                toast.error(res.data.message || 'Unable to load products')
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Failed to load products')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllProducts()
    }, [])

    const filteredProducts = useMemo(() => {
        if (!searchQuery) return allProducts

        const terms = searchQuery.split(/\s+/).filter(Boolean)

        return allProducts.filter((product) => {
            const searchableText = [
                product?.name,
                product?.title,
                product?.productName,
                product?.category?.name,
                product?.brand,
                product?.description,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()

            return terms.every((term) => searchableText.includes(term))
        })
    }, [allProducts, searchQuery])

    const displayedProducts = useMemo(() => {
        const sorted = [...filteredProducts]

        if (sortBy === 'ltoh') return sorted.sort((a, b) => (Number(a?.productPrice) || 0) - (Number(b?.productPrice) || 0))
        if (sortBy === 'htol') return sorted.sort((a, b) => (Number(b?.productPrice) || 0) - (Number(a?.productPrice) || 0))
        return sorted
    }, [filteredProducts, sortBy])

    return (
        <div className='w-full min-h-screen p-2 bg-white'>
                <div className='my-5 mx-auto max-w-6xl px-4'>
                <div className='flex flex-col'>
                    <div className='flex justify-end'>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Sort by price" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="default">Default</SelectItem>
                                    <SelectItem value="ltoh">Low to high</SelectItem>
                                    <SelectItem value="htol">High to low</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    {searchQuery && (
                        <p className='text-sm text-gray-600 mt-2'>Showing results for: <span className='font-semibold'>{searchQuery}</span></p>
                    )}
                    {loading ? (
                        <div className='py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7'>
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div key={index} className='h-80 rounded-xl border border-gray-100 bg-gray-50 p-3'>
                                    <div className='h-44 animate-pulse rounded-lg bg-gray-200' />
                                    <div className='mt-3 space-y-2'>
                                        <div className='h-4 w-full animate-pulse rounded bg-gray-200' />
                                        <div className='h-4 w-24 animate-pulse rounded bg-gray-200' />
                                        <div className='h-10 w-full animate-pulse rounded bg-gray-200' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : displayedProducts.length === 0 ? (
                        <div className='py-10 text-center text-gray-500'>
                            {searchQuery ? 'No products found for your search.' : 'No products available right now.'}
                        </div>
                    ) : (
                        <div className='py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7'>
                            {
                                displayedProducts.map((product) => {
                                    return <ProductCard key={product._id} product={product} loading={false}/>
                                })
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductsList