import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ userName: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="p-10">
          <h2 className="text-3xl font-semibold mb-6">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="userName" value={form.userName} onChange={handleChange} placeholder="Username" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-200" />
            <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-200" />
            {error && <div className="text-red-600">{error}</div>}
            <button className="w-full bg-black text-white py-3 rounded-lg font-medium cursor-pointer">Login</button>
          </form>
          <p className="mt-4 text-sm text-gray-600">Already have an account? <Link to="/register" className="text-indigo-600">Create Account</Link></p>
        </div>

        <div className="rounded-tl-4xl rounded-bl-4xl flex items-center justify-center bg-gray-900">
          <div className="text-center px-8">
            <img src='/Chugli_trans.png' alt="Chugli" className="h-25 text-1xl" />
            <p className="mt-1 text-gray-600">Keep It Unfiltered!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login