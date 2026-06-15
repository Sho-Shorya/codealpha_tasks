import React from 'react'
import { Button } from './components/ui/button'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from "./components/Navbar.jsx"
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Verify from './pages/Verify'
import VerifyEmail from './pages/VerifyEmail'
import Footer from './components/Footer'
import Profile from './pages/Profile'

const router = createBrowserRouter([
  {
    path:'/',
    element:<> <Navbar/> <Home/> <Footer/></>
  },
  {
    path:'/signup',
    element:<><Signup/></>
  },
  {
    path:'/login',
    element:<><Login/></>
  },
  {
    path:'/verify',
    element:<><Verify/></>
  },
  {
    path:'/verify/:token',
    element:<><VerifyEmail/></>
  },
  {
    path:'/profile/:userId',
    element:<><Navbar/><Profile /></>
  }
  
])
const App = () => {
  return (
    <div className='text-3xl font-bold'>
      <>
        <RouterProvider router = {router}/>
      </>
    </div>
  )
}

export default App