"use client";

import Hero from "@/components/heroSection";
import About from "@/components/aboutMeSection";
import Footer from "@/components/footer";
import NavigationBar from "@/components/NavigationBar";
import { useEffect, useState } from "react";
import Preloader from "@/components/ui/Preloader";
import ProjectsFramer from "@/components/projects";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false); // for delaying content render

  // When preloader finishes (setLoading = false), wait before showing content
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowContent(true);
    }, 200); // Reduced delay from 500ms to 200ms for faster loading
    return () => clearTimeout(timeout); // cleanup
  }, [loading]);
  return (
    <>
      {loading && <Preloader setLoading={setLoading} />}
      {showContent && (
        <div>
          <main className="container-layout relative overflow-hidden scrollbar-hide">
            {/* Show the rest of the app after delay */}
            <>
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
            </>
          </main>
          <section id="footer">
          <Footer />
          </section>
        </div>
      )}
    </>
  );
}
