
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { InternshipProvider } from "./contexts/InternshipContext";
import { SCADProvider } from "./contexts/SCADContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import RegisterSuccess from "./pages/Auth/RegisterSuccess";

// Internship Pages
import InternshipsList from "./pages/Internships/InternshipsList";
import InternshipDetails from "./pages/Internships/InternshipDetails";
import InternshipApply from "./pages/Internships/InternshipApply";

// Applications Pages
import StudentApplications from "./pages/Applications/StudentApplications";
import CompanyApplications from "./pages/Applications/CompanyApplications";

// Company Management Pages
import ManageInternships from "./pages/Company/ManageInternships";
import PostInternship from "./pages/Company/PostInternship";

// Admin Pages
import CompanyApplicationsReview from "./pages/Admin/CompanyApplicationsReview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <InternshipProvider>
          <SCADProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<Index />} />
                
                {/* Auth Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register-success" element={<RegisterSuccess />} />
                
                {/* Internship Pages */}
                <Route path="/internships" element={<InternshipsList />} />
                <Route path="/internships/:id" element={<InternshipDetails />} />
                <Route path="/internships/:id/apply" element={<InternshipApply />} />
                
                {/* Applications Pages */}
                <Route path="/applications" element={<StudentApplications />} />
                
                {/* Company Management Pages */}
                <Route path="/manage-internships" element={<ManageInternships />} />
                <Route path="/post-internship" element={<PostInternship />} />
                <Route path="/company/applications" element={<CompanyApplications />} />
                
                {/* SCAD Office Pages */}
                <Route path="/company-applications" element={<CompanyApplicationsReview />} />
                
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SCADProvider>
        </InternshipProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
