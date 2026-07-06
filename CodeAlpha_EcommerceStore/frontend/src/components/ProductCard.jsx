import { ShoppingCart } from 'lucide-react';
import React from 'react'
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { setCart } from '../redux/ProductSlice';
import { API_BASE_URL } from '@/lib/constants';

const ProductCard = ({ product, loading }) => {
    const { productImg, productPrice, productName } = product
    const accessToken = localStorage.getItem('accessToken')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const addToCart = async(productId)=>{
        if (!accessToken) {
            toast.error('Please login to add products to cart');
            navigate('/login');
            return;
        }
        try {
            const res = await axios.post(`${API_BASE_URL}/api/v1/cart/add-cart`, { productId }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (res.data.success) {
                toast.success(res.data.message || "Product added to cart")
                dispatch(setCart(res.data.cart || { items: [] }))
                localStorage.setItem('cart', JSON.stringify(res.data.cart?.items || []))
            } else {
                toast.error(res.data.message || 'Unable to add to cart')
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Failed to add product to cart')
        }
    }
    return (
        <div className='shadow-lg rounded-lg overflow-hidden h-max bg-white'>
            <div className='w-full h-full aspect-square overflow-hidden'>
                {
                    loading ? <Skeleton className='bg-gray-500 w-full h-full rounded-lg' /> : <img src={productImg[0]?.url} className='w-full h-full transition-transform duration-300 hover:scale-105 cursor-pointer' />

                }
            </div>
            {
                loading ? <div className='px-2 space-y-2 my-2'>
                    <Skeleton className='w-[200px] h-4' />
                    <Skeleton className='w-[100px] h-4' />
                    <Skeleton className='w-[150px] h-8' />
                </div> :
                    <div className='px-3 py-2 space-y-2'>
                        <h1 className='font-semibold text-sm md:text-base h-12 line-clamp-2'>
                            {productName}
                        </h1>
                        <h2 className='font-bold text-lg'>
                            ₹{productPrice}
                        </h2>
                        <Button onClick={()=> (addToCart(product._id))} className='bg-pink-600 mb-0 w-full py-2 flex items-center justify-center gap-2'><ShoppingCart />Add to Cart</Button>
                    </div>
            }
        </div>
    )
}
export default ProductCard;