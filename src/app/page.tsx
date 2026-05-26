import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import EmotionalQuestions from "@/components/sections/EmotionalQuestions";
import Memberships from "@/components/sections/Memberships";
import FreeActivities from "@/components/sections/FreeActivities";
import Courses from "@/components/sections/Courses";
import Philosophy from "@/components/sections/Philosophy";
import Team from "@/components/sections/Team";
import Testimonials from "@/components/sections/Testimonials";
import Blog from "@/components/sections/Blog";
import FAQ from "@/components/sections/FAQ";
import Newsletter from "@/components/sections/Newsletter";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <EmotionalQuestions />
        <Memberships />
        <FreeActivities />
        <Courses />
        <Philosophy />
        <Team />
        <Testimonials />
        <Blog />
        <FAQ />
        <Newsletter />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
