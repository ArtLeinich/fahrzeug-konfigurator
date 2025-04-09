"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/AppContext";
import { AlertCircle } from "lucide-react";

const KonfigurationsUebersicht = () => {
  const {
    aktuellesFahrzeug,
    aktuellerMotor,
    aktuelleFarbe,
    aktuelleFelgen,
    aktuelleAusstattungen,
    berechneGesamtpreis,
  } = useAppContext();

  if (!aktuellesFahrzeug) {
    return (
      <Card className="border shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center h-48">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">Bitte wählen Sie ein Fahrzeug aus</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Beginnen Sie mit der Auswahl eines Fahrzeugs
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="relative h-40 overflow-hidden bg-muted rounded-md">
            <img
              src={aktuellesFahrzeug.bildUrl}
              alt={`${aktuellesFahrzeug.marke} ${aktuellesFahrzeug.modell}`}
              className="w-full h-full object-cover"
            />
            {aktuelleFarbe && (
              <div
                className="absolute bottom-0 left-0 w-full h-2"
                style={{ backgroundColor: aktuelleFarbe.farbcode }}
              ></div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-lg">
                {aktuellesFahrzeug.marke} {aktuellesFahrzeug.modell}
              </h3>
              <Badge variant="outline" className="font-normal">
                Basis: {aktuellesFahrzeug.basisPreis.toLocaleString("de-DE")} €
              </Badge>
            </div>

            {aktuellerMotor ? (
              <div className="flex justify-between items-center">
                <p className="text-sm">
                  <span className="font-medium">Motor:</span> {aktuellerMotor.name} (
                  {aktuellerMotor.ps} PS)
                </p>
                {aktuellerMotor.preis > 0 && (
                  <span className="text-sm text-muted-foreground">
                    +{aktuellerMotor.preis.toLocaleString("de-DE")} €
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-red-500 font-medium">Motor auswählen</p>
            )}

            {aktuelleFarbe ? (
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm">
                  <span className="font-medium mr-1">Farbe:</span>
                  <div
                    className="w-4 h-4 rounded-full ml-1 mr-1"
                    style={{ backgroundColor: aktuelleFarbe.farbcode }}
                  ></div>
                  <span>{aktuelleFarbe.name}</span>
                </div>
                {aktuelleFarbe.preis > 0 && (
                  <span className="text-sm text-muted-foreground">
                    +{aktuelleFarbe.preis.toLocaleString("de-DE")} €
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-red-500 font-medium">Farbe auswählen</p>
            )}

            {aktuelleFelgen ? (
              <div className="flex justify-between items-center">
                <p className="text-sm">
                  <span className="font-medium">Felgen:</span> {aktuelleFelgen.name}
                </p>
                {aktuelleFelgen.preis > 0 && (
                  <span className="text-sm text-muted-foreground">
                    +{aktuelleFelgen.preis.toLocaleString("de-DE")} €
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-red-500 font-medium">Felgen auswählen</p>
            )}

            {aktuelleAusstattungen.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Ausstattung:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {aktuelleAusstattungen.map((item) => (
                    <Badge key={item.id} variant="secondary" className="text-xs">
                      {item.name}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-right text-muted-foreground mt-1">
                  +{aktuelleAusstattungen.reduce((sum, item) => sum + item.preis, 0).toLocaleString("de-DE")} €
                </p>
              </div>
            )}
          </div>

          <div className="border-t pt-3 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Gesamtpreis:</span>
              <span className="text-xl font-bold">
                {berechneGesamtpreis().toLocaleString("de-DE")} €
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KonfigurationsUebersicht;