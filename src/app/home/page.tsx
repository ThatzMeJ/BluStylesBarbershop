import React from 'react'
import Hero from "../components/home/Hero";
import Introduction from "../components/home/Introduction";
import ServiceSection from "../components/home/ServiceSection";
import Testimonial from "../components/home/Testimonial";
import ContactAndLocation from "../components/home/ContactAndLocation";

const Page = () => {
  // Generate structured data for the home page
  const generateStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'HairSalon',
      'name': 'BluStyles Salon',
      'image': 'https://blustyles.com/images/salon.jpg', // Replace with actual image URL
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '123 Main Street', // Replace with actual address
        'addressLocality': 'New York', // Replace with actual city
        'addressRegion': 'NY', // Replace with actual state
        'postalCode': '10001', // Replace with actual zip
        'addressCountry': 'US'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '40.7128', // Replace with actual coordinates
        'longitude': '-74.0060' // Replace with actual coordinates
      },
      'url': 'https://blustyles.com',
      'telephone': '+1-212-555-0000', // Replace with actual phone
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          'opens': '09:00',
          'closes': '19:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Saturday'],
          'opens': '10:00',
          'closes': '17:00'
        }
      ],
      'priceRange': '$$'
    };
    return JSON.stringify(structuredData);
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateStructuredData() }}
      />

      <main id="main-content">
        <Hero />
        <Introduction />
        <ServiceSection />
        <Testimonial />
        <ContactAndLocation />
      </main>
    </>
  )
}

export default Page