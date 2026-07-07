import React, { useEffect, useState } from 'react'
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
    const [loading, setLoading] = useState(false)
    const [sortBy, setSortBy] = useState('default')
    const location = useLocation()
    const searchQuery = new URLSearchParams(location.search).get('search')?.trim().toLowerCase() || ''

    const getAllProducts = async () => {

        try {
            setLoading(true)
            const res = await axios.get(`${API_BASE_URL}/api/v1/product/getallproducts`);
            if (res.data.success) {
                setAllProducts(res.data.products)
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

    const filteredProducts = searchQuery
        ? allProducts.filter((product) => {
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

            return searchableText.includes(searchQuery)
        })
        : allProducts

    const displayedProducts = [...filteredProducts].sort((a, b) => {
        const priceA = Number(a?.productPrice) || 0
        const priceB = Number(b?.productPrice) || 0

        if (sortBy === 'ltoh') return priceA - priceB
        if (sortBy === 'htol') return priceB - priceA
        return 0
    })

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
                    {displayedProducts.length === 0 ? (
                        <div className='py-10 text-center text-gray-500'>No products found for your search.</div>
                    ) : (
                        <div className='py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7'>
                            {
                                displayedProducts.map((product) => {
                                    return <ProductCard key={product._id} product={product} loading={loading}/>
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