import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// ==================== PAGE IMPORTS ====================
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseMaterials from './pages/BrowseMaterials';
import MaterialDetails from './pages/MaterialDetails';
import UploadMaterial from './pages/UploadMaterial';
import MyMaterials from './pages/MyMaterials';
import AdminDashboard from './pages/AdminDashboard';

// ==================== COMPONENT IMPORTS ====================
import Navbar from './components/Navbar';
import Footer from './components/Footer';

/**
 * Main Application Component
 * 
 * This component defines the routing structure and authentication flow
 * for the EduShare platform. It includes:
 * - Public routes (login, register)
 * - Protected routes (authenticated users only)
 * - Admin routes (admin users only)
 * 
 * @author EduShare Team
 * @version 1.0.0
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Navigation Header */}
          <Navbar />
          
          {/* Main Content Area */}
          <main style={{ minHeight: '80vh', padding: '20px', backgroundColor: '#f5f5f5' }}>
            <Routes>
              {/* ==================== PUBLIC ROUTES ==================== */}
              {/* Only Login and Register are accessible without authentication */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* ==================== PROTECTED ROUTES ==================== */}
              {/* Require authentication */}
              <Route path="/" element={
                <PrivateRoute>
                  <Landing />
                </PrivateRoute>
              } />
              <Route path="/materials" element={
                <PrivateRoute>
                  <BrowseMaterials />
                </PrivateRoute>
              } />
              <Route path="/materials/:id" element={
                <PrivateRoute>
                  <MaterialDetails />
                </PrivateRoute>
              } />
              <Route path="/upload" element={
                <PrivateRoute>
                  <UploadMaterial />
                </PrivateRoute>
              } />
              <Route path="/my-materials" element={
                <PrivateRoute>
                  <MyMaterials />
                </PrivateRoute>
              } />
              
              {/* ==================== ADMIN ROUTES ==================== */}
              {/* Require admin role */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              {/* ==================== FALLBACK ROUTE ==================== */}
              {/* Redirect any unknown routes to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
