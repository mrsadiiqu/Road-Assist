import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import About from './components/About';
import Contact from './components/Contact';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Overview from './components/dashboard/Overview';
import ServiceRequest from './components/dashboard/ServiceRequest';
import Settings from './components/dashboard/Settings';
import ProtectedRoute from './components/auth/ProtectedRoute';

function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <Hero />
        <Services />
        <HowItWorks />
        <About />
        <Contact />
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="request" element={<ServiceRequest />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;