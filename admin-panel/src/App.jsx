import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Components/Login'
import Dashboard from './Pages/Dashboard'
import NotFound from './Pages/NotFound'
import ProtectedRoute from './Components/ProtectedRoute'
import Add from './Pages/Add'

function App() {
  return (
   
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
             
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
   
  )
}

export default App
