import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Submissions from './pages/Submissions';
import Feedback from './pages/Feedback';
import Standups from './pages/Standups';
import Login from './pages/Login';
import ProtectedRoute from './components/common/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <Header />
            <Routes>
              <Route path="/login" element={<Login />} />
              <ProtectedRoute path="/dashboard" element={<Dashboard />} />
              <ProtectedRoute path="/projects" element={<Projects />} />
              <ProtectedRoute path="/submissions" element={<Submissions />} />
              <ProtectedRoute path="/feedback" element={<Feedback />} />
              <ProtectedRoute path="/standups" element={<Standups />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;