import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, RoleBasedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";

import Login from "@/pages/Login";
import Unauthorized from "@/pages/Unauthorized";

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
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/student/dashboard" replace />
                </ProtectedRoute>
              }
            />

            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <RoleBasedRoute requiredRoles={['student']}>
                    <StudentDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/student/proposal"
                element={
                  <RoleBasedRoute requiredRoles={['student']}>
                    <SubmitProposal />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/student/submissions"
                element={
                  <RoleBasedRoute requiredRoles={['student']}>
                    <MySubmissions />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/student/standup"
                element={
                  <RoleBasedRoute requiredRoles={['student']}>
                    <WeeklyStandup />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/student/feedback"
                element={
                  <RoleBasedRoute requiredRoles={['student']}>
                    <MyFeedback />
                  </RoleBasedRoute>
                }
              />

              {/* Supervisor Routes */}
              <Route
                path="/supervisor/dashboard"
                element={
                  <RoleBasedRoute requiredRoles={['supervisor']}>
                    <SupervisorDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/supervisor/students"
                element={
                  <RoleBasedRoute requiredRoles={['supervisor']}>
                    <MyStudents />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/supervisor/students/:id"
                element={
                  <RoleBasedRoute requiredRoles={['supervisor']}>
                    <StudentDetail />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/supervisor/proposals"
                element={
                  <RoleBasedRoute requiredRoles={['supervisor']}>
                    <ProposalApprovals />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/supervisor/submissions"
                element={
                  <RoleBasedRoute requiredRoles={['supervisor']}>
                    <ReviewSubmissions />
                  </RoleBasedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <RoleBasedRoute requiredRoles={['admin']}>
                    <AdminDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <RoleBasedRoute requiredRoles={['admin']}>
                    <ManageUsers />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/projects"
                element={
                  <RoleBasedRoute requiredRoles={['admin']}>
                    <AllProjects />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <RoleBasedRoute requiredRoles={['admin']}>
                    <Reports />
                  </RoleBasedRoute>
                }
              />

              {/* Shared Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
