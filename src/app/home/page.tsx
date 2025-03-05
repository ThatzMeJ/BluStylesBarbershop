import React from 'react'
import Hero from "../components/home/Hero";
import Introduction from "../components/home/Introduction";
import ServiceSection from "../components/home/ServiceSection";
import Testimonial from "../components/home/Testimonial";
import ContactAndLocation from "../components/home/ContactAndLocation";


const page = () => {
  return (
    <>
      <Hero />
      <Introduction />
      <ServiceSection />
      <Testimonial />
      <ContactAndLocation />
    </>
  )
}

export default page