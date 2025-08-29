import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivateRoute from '@/components/PrivateRoute';
import Layout from '@/components/layout/Layout';
import { io } from "socket.io-client";

const queryClient = new QueryClient();

const socket = io(import.meta.env.VITE_SOCKET_URL);

const App = () => (
 <AuthProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout>
                    <Index />
                  </Layout>
                </PrivateRoute>
              }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
 </AuthProvider>
);

export default App;