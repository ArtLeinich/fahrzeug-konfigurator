"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Check,
  XCircle,
  ChevronLeft,
  ArrowRight,
  Calendar,
  Fuel,
  Gauge,
  BadgeEuro,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function FahrzeugDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { fahrzeuge, setFahrzeug } = useAppContext();

  const fahrzeug = fahrzeuge.find((f) => f.id === id);

  if (!fahrzeug) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Fahrzeug nicht gefunden</h1>
          <p className="mb-8">Das von Ihnen gesuchte Fahrzeug konnte nicht gefunden werden.</p>
          <Button onClick={() => router.push("/katalog")}>
            Zurück zum Katalog
          </Button>
        </div>
      </Layout>
    );
  }

  const handleKonfigurieren = () => {
    setFahrzeug(fahrzeug.id);
    router.push("/konfigurator");
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/katalog")}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Zurück zum Katalog
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="overflow-hidden rounded-lg">
            <img
              src={fahrzeug.bildUrl}
              alt={`${fahrzeug.marke} ${fahrzeug.modell}`}
              className="w-full h-auto object-cover"
            />
          </div>
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{fahrzeug.marke} {fahrzeug.modell}</h1>
                <p className="text-gray-600">Baujahr {fahrzeug.baujahr}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{fahrzeug.basisPreis.toLocaleString("de-DE")} €</div>
                <p className="text-sm text-gray-600">Grundpreis ohne Extras</p>
              </div>
            </div>
            <Separator className="my-6" />
            <p className="text-lg mb-6">{fahrzeug.beschreibung}</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                <span>Baujahr: {fahrzeug.baujahr}</span>
              </div>
              <div className="flex items-center">
                <Fuel className="h-5 w-5 mr-2 text-primary" />
                <span>Verfügbare Antriebe: Benzin, Diesel, Hybrid</span>
              </div>
              <div className="flex items-center">
                <Gauge className="h-5 w-5 mr-2 text-primary" />
                <span>Leistung: bis zu 286 PS</span>
              </div>
              <div className="flex items-center">
                <BadgeEuro className="h-5 w-5 mr-2 text-primary" />
                <span>Basispreis: {fahrzeug.basisPreis.toLocaleString("de-DE")} €</span>
              </div>
            </div>
            <div className="flex items-center mb-6">
              <div
                className={`p-1 rounded-full ${
                  fahrzeug.verfuegbar ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                } flex items-center mr-2`}
              >
                {fahrzeug.verfuegbar ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
              </div>
              <span>{fahrzeug.verfuegbar ? "Sofort verfügbar" : "Nicht verfügbar"}</span>
            </div>
            <div className="space-y-4">
              <Button
                onClick={handleKonfigurieren}
                className="w-full flex items-center justify-center"
                disabled={!fahrzeug.verfuegbar}
              >
                <span>Dieses Fahrzeug konfigurieren</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  window.open(
                    `mailto:info@fahrzeugkonfigurator.de?subject=Anfrage zu ${fahrzeug.marke} ${fahrzeug.modell}`,
                    "_blank"
                  )
                }
              >
                Kontakt zum Berater
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Ähnliche Fahrzeuge</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fahrzeuge
              .filter((f) => f.id !== fahrzeug.id)
              .slice(0, 3)
              .map((similarFahrzeug) => (
                <Link key={similarFahrzeug.id} href={`/katalog/${similarFahrzeug.id}`} className="block">
                  <div className="rounded-lg overflow-hidden border hover:shadow-md transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={similarFahrzeug.bildUrl}
                        alt={`${similarFahrzeug.marke} ${similarFahrzeug.modell}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{similarFahrzeug.marke} {similarFahrzeug.modell}</h3>
                      <p className="text-gray-600 text-sm mb-2">Baujahr {similarFahrzeug.baujahr}</p>
                      <p className="font-semibold">{similarFahrzeug.basisPreis.toLocaleString("de-DE")} €</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}