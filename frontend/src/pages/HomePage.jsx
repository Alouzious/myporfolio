import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Contact from '../components/Contact';

export default function HomePage({ about, skills, projects, experience }) {
  return (
    <>
      <Hero about={about} />
      <About about={about} />
      <Skills skills={skills} />
      <Projects projects={projects} compact />
      <Experience experience={experience} />
      <Contact />
    </>
  );
}
