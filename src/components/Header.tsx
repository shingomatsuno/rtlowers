"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { path: "/", name: "home" },
  { path: "/#news", name: "news" },
  { path: "/#schedule", name: "schedule" },
  { path: "/#about", name: "about" },
  { path: "/#videos", name: "videos" },
  { path: "/#contact", name: "contact" },
];

export function Header({ title }: { title: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [active, setActive] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    console.log("useEffect");
    const observers: IntersectionObserver[] = [];

    navLinks.forEach(({ name: id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(id);
          }
        },
        { threshold: 0.5 } // 半分見えたらアクティブに
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">{title}</span>
          </Link>
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            {navLinks.map(({ path, name }) => (
              <Link
                key={name}
                href={path}
                className={`text-sm uppercase tracking-wider transition-colors hover:text-red-500 ${
                  active === name ? "text-red-500" : "text-white/70"
                }`}
              >
                {name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-red-500 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 top-[64px] bg-black h-screen backdrop-blur-lg transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-fit mt-5 gap-8 px-6">
          {navLinks.map(({ path, name }) => (
            <Link
              key={name}
              href={path}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-2xl uppercase tracking-wider transition-colors hover:text-red-500 ${
                active === name ? "text-red-500" : "text-white/70"
              }`}
            >
              {name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
