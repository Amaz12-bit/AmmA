import { useState, useEffect } from 'react';

// Helper hook to safely use browser APIs only after the component has mounted
export function useClientOnly<T>(initialValue: T, clientValue: () => T): T {
  const [value, setValue] = useState<T>(initialValue);
  
  useEffect(() => {
    setValue(clientValue());
  }, []);
  
  return value;
}

// Hook to determine if the current viewport is mobile sized
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Listen for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  return isMobile;
}