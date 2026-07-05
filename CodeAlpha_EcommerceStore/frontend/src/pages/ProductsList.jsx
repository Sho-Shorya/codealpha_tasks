import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
const ProductsList = () => {
    return (
        <div className='mt-16 w-full min-h-screen p-2 bg-gray-200'>
            <div className='flex flex-col items-center'>
                <h1 className='mt-5 text-3xl font-bold text-gray-800'>Our Products</h1>
                <p className='text-gray-600 font-light text-[15px]'>Discover our wide range of electronic products.</p>
            </div>
            <div className='grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 my-5 mx-40'>
                <div className='flex flex-col'>
                    <div>
                        <Select>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Sort by price" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductsList