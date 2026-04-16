import { useState, useEffect } from 'react';
import { fetchApi } from './api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [about, setAbout] = useState(null);
  const [skills, setSkills] = useState(null);
  const [projects, setProjects] = useState(null);
  const [experience, setExperience] = useState(null);
  const [socialLinks, setSocialLinks] = useState(null);

  useEffect(() => {
    fetchApi('/api/about').then(setAbout);
    fetchApi('/api/skills').then(setSkills);
    fetchApi('/api/projects').then(setProjects);
    fetchApi('/api/experience').then(setExperience);
    fetchApi('/api/social-links').then(setSocialLinks);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 scroll-smooth">
      <Navbar />
      <Hero about={about} />
      <About about={about} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Experience experience={experience} />
      <Contact />
      <Footer socialLinks={socialLinks} name={about?.name} />
    </div>
  );
}
