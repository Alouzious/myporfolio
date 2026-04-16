import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { fetchApi } from './api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import CredentialsPage from './pages/CredentialsPage';
import PlaygroundPage from './pages/PlaygroundPage';
import MyLabPage from './pages/MyLabPage';
import ExperiencePage from './pages/ExperiencePage';
import SkillsPage from './pages/SkillsPage';

export default function App() {
  const [about, setAbout] = useState(null);
  const [skills, setSkills] = useState(null);
  const [projects, setProjects] = useState(null);
  const [experience, setExperience] = useState(null);
  const [socialLinks, setSocialLinks] = useState(null);
  const [achievements, setAchievements] = useState(null);
  const [research, setResearch] = useState(null);
  const [readings, setReadings] = useState(null);

  useEffect(() => {
    fetchApi('/api/about').then(setAbout);
    fetchApi('/api/skills').then(setSkills);
    fetchApi('/api/projects').then(setProjects);
    fetchApi('/api/experience').then(setExperience);
    fetchApi('/api/social-links').then(setSocialLinks);
    fetchApi('/api/achievements').then(setAchievements);
    fetchApi('/api/research').then(setResearch);
    fetchApi('/api/readings').then(setReadings);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-slate-900 scroll-smooth">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                about={about}
                skills={skills}
                projects={projects}
                experience={experience}
              />
            }
          />
          <Route
            path="/projects"
            element={<ProjectsPage projects={projects} />}
          />
          <Route
            path="/credentials"
            element={<CredentialsPage achievements={achievements} />}
          />
          <Route
            path="/experience"
            element={<ExperiencePage experience={experience} />}
          />
          <Route
            path="/skills"
            element={<SkillsPage skills={skills} />}
          />
          <Route path="/playground" element={<PlaygroundPage about={about} />} />
          <Route
            path="/my-lab"
            element={<MyLabPage research={research} readings={readings} />}
          />
        </Routes>
        <Footer socialLinks={socialLinks} name={about?.name} />
      </div>
    </BrowserRouter>
  );
}
