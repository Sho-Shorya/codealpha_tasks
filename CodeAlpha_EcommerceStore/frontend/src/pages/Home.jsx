import Features from '@/components/Features'
import Hero from '@/components/Hero'
import React from 'react'

const Home = () => {
  return (
    <div className='w-screen overflow-hidden'>
      <Hero/>
      <Features/>
    </div>
  )
}

export default Home