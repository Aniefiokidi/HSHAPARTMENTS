import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LocationsPage from './pages/LocationsPage';
import ApartmentsPage from './pages/ApartmentsPage';
import ApartmentDetailPage from './pages/ApartmentDetailPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageApartmentsPage from './pages/admin/ManageApartmentsPage';
import ManageBookingsPage from './pages/admin/ManageBookingsPage';
import ManageLocationsPage from './pages/admin/ManageLocationsPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes with Navbar + Footer */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <HomePage />
              <Footer />
            </>
          }
        />
        <Route
          path="/locations"
          element={
            <>
              <Navbar />
              <LocationsPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/locations/:slug"
          element={
            <>
              <Navbar />
              <ApartmentsPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/apartments/:id"
          element={
            <>
              <Navbar />
              <ApartmentDetailPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/book/:apartmentId"
          element={
            <>
              <Navbar />
              <BookingPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/booking-confirmation/:bookingId"
          element={
            <>
              <Navbar />
              <BookingConfirmationPage />
              <Footer />
            </>
          }
        />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/apartments"
          element={
            <ProtectedRoute>
              <ManageApartmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute>
              <ManageBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/locations"
          element={
            <ProtectedRoute>
              <ManageLocationsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
