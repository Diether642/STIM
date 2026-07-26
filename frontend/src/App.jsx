import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import BusinessLayout from './layouts/BusinessLayout'
import ProtectedRoute from './routes/ProtectedRoute'

// Public pages
import Home from './pages/public/Home'
import ExploreDestinations from './pages/public/ExploreDestinations'
import DestinationDetail from './pages/public/DestinationDetail'
import Accommodations from './pages/public/Accommodations'
import AccommodationDetail from './pages/public/AccommodationDetail'
import FoodBeverage from './pages/public/FoodBeverage'
import FoodBeverageDetail from './pages/public/FoodBeverageDetail'
import RetailProducts from './pages/public/RetailProducts'
import RetailProductDetail from './pages/public/RetailProductDetail'
import Events from './pages/public/Events'
import About from './pages/public/About'
import Login from './pages/public/Login'
import RoleSelection from './pages/public/RoleSelection'
import AdminLogin from './pages/public/AdminLogin'
import TouristRegister from './pages/public/TouristRegister'
import BusinessOwnerRegister from './pages/public/BusinessOwnerRegister'
import RegistrationPending from './pages/public/RegistrationPending'

// Tourist pages
import TouristDashboard from './pages/tourist/TouristDashboard'
import ItineraryPlanner from './pages/tourist/ItineraryPlanner'
import ItineraryView from './pages/tourist/ItineraryView'
import SavedItineraries from './pages/tourist/SavedItineraries'
import MyReviews from './pages/tourist/MyReviews'

// Business pages
import BusinessDashboard from './pages/business/BusinessDashboard'
import SubmitListing from './pages/business/SubmitListing'
import SubmissionStatus from './pages/business/SubmissionStatus'
import ManageProfile from './pages/business/ManageProfile'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageDestinations from './pages/admin/ManageDestinations'
import ReviewSubmissions from './pages/admin/ReviewSubmissions'
import ManageUsers from './pages/admin/ManageUsers'
import ReportsAnalytics from './pages/admin/ReportsAnalytics'

export default function App() {
  return (
    <Routes>
      {/* Auth flow pages (no layout wrapper) */}
      <Route path="/get-started" element={<RoleSelection />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/register/tourist" element={<TouristRegister />} />
      <Route path="/register/business_owner" element={<BusinessOwnerRegister />} />
      <Route path="/registration-pending" element={<RegistrationPending />} />

      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<ExploreDestinations />} />
        <Route path="/destinations/:id" element={<DestinationDetail />} />
        <Route path="/accommodations" element={<Accommodations />} />
        <Route path="/accommodations/:id" element={<AccommodationDetail />} />
        <Route path="/food-beverage" element={<FoodBeverage />} />
        <Route path="/food-beverage/:id" element={<FoodBeverageDetail />} />
        <Route path="/products" element={<RetailProducts />} />
        <Route path="/products/:id" element={<RetailProductDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Tourist Routes */}
      <Route element={<ProtectedRoute roles={['tourist']}><PublicLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<TouristDashboard />} />
        <Route path="/plan-trip" element={<ItineraryPlanner />} />
        <Route path="/itineraries/:id" element={<ItineraryView />} />
        <Route path="/my-itineraries" element={<SavedItineraries />} />
        <Route path="/my-reviews" element={<MyReviews />} />
      </Route>

      {/* Business Owner Routes - Now allows Admin access */}
      <Route path="/business" element={<ProtectedRoute roles={['business_owner', 'admin']}><BusinessLayout /></ProtectedRoute>}>
        <Route index element={<BusinessDashboard />} />
        <Route path="submit" element={<SubmitListing />} />
        <Route path="submissions" element={<SubmissionStatus />} />
        <Route path="profile" element={<ManageProfile />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="destinations" element={<ManageDestinations />} />
        <Route path="submissions" element={<ReviewSubmissions />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="reports" element={<ReportsAnalytics />} />
      </Route>
    </Routes>
  )
}