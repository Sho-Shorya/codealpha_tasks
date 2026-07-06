import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card } from '@/components/ui/card'
import ProductCard from '@/components/ProductCard'
import axios from 'axios'
import { toast } from 'sonner'
import { API_BASE_URL } from '@/lib/constants'

const ProductsList = () => {
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(false)

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

    return (
        <div className='w-full min-h-screen p-2 bg-white'>
                <div className='my-5 mx-auto max-w-6xl px-4'>
                <div className='flex flex-col'>
                    <div className='flex justify-end'>
                        <Select>
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
                    <div className='py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7'>
                        {
                            allProducts.map((product) => {
                                return <ProductCard key={product._id} product={product} loading={loading}/>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductsList