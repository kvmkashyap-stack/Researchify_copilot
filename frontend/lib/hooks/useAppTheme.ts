import { useState, useEffect } from "react";

export function useAppTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as 'light' | 'dark') || 'dark';
    setTheme(savedTheme);
    document.body.classList.remove("light", "dark");
    document.body.classList.add(savedTheme);

    const handleThemeChange = () => {
      const currentTheme = (localStorage.getItem("theme") as 'light' | 'dark') || 'dark';
      setTheme(currentTheme);
      document.body.classList.remove("light", "dark");
      document.body.classList.add(currentTheme);
    };

    window.addEventListener("themeChanged", handleThemeChange);
    return () => {
      window.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.body.classList.remove("light", "dark");
    document.body.classList.add(nextTheme);
    window.dispatchEvent(new Event("themeChanged"));
  };

  return { theme, toggleTheme };
}
