
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Web3Provider } from "./context/Web3Context";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import VoteList from "./pages/VoteList";
import VoteDetail from "./pages/VoteDetail";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

// Simplified protected route - no state changes on render
const ProtectedAdminRoute = () => {
  const isAdmin = sessionStorage.getItem('adminAccess') === 'true';
  const location = useLocation();
  
  // Simple conditional rendering without state changes
  return isAdmin ? <Admin /> : <Navigate to="/admin-login" replace state={{ from: location }} />;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Web3Provider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/votes" element={<VoteList />} />
              <Route path="/votes/:id" element={<VoteDetail />} />
              <Route path="/admin" element={<ProtectedAdminRoute />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </Web3Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
