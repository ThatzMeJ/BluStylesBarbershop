
import Hero from "./components/home/Hero";
import Introduction from "./components/home/Introduction";
import ServiceSection from "./components/home/ServiceSection";
import Testimonial from "./components/home/Testimonial";
import ContactAndLocation from "./components/home/ContactAndLocation";



export default function Home() {
  return (
    <>
      <Hero />
      <Introduction />
      <ServiceSection />
      <Testimonial />
      <ContactAndLocation />
    </>  
  );
}
