import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Partners from "./pages/Partners";
import NotFound from "./pages/NotFound";
import ContactForm from "./pages/ContactForm";
import Login from "./pages/Login";

const queryClient = new QueryClient();

// Detecta basename dinamicamente baseado na URL atual
// Se estiver em /challenge/<sessionId>/, usa isso; senão usa /challenge/
const getBasename = () => {
  const path = window.location.pathname;
  // Match /challenge/<uuid-or-id> pattern (UUID format: 8-4-4-4-12 hex digits)
  // Also match simple IDs with numbers and hyphens
  const match = path.match(/^\/challenge\/([a-zA-Z0-9\-]+?)(\/|$)/);
  if (match && match[1]) {
    console.log('[getBasename] Detected sessionId:', match[1]);
    return `/challenge/${match[1]}`;
  }
  console.log('[getBasename] Using fallback /challenge for path:', path);
  return "/";
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={getBasename()}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/parceiros" element={<Partners />} />
          <Route path="/contato" element={<ContactForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
