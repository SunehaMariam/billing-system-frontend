import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
           <Route path="/" element={<Login />} />
           <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
         <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
