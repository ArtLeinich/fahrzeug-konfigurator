"use client";

import React from "react";
import Link from "next/link";
import FahrzeugCard from "@/components/FahrzeugCard";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { ChevronRight, Car, Settings, ShoppingCart } from "lucide-react";

export default function ClientIndex() {
  const { fahrzeuge } = useAppContext();
  const featuredFahrzeuge = fahrzeuge.slice(0, 3);

  return (
    <>
      <section className="py-16 bg-primary text-white md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Ihr Traumfahrzeug ist nur wenige Klicks entfernt
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Entdecken, konfigurieren und bestellen Sie Ihr Wunschfahrzeug mit
              unserem innovativen Konfigurator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/katalog">
                <Button
                  size="lg"
                  variant="outline"
                  className="border border-primary-foreground bg-primary hover:bg-secondary-foreground/90 hover:text-secondary"
                >
                  Fahrzeuge entdecken
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/konfigurator">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-primary border-white hover:bg-secondary-foreground hover:text-secondary"
                >
                  Direkt konfigurieren
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Entdecken Sie unsere Serviceleistungen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <Car size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Umfangreicher Fahrzeugkatalog
              </h3>
              <p className="text-gray-600">
                Durchstöbern Sie unser exklusives Angebot an Premium-Fahrzeugen
                mit detaillierten Informationen.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <Settings size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Individueller Konfigurator
              </h3>
              <p className="text-gray-600">
                Gestalten Sie Ihr Traumauto mit unserem intuitiven Konfigurator
                nach Ihren persönlichen Vorstellungen.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <ShoppingCart size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Einfache Kaufabwicklung
              </h3>
              <p className="text-gray-600">
                Verwalten Sie Ihre Konfigurationen, Bestellungen und Termine in
                unserem Kundencenter.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Unsere Top-Modelle</h2>
            <Link href="/katalog" className="text-primary hover:text-primary/80 flex items-center">
              Alle Fahrzeuge ansehen
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredFahrzeuge.map((fahrzeug) => (
              <FahrzeugCard key={fahrzeug.id} fahrzeug={fahrzeug} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Bereit für Ihr Traumauto?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Starten Sie jetzt mit der Konfiguration Ihres Wunschfahrzeugs und
            erleben Sie die Fahrzeugauswahl der nächsten Generation.
          </p>
          <Link href="/konfigurator">
            <Button
              size="lg"
              variant="outline"
              className="text-primary border-white hover:bg-white/10 hover:text-secondary"
            >
              Jetzt konfigurieren
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}