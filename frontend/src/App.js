import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseMaterials from './pages/BrowseMaterials';
import MaterialDetails from './pages/MaterialDetails';
import UploadMaterial from './pages/UploadMaterial';
import MyMaterials from './pages/MyMaterials';
import AdminDashboard from './pages/AdminDashboard';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main style={{ minHeight: '80vh', padding: '20px', backgroundColor: '#f5f5f5' }}>
            <Routes>
              {/* Public Routes - Only Login and Register */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes - Require Authentication */}
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
              
              {/* Admin Routes - Require Admin Role */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              {/* Fallback - Redirect to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
