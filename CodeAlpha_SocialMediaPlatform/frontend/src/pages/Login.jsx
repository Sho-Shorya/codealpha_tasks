import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from "sonner"
import { API_BASE_URL } from '../lib/constants.js'
import axios from 'axios'
import { Eye, EyeOff, Loader2, Loader2Icon, LoaderCircle, LoaderPinwheel } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'

function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ userName: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        navigate('/')
        dispatch(setUserData(res.data.user))
        localStorage.setItem('user', JSON.stringify(res.data.user))
        localStorage.setItem('token', res.data.token)

        toast.success(res.data.message, { duration: 1000 });
      }
    } catch (error) {
      toast.error(error.response?.data?.message, { duration: 1000 });
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="text-[black] min-h-screen flex items-center flex-col justify-center gap-[20px] bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="p-10">
          <h2 className="text-3xl font-semibold mb-6">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="userName" value={form.userName} onChange={handleChange} placeholder="Username" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-200" />
            <div className="relative flex items-center">
              <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type={showPassword ? 'text' : 'password'} required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-200" />{
                showPassword ? <EyeOff onClick={() => setShowPassword(false)} className="absolute right-[4%] cursor-pointer text-qray-700" /> : <Eye onClick={() => setShowPassword(true)} className="absolute right-[4%] cursor-pointer text-qray-700" />
              }
            </div>
            {error && <div className="text-red-600">{error}</div>}
            <button className="w-full bg-black text-white py-3 flex justify-center items-center rounded-lg font-medium cursor-pointer" value={loading}>
              {loading ? <Loader2 className="h-6 p-0 m-0 w-6 animate-spin" />: "Login"}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600">Already have an account? <Link to="/register" className="text-indigo-600">Create Account</Link></p>
        </div>
        <div className="rounded-tl-4xl rounded-bl-4xl flex justify-center items-center bg-gray-900">
          <div className="text-center px-8 flex hidden lg:block flex-col justify-center items-center">
            <img src='/Chugli_trans.png' alt="Chugli" className="h-25 text-1xl" />
            <p className="mt-1 text-gray-600">Keep It Unfiltered!</p>
          </div>
        </div>
      </div>
      <div className='mt-10 block md:hidden flex flex-col items-center'>
        <img src='/Chugli_trans.png' alt="Chugli" className="h-15 text-1xl" />
        <p className='text-[13px] text-gray-500'>Keep in Unfiltered.</p>
      </div>
    </div>
  )
}

export default Login
