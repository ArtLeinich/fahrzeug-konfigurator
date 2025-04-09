"use client";

import React from "react";
import { Fahrzeug } from "@/types/models";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Car, AlertTriangle, Check, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FahrzeugCardProps {
  fahrzeug: Fahrzeug;
  onConfigure: (fahrzeugId: string) => void;
}

const FahrzeugCard = ({ fahrzeug, onConfigure }: FahrzeugCardProps) => {
  const router = useRouter();

  const handleConfigure = () => {
    if (fahrzeug.verfuegbar) {
      onConfigure(fahrzeug.id);
      router.push(`/konfigurator/${fahrzeug.id}?tab=motor`);
    }
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-muted ">
        <img
          src={fahrzeug.bildUrl}
          alt={`${fahrzeug.marke} ${fahrzeug.modell}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {!fahrzeug.verfuegbar && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-center px-4 py-2 rounded-md bg-black/40 backdrop-blur-sm">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
              <span className="text-white text-sm font-medium">
                Nicht verfügbar
              </span>
            </div>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="font-medium">
            <Car className="h-3 w-3 mr-1" />
            {fahrzeug.marke}
          </Badge>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium">{fahrzeug.modell}</h3>
          <span className="font-semibold text-primary">
            {fahrzeug.basisPreis.toLocaleString("de-DE")} €
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow">
          {fahrzeug.beschreibung}
        </p>
        <div className="flex items-center justify-between pt-3 border-t mt-2">
          <div className="flex items-center text-sm">
            {fahrzeug.verfuegbar ? (
              <>
                <Check className="h-4 w-4 text-primary mr-1" />
                <span className="text-muted-foreground">Verfügbar</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-muted-foreground">Nicht verfügbar</span>
              </>
            )}
          </div>
          <div className="flex gap-2 text-sm">
            <Link
              href={`/katalog/${fahrzeug.id}`}
              className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1 flex items-center gap-1"
            >
              <Info size={14} />
              <span>Details</span>
            </Link>

            {fahrzeug.verfuegbar && (
              <button
                onClick={handleConfigure}
                className="text-primary hover:text-primary/80 transition-colors font-medium flex items-center px-2 py-1"
              >
                <span className="mr-1">Konfigurieren</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FahrzeugCard;
