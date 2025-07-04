import { useState } from 'react';

export const useAppTheme = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return {
    darkMode,
    toggleDarkMode
  };
};