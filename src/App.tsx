
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
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

// A stable implementation for protected routes
const ProtectedRoute = () => {
  const isAdmin = sessionStorage.getItem('adminAccess') === 'true';
  const location = useLocation();
  
  if (!isAdmin) {
    // Only redirect if not admin
    return <Navigate to="/admin-login" replace state={{ from: location }} />;
  }
  
  // Admin is authenticated, show the admin component
  return <Admin />;
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
              <Route path="/admin" element={<ProtectedRoute />} />
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
