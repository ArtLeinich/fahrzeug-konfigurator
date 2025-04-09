"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import { Check } from "lucide-react";

const AusstattungTab: React.FC = () => {
  const { ausstattungen, aktuelleAusstattungen, toggleAusstattung } =
    useAppContext();

  // Gruppierung nach Kategorie
  const ausstattungNachKategorie = ausstattungen.reduce(
    (acc, ausstattung) => {
      if (!acc[ausstattung.kategorie]) {
        acc[ausstattung.kategorie] = [];
      }
      acc[ausstattung.kategorie].push(ausstattung);
      return acc;
    },
    {} as Record<string, typeof ausstattungen>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Wählen Sie Ihre Ausstattung</h2>
      {Object.entries(ausstattungNachKategorie).map(([kategorie, items]) => (
        <div key={kategorie} className="mb-6">
          <h3 className="text-xl font-medium mb-3">{kategorie}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {items.map((ausstattung) => (
              <Card
                key={ausstattung.id}
                className={`cursor-pointer hover:border-primary transition-colors ${
                  aktuelleAusstattungen.some((a) => a.id === ausstattung.id)
                    ? "border-primary"
                    : ""
                }`}
                onClick={() => toggleAusstattung(ausstattung.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-semibold">{ausstattung.name}</h4>
                      <p className="text-sm text-gray-600">
                        {ausstattung.beschreibung}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold mr-3">
                        + {ausstattung.preis.toLocaleString("de-DE")} €
                      </span>
                      {aktuelleAusstattungen.some(
                        (a) => a.id === ausstattung.id
                      ) && (
                        <div className="bg-primary text-white p-1 rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AusstattungTab;