import React from "react";
import Navbar from "../components/Navbar/Navbar";
import HeroSection from "../components/HeroSection/heroSection";
import DestinationSection from "../components/DestinationSection/DestinationSection";
import CultureSection from "../components/CultureSection/CultureSection";
import CinematicShorts from "../components/VideoSection/CinematicShorts";
import CinematicShowcase from "../components/VideoSection/CinematicShowcase";
import TourSection from "../components/TourSection/TourSection";
import AboutSection from "../components/AboutSection/AboutSection";
import Footer from "../components/Footer/Footer";
import ChatBot from "../components/ChatBot/ChatBot";

const Home = () => {
  return (
    <div className="min-h-screen bg-neutral-900 overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <DestinationSection />
      <CultureSection />
      <CinematicShorts />
      <CinematicShowcase />
      <TourSection />
      <AboutSection />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Home;
