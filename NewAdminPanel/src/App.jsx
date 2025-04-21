import React from 'react'
import AdminDashboard from './pages/adminDashboard'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import ProtectedRoute from "./routes/ProtectedRoute";
import { isAuthenticated } from "./auth/auth";
import BrandsPage from './pages/BrandPage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
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
          <Route path="brands" element={<BrandsPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="products" element={<ProductPage />} />
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
