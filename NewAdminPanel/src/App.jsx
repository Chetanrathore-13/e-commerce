import React from 'react'
import AdminDashboard from './pages/adminDashboard'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import ProtectedRoute from "./routes/ProtectedRoute";
import { isAuthenticated } from "./auth/auth";
const App = () => {  

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<h1>Home</h1>} />
        </Route>
        <Route
          path="*"
          element={
            isAuthenticated() ? <Navigate to="/dashboard/home" /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App
