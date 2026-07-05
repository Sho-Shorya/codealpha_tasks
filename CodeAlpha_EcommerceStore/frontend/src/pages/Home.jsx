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