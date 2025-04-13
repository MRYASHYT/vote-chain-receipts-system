
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "./context/Web3Context";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import VoteList from "./pages/VoteList";
import VoteDetail from "./pages/VoteDetail";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

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
                <Route path="/admin" element={<Admin />} />
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
