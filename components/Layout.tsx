import React, { ReactNode } from "react";
import Navigation from "./Navigation";
import Link from "next/link";
import { Car, Phone, Mail, MapPin, ChevronRight } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-grow pt-16">{children}</main>
      <footer className="bg-card border-t py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center mr-2">
                  <Car className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-semibold text-lg">FahrzeugKonfigurator</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Ihr Partner für maßgeschneiderte Fahrzeugkonfigurationen seit 2023.
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-base mb-4 pb-1 border-b border-border">
                Schnellzugriff
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="flex items-center hover:text-primary transition-colors"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" />
                    <span>Startseite</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/katalog"
                    className="flex items-center hover:text-primary transition-colors"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" />
                    <span>Fahrzeugkatalog</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/konfigurator"
                    className="flex items-center hover:text-primary transition-colors"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" />
                    <span>Konfigurator</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/verwaltung"
                    className="flex items-center hover:text-primary transition-colors"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" />
                    <span>Kaufverwaltung</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-base mb-4 pb-1 border-b border-border">
                Rechtliches
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="flex items-center hover:text-primary transition-colors"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" />
                    <span>Impressum</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center hover:text-primary transition-colors"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" />
                    <span>Datenschutz</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center hover:text-primary transition-colors"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" />
                    <span>AGB</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center hover:text-primary transition-colors"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" />
                    <span>Widerrufsrecht</span>
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-base mb-4 pb-1 border-b border-border">
                Kontakt
              </h3>
              <address className="text-sm text-muted-foreground not-italic space-y-3">
                <p className="flex items-start">
                  <MapPin className="h-4 w-4 mt-0.5 mr-2 text-primary" />
                  <span>
                  Fahrzeugkonfigurator GmbH
                    <br />
                    Musterstraße 123
                    <br />
                    12345 Musterstadt
                  </span>
                </p>
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  <span>+49 (0) 123 456789</span>
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-primary" />
                  <a
                    href="mailto:info@fahrzeugkonfigurator.de"
                    className="text-primary hover:underline"
                  >
                    info@fahrzeugkonfigurator.de
                  </a>
                </p>
              </address>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Fahrzeugkonfigurator GmbH. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;