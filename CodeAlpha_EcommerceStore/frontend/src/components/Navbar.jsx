import { ShoppingCart } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/userSlice'
import axios from 'axios'
import { toast } from 'sonner'
import { API_BASE_URL } from '@/lib/constants'

const Navbar = () => {
  const { user } = useSelector(store => store.user)
  const accessToken = localStorage.getItem('accessToken')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [slideBar, setSlideBar] = useState(false)

  // hydrate redux user from localStorage if needed
  React.useEffect(() => {
    if (!user) {
      const raw = localStorage.getItem('user')
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          dispatch(setUser(parsed))
        } catch (e) {
          // ignore
        }
      }
    }
  }, [user, dispatch])

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setUser(null))
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')
        return navigate('/login')
      }
    } catch (err) {
      toast.error('Logout failed')
    }
  }

  return (
    <header className="lg:bg-emerald-50 fixed top-0 lg:w-screen z-20 border-b border-emerald-200 bg-emerald-50 w-screen lg:h-[auto] h-[70px] flex items-center">
      <div className="lg:max-w-6xl lg:mx-auto lg:flex lg:flex:col lg:justify-between lg:items-center lg:py-3 flex flex-row w-[100%] justify-center items-center">
        {/* Logo section */}
        <Link to="/">
          <div className="flex gap-2 items-center">
            <img src="/Ekart1.png" className="lg:h-12 h-7" alt="logo" />
            <a href="/" className="text-3xl text-gray-700">
              Ekart
            </a>
          </div>
        </Link>
        <img
          src="more.png"
          onClick={() => setSlideBar(!slideBar)}
          className="absolute lg:relative lg:hidden h-5 right-7 opacity-[70%]"
          alt="more"
        />

        {/* Large-screen login/logout buttons */}
        <div className="hidden lg:flex lg:items-center lg:mx-20 lg:gap-4">
            <Button onClick={() => navigate('/signup')} className="bg-gray cursor-pointer px-10 py-5 hover:bg-gray-200 font-bold text-black">Sign Up</Button>
          {user ? (
            <Button onClick={logoutHandler} className="bg-emerald-600 cursor-pointer text-white hover:bg-emerald-500">Logout</Button>
          ) : (
            <Button onClick={() => navigate('/login')} className="bg-gradient-to-tl cursor-pointer px-10 py-5 from-blue-600 to-purple-600 text-white hover:bg-gradient-to-bl">Login</Button>
          )}
        </div>

        <div
          className={`fixed top-0 right-0 h-screen w-[80%] bg-red-50 transition-transform duration-300 ease-in-out ${
            slideBar ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div>
            <img
              src="close.png"
              onClick={() => setSlideBar(!slideBar)}
              className="absolute lg:hidden top-3 right-3 h-7 bg-gray-300 opacity-[70%]"
              alt="close"
            />
            <ul className="flex flex-col gap-7 mt-20 items-center text-sm font-semibold px-6">
              <Link to="/" className="text-2xl">
                <li>Home</li>
              </Link>
              <Link to="/products" className="text-2xl">
                <li>Products</li>
              </Link>
              {user && (
                <Link to={`/profile/${user._id}`}>
                  <li>Hello, {user.firstName}</li>
                </Link>
              )}
              <Link to="/cart">
                <div className="relative inline-block">
                  <ShoppingCart className="text-2xl" />
                  <span className="absolute -top-3 -right-3 bg-emerald-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    0
                  </span>
                </div>
              </Link>

              {user ? (
                <Button onClick={logoutHandler} className="m-5 absolute bottom-5 h-[60px] left-0 right-0 bg-emerald-600 text-white cursor-pointer hover:bg-emerald-500">
                  Logout
                </Button>
              ) : (
                <Button onClick={() => navigate('/login')} className="m-5 absolute bottom-5 h-[60px] left-0 right-0 bg-gradient-to-tl from-blue-600 to-purple-600 text-white cursor-pointer hover:bg-emerald-500">
                  Login
                </Button>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
