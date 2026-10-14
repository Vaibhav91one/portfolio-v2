"use client";

import Hero from "@/components/heroSection";
import About from "@/components/aboutMeSection";
import Footer from "@/components/footer";
import NavigationBar from "@/components/NavigationBar";
import { useState } from "react";
import Preloader from "@/components/ui/Preloader";
import ProjectsFramer from "@/components/projects";

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Content renders immediately underneath; the preloader is a fixed overlay on top
  return (
    <>
      {loading && <Preloader setLoading={setLoading} />}
      <div>
        <main className="container-layout relative overflow-hidden">
          <NavigationBar />
          <section id="hero">
            <Hero />
          </section>
          <section id="projects">
            <ProjectsFramer />
          </section>
          <section id="about">
            <About />
          </section>
        </main>
        <section id="footer">
          <Footer />
        </section>
      </div>
    </>
  );
}
