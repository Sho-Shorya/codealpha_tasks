import React from 'react'
import { Card } from './ui/card'
const ProductsList = () => {
    return (
        <div className='mt-16 w-full min-h-screen bg-gray-200'>
            <div className='flex flex-col items-center'>
                <h1 className='mt-5 text-3xl font-bold text-gray-800'>Our Products</h1>
                <p className='text-gray-600 font-light text-[15px]'>Discover our wide range of electronic products.</p>
            </div>
            <div className='grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 my-5 mx-40'>
                <Card data={{ name: 'Product 1', price: 199 }} />
                <Card data={{ name: 'Product 2', price: 299 }} />
                <Card data={{ name: 'Product 3', price: 399 }} />
                <Card data={{ name: 'Product 4', price: 499 }} />
                <Card data={{ name: 'Product 5', price: 599 }} />
                <Card data={{ name: 'Product 6', price: 699 }} />
            </div>
        </div>
    )
}

export default ProductsList