"use client";

import Hero from "@/components/heroSection";
import About from "@/components/aboutMeSection";
import Projects from "@/components/projectsSections";
import Footer from "@/components/footer";
import NavigationBar from "@/components/NavigationBar";
import { useState } from "react";
import Preloader from "@/components/ui/Preloader";
import Project from "@/components/ui/Project";
import ProjectsFramer from "@/components/projects";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <Preloader setLoading={setLoading} />
      ) : (
        <div className="flex flex-col min-h-screen">
          <main className="container-layout relative overflow-hidden">
            {/* <NavigationBar /> */}
            <Hero />
            <ProjectsFramer/>
            <About />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}
