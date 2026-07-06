import Features from '@/components/Features'
import Hero from '@/components/Hero'
import React from 'react'
import ProductsList from '@/pages/ProductsList'
import { useSelector } from 'react-redux'

const Home = () => {
  const user = useSelector((state) => state.user?.user || null)
  return (
    <div className='w-screen overflow-hidden'>
      {user ? (
        <>
          <><div className='flex flex-col items-center mt-16'>
                <h1 className='mt-5 text-3xl font-bold text-gray-800'>Our Products</h1>
                <p className='text-gray-600 font-light text-[15px]'>Discover our wide range of electronic products.</p>
            </div></>
          <ProductsList />
        </>
      ) : (
        <>
          <Hero />
          <Features /></>
      )}
    </div>
  )
}

export default Home