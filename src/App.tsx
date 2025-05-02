
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

// Admin route protector
const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
  const isAdmin = sessionStorage.getItem('adminAccess') === 'true';
  
  if (!isAdmin) {
    console.log("Admin access denied, redirecting to login");
    return <Navigate to="/admin-login" replace />;
  }
  
  console.log("Admin access verified, rendering admin route");
  return children;
};

const App: React.FC = () => {
  return (
    <React.StrictMode>
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
                <Route path="/admin" element={
                  <ProtectedAdminRoute>
                    <Admin />
                  </ProtectedAdminRoute>
                } />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </Web3Provider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
