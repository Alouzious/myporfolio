import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/ProjectsPage';
import SkillsPage from './pages/SkillsPage';
import ExperiencePage from './pages/ExperiencePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SocialLinksPage from './pages/SocialLinksPage';
import ResearchPage from './pages/ResearchPage';
import ReadingsPage from './pages/ReadingsPage';
import AchievementsPage from './pages/AchievementsPage';

function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/projects" element={<ProtectedLayout><ProjectsPage /></ProtectedLayout>} />
          <Route path="/skills" element={<ProtectedLayout><SkillsPage /></ProtectedLayout>} />
          <Route path="/experience" element={<ProtectedLayout><ExperiencePage /></ProtectedLayout>} />
          <Route path="/about" element={<ProtectedLayout><AboutPage /></ProtectedLayout>} />
          <Route path="/contact" element={<ProtectedLayout><ContactPage /></ProtectedLayout>} />
          <Route path="/social-links" element={<ProtectedLayout><SocialLinksPage /></ProtectedLayout>} />
          <Route path="/research" element={<ProtectedLayout><ResearchPage /></ProtectedLayout>} />
          <Route path="/readings" element={<ProtectedLayout><ReadingsPage /></ProtectedLayout>} />
          <Route path="/achievements" element={<ProtectedLayout><AchievementsPage /></ProtectedLayout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
