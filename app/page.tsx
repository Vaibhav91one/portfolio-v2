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
    }, 500); // wait 1.5 seconds after preloader animation ends
    return () => clearTimeout(timeout); // cleanup
  }, [loading]);
  return (
    <>
      {loading && <Preloader setLoading={setLoading} />}
      {showContent && (
        <div>
          <main  className="container-layout relative overflow-hidden scrollbar-hide">
            {/* Show the rest of the app after delay */}
            <>
              <NavigationBar />
              <Hero />
              <ProjectsFramer />
              <About  />
            </>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}
