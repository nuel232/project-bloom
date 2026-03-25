import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider } from "@/contexts/RoleContext";
import { DashboardLayout } from "@/components/DashboardLayout";

import StudentDashboard from "@/pages/student/StudentDashboard";
import SubmitProposal from "@/pages/student/SubmitProposal";
import MySubmissions from "@/pages/student/MySubmissions";
import WeeklyStandup from "@/pages/student/WeeklyStandup";
import MyFeedback from "@/pages/student/MyFeedback";

import SupervisorDashboard from "@/pages/supervisor/SupervisorDashboard";
import MyStudents from "@/pages/supervisor/MyStudents";
import StudentDetail from "@/pages/supervisor/StudentDetail";
import ProposalApprovals from "@/pages/supervisor/ProposalApprovals";
import ReviewSubmissions from "@/pages/supervisor/ReviewSubmissions";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageUsers from "@/pages/admin/ManageUsers";
import AllProjects from "@/pages/admin/AllProjects";
import Reports from "@/pages/admin/Reports";

import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <RoleProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
            <Route element={<DashboardLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/proposal" element={<SubmitProposal />} />
              <Route path="/student/submissions" element={<MySubmissions />} />
              <Route path="/student/standup" element={<WeeklyStandup />} />
              <Route path="/student/feedback" element={<MyFeedback />} />

              <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />
              <Route path="/supervisor/students" element={<MyStudents />} />
              <Route path="/supervisor/students/:id" element={<StudentDetail />} />
              <Route path="/supervisor/proposals" element={<ProposalApprovals />} />
              <Route path="/supervisor/submissions" element={<ReviewSubmissions />} />

              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/projects" element={<AllProjects />} />
              <Route path="/admin/reports" element={<Reports />} />

              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
