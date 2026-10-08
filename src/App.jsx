import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import PropertyListing from "./pages/PropertyListing";
import PropertyDetail from "./pages/PropertyDetail";
import Contact from "./pages/Contact";

import AdminAuth from "./admin/AdminAuth";
import AdminDashboard from "./admin/AdminDasboard";
import ProtectedRoute from "./ProtectedRoute";

import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <ScrollToTop />

      <Navbar />

      <div className="pt-20"></div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<PropertyListing />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/admin/login" element={<AdminAuth />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

    <Footer/>
    </div>
  );
}
export default App;