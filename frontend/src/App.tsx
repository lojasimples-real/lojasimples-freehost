import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import Bills from "./pages/Bills";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivateRoute from '@/components/PrivateRoute';
import Layout from '@/components/layout/Layout';
import { io } from "socket.io-client";
import ResetPassword from "./pages/ResetPassword";
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
          <Route
              path="/clients"
              element={
                <PrivateRoute>
                  <Layout>
                    <Clients />
                  </Layout>
                </PrivateRoute>
              }
          />
          <Route
              path="/clients/:id"
              element={
                <PrivateRoute>
                  <Layout>
                    <ClientDetails />
                  </Layout>
                </PrivateRoute>
              }
          />
          <Route
              path="/bills"
              element={
                <PrivateRoute>
                  <Layout>
                    <Bills />
                  </Layout>
                </PrivateRoute>
              }
          />
          <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Layout>
                    <Reports />
                  </Layout>
                </PrivateRoute>
              }
          />
          <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </PrivateRoute>
              }
          />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
 </AuthProvider>
);

export default App;
