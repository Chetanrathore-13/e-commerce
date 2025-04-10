import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { login } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import axios  from 'axios'
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/admin/login', data)

      if (response.data.error) {
        toast.error(response.data.error || "Invalid credentials")
        return
      }

      // Optional: Save token if received
      // localStorage.setItem('token', response.data.token)

      dispatch(login({ username: data.email }))
      toast.success('Login successful')
      navigate('/dashboard')
    } catch (error) {
      // Network or server error
      const message =
        error.response?.data?.error || "Your passward or email is incorrect"
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ToastContainer position="top-right" autoClose={3000} />

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              {...register('email', { required: true })}
              id="email"
              placeholder="admin@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              {...register('password', { required: true })}
              id="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#B08E5B] text-white py-2 rounded-md hover:bg-[#b08e5b73] hover:text-black transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login