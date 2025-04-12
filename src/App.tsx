import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import PageLayout from './components/PageLayout';
import Hero from './components/Hero';
import Services from './pages/Services';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Contact from './pages/Contact';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Overview from './components/dashboard/Overview';
import ServiceRequest from './components/dashboard/ServiceRequest';
import Settings from './components/dashboard/Settings';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import ServiceProviders from './components/admin/ServiceProviders';
import AdminDashboard from './components/admin/AdminDashboard';
import ServiceRequests from './components/admin/ServiceRequests';

function LandingPage() {
  return (
    <PageLayout>
      <Hero />
      <Services />
      <HowItWorks />
      <About />
      <Contact />
    </PageLayout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/services" element={<PageLayout><Services /></PageLayout>} />
            <Route path="/how-it-works" element={<PageLayout><HowItWorks /></PageLayout>} />
            <Route path="/about" element={<PageLayout><About /></PageLayout>} />
            <Route path="/contact" element={<PageLayout><Contact /></PageLayout>} />
            <Route path="/signin" element={<PageLayout><SignIn /></PageLayout>} />
            <Route path="/signup" element={<PageLayout><SignUp /></PageLayout>} />
            
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
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="providers" element={<ServiceProviders />} />
              <Route path="requests" element={<ServiceRequests />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="support" element={<AdminSupport />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;