import React from 'react'

// Define the type for the props
interface ServicesLayoutProps {
  children: React.ReactNode
}

export default function ServicesLayout({ children }: ServicesLayoutProps) {
  return (
    <div className="services-layout text-black">
      {/* Add any components that should appear on all services pages */}
      <div className="services-header">
        <h1 className="text-3xl font-bold text-center py-8">Our Services</h1>
      </div>

      {/* This is where the page content will be rendered */}
      <main className="services-content">
        {children}
      </main>

      {/* Add any footer components specific to services */}
      <div className="services-footer">
        <p className="text-center py-4">Book your appointment today</p>
      </div>
    </div>
  )
}
