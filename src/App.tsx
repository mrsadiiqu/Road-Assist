import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import AdminPayments from './components/admin/AdminPayments';
import AdminSettings from './components/admin/AdminSettings';
import AdminSupport from './components/admin/AdminSupport';
import Footer from './components/Footer';
import ProviderOnboarding from './components/provider/ProviderOnboarding';
import AdminLogin from './components/admin/AdminLogin';
import ProviderRegister from './components/provider/ProviderRegister';
import ProviderLogin from './components/provider/ProviderLogin';
import AdminRegister from './components/admin/AdminRegister';
import ProviderLayout from './components/provider/ProviderLayout';
import ProviderDashboard from './components/provider/ProviderDashboard';
import ServiceHistory from './components/dashboard/ServiceHistory';
import ProviderRequests from './components/provider/ProviderRequests';
import ProviderEarnings from './components/provider/ProviderEarnings';
import ProviderProfile from './components/provider/ProviderProfile';


function LandingPage() {
  return (
    <PageLayout>
      <Hero />
      <Services />
      <HowItWorks />
      <About />
      <Contact />
      <Footer/>
    </PageLayout>
  );
}

// Add this new component for protected admin routes
function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const adminData = localStorage.getItem('adminData');
  return adminData ? children : <Navigate to="/admin/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
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
            <Route path="history" element={<ServiceHistory />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Provider Routes */}
          <Route path="/provider/register" element={<ProviderRegister />} />
          <Route path="/provider/login" element={<ProviderLogin />} />
          <Route path="/provider/onboarding" element={<ProviderOnboarding />} />
          <Route
            path="/provider"
            element={
              <ProtectedRoute requiredRole="provider">
                <ProviderLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ProviderDashboard />} />
            <Route path="requests" element={<ProviderRequests />} />
            <Route path="earnings" element={<ProviderEarnings />} />
            <Route path="profile" element={<ProviderProfile />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="providers" element={<ServiceProviders />} />
            <Route path="requests" element={<ServiceRequests />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="support" element={<AdminSupport />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;