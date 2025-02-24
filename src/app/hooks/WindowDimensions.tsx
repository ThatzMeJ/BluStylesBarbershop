import { useState, useEffect } from 'react';

function getWindowDimensions() {
  if (typeof window === "undefined") return { width: 0, height: 0 }; // Prevents SSR errors
  return { width: window.innerWidth, height: window.innerHeight };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
