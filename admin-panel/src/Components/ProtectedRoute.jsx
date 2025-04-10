import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  console.log("Is Authenticated:", isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}

export default ProtectedRoute
