"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { path: "/", name: "home" },
  { path: "/#news", name: "news" },
  { path: "/#live", name: "live" },
  { path: "/#about", name: "about" },
  { path: "/#music", name: "music" },
  { path: "/#contact", name: "contact" },
];

export function Header({ title }: { title: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [active, setActive] = useState("");
  const pathname = usePathname();

  useEffect(() => {
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
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">{title}</span>
          </Link>
          {/* Desktop Menu */}
          <div className="hidden gap-8 md:flex">
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
            className="text-white transition-colors hover:text-red-500 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 top-[64px] h-screen bg-black backdrop-blur-lg transition-transform duration-300 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mt-5 flex h-fit flex-col items-center justify-center gap-8 px-6">
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
