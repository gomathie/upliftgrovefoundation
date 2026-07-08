"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/programs", label: "Programs" },
    { href: "/get-involved", label: "Get Involved" },
    { href: "/donate", label: "Donate" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-heading font-bold text-2xl text-primary-navy tracking-tight" onClick={closeMenu}>
              UpliftGrove<span className="text-accent-gold">.</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-charcoal hover:text-primary-navy font-medium transition-colors text-sm lg:text-base"
              >
                {link.label}
              </Link>
            ))}
            <div className="hidden md:block">
               <Link
                href="/support"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-accent-gold text-primary-navy font-heading font-semibold rounded-md hover:bg-opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-gold"
              >
                Get Support
              </Link>
            </div>
          </nav>

          {/* Mobile priority CTA + Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/support"
              className="inline-flex items-center justify-center px-4 py-2 bg-accent-gold text-primary-navy font-heading font-semibold text-sm rounded-md hover:bg-opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-gold"
            >
              Get Support
            </Link>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-navy hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-navy"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-text-charcoal hover:text-primary-navy hover:bg-gray-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
