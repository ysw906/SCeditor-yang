import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 mix-blend-difference text-white px-6 md:px-16",
        scrolled ? "py-4" : "py-6"
      )}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold uppercase tracking-[0.15em] text-sm hover:opacity-50 transition-opacity">
          Yang.
        </Link>

        {location === "/" && (
          <nav className="hidden md:flex gap-10 text-xs font-semibold tracking-[0.18em] uppercase">
            <a href="#projects" className="hover:opacity-50 transition-opacity">Projects</a>
            <a href="#career" className="hover:opacity-50 transition-opacity">Career</a>
            <a href="#skills" className="hover:opacity-50 transition-opacity">Skills</a>
            <a href="#contact" className="hover:opacity-50 transition-opacity">Contact</a>
          </nav>
        )}

        {location !== "/" && (
          <nav className="hidden md:flex gap-10 text-xs font-semibold tracking-[0.18em] uppercase">
            <Link href="/" className="hover:opacity-50 transition-opacity">← Back to Portfolio</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
