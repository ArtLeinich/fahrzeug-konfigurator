"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import NavigationButtons from "./NavigationButtons";

interface ZusammenfassungTabProps {
  onTabChange: (value: string) => void;
}

const ZusammenfassungTab: React.FC<ZusammenfassungTabProps> = ({ onTabChange }) => {
  const {
    aktuellesFahrzeug,
    aktuellerMotor,
    aktuelleFarbe,
    aktuelleFelgen,
    aktuelleAusstattungen,
    berechneGesamtpreis,
    resetKonfiguration,
  } = useAppContext();

  const handleReset = () => {
    resetKonfiguration(); // Очищает все значения
    onTabChange("fahrzeug"); // Возвращает на первую вкладку
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Ihre Konfiguration</h2>
      {aktuellesFahrzeug && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img
                src={aktuellesFahrzeug.bildUrl}
                alt={`${aktuellesFahrzeug.marke} ${aktuellesFahrzeug.modell}`}
                className="w-full h-auto rounded-lg"
              />
              {aktuelleFarbe && (
                <div
                  className="mt-2 p-1 rounded text-center text-sm"
                  style={{
                    backgroundColor: aktuelleFarbe.farbcode,
                    color: aktuelleFarbe.farbcode.startsWith("#f") ? "#000" : "#fff",
                  }}
                >
                  {aktuelleFarbe.name}
                </div>
              )}
            </div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold">
                {aktuellesFahrzeug.marke} {aktuellesFahrzeug.modell}
              </h3>
              <p className="text-gray-600 mb-4">{aktuellesFahrzeug.beschreibung}</p>

              <div className="space-y-4">
                {aktuellerMotor && (
                  <div>
                    <h4 className="font-semibold mb-1">Motor</h4>
                    <p>
                      {aktuellerMotor.name} - {aktuellerMotor.ps} PS
                    </p>
                  </div>
                )}
                {aktuelleFarbe && (
                  <div>
                    <h4 className="font-semibold mb-1">Lackierung</h4>
                    <div className="flex items-center">
                      <div
                        className="w-6 h-6 rounded-full mr-2"
                        style={{ backgroundColor: aktuelleFarbe.farbcode }}
                      ></div>
                      <p>
                        {aktuelleFarbe.name} ({aktuelleFarbe.typ})
                      </p>
                    </div>
                  </div>
                )}
                {aktuelleFelgen && (
                  <div>
                    <h4 className="font-semibold mb-1">Felgen</h4>
                    <p>
                      {aktuelleFelgen.name} ({aktuelleFelgen.groesse} Zoll)
                    </p>
                  </div>
                )}
                {aktuelleAusstattungen && aktuelleAusstattungen.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-1">Zusätzliche Ausstattung</h4>
                    <ul className="list-disc list-inside">
                      {aktuelleAusstattungen.map((ausstattung) => (
                        <li key={ausstattung.id}>{ausstattung.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-between items-center">
              <h4 className="text-xl font-bold">Gesamtpreis</h4>
              <span className="text-2xl font-bold">
                {berechneGesamtpreis().toLocaleString("de-DE")} €
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full md:w-auto mr-0"
          >
            Zurücksetzen
          </Button>
        </div>
        <NavigationButtons currentTab="zusammenfassung" setTab={onTabChange} />
      </div>
    </div>
  );
};

export default ZusammenfassungTab;