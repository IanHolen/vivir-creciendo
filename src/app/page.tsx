import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Pillars from "@/components/sections/Pillars";
import Memberships from "@/components/sections/Memberships";
import Courses from "@/components/sections/Courses";
import HowItWorks from "@/components/sections/HowItWorks";
import Team from "@/components/sections/Team";
import FreeActivities from "@/components/sections/FreeActivities";
import Testimonials from "@/components/sections/Testimonials";
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
        <Pillars />
        <Memberships />
        <Courses />
        <HowItWorks />
        <Team />
        <FreeActivities />
        <Testimonials />
        <FAQ />
        <Newsletter />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
