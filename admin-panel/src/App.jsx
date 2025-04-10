import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './Components/Login'
import Dashboard from './Pages/Dashboard'
import NotFound from './Pages/NotFound'
import ProtectedRoute from './Components/ProtectedRoute'
import Add from './Pages/Add'
import Items from './Pages/Items'
import Order from './Pages/Order'
import Category from './Pages/Category'
import Review from './Pages/Review'
import Payment from './Pages/Payment'
import Blog from './Pages/Blog'

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<Add />} />
        <Route path="/items" element={<Items />} />
        <Route path="/order" element={<Order />} />
        <Route path="/category" element={<Category />} />
        <Route path="/review" element={<Review />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/blog" element={<Blog />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
