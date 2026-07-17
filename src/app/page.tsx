import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { GithubSection } from "@/components/sections/GithubSection";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Skills } from "@/components/sections/Skills";
import { SectionDivider } from "@/components/layout/SectionDivider";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <SectionDivider />
      <Skills />
      <SectionDivider />
      <Projects />
      <SectionDivider />
      <Experience />
      <SectionDivider />
      <Services />
      <SectionDivider />
      <GithubSection />
      <SectionDivider />
      <Contact />
    </>
  );
}
