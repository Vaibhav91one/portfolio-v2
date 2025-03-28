"use client";

import Hero from "@/components/heroSection";
import About from "@/components/aboutMeSection";
import Projects from "@/components/projectsSections";
import Footer from "@/components/footer";
import NavigationBar from "@/components/NavigationBar";
import { useState } from "react";
import Preloader from "@/components/ui/Preloader";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <Preloader setLoading={setLoading} />
      ) : (
        <main className="container-layout">
          {/* <NavigationBar/> */}
          <Hero />
          <Projects />
          {/* <About/> */}
          {/* <Footer/> */}
        </main>
      )}
    </>
  );
}
