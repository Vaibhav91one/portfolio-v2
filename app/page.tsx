import Hero from "@/components/heroSection";
import About from "@/components/aboutMeSection";
import Projects from "@/components/projectsSections";
import Footer from "@/components/footer";
import NavigationBar from "@/components/NavigationBar";





export default function Home() {
  return (
    <>
      <main className="container-layout">
        <NavigationBar/>
        <Hero/>
        <Projects/>
        {/* <About/> */}
        {/* <Footer/> */}
      </main>
    </>
  );
}
