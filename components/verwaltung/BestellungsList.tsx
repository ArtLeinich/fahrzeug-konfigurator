// components/verwaltung/BestellungsList.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  FileText,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  Download,
} from "lucide-react";
import { jsPDF } from "jspdf";

type BestellungStatus =
  | "Neu"
  | "Bestätigt"
  | "In Produktion"
  | "Fertig"
  | "Ausgeliefert";

const statusConfig: Record<
  BestellungStatus,
  {
    icon: React.ReactNode;
    color:
      | "default"
      | "secondary"
      | "primary"
      | "destructive"
      | "outline"
      | null;
    background: string;
  }
> = {
  Neu: {
    icon: <Clock className="h-4 w-4 mr-1" />,
    color: "secondary",
    background: "bg-secondary/20",
  },
  Bestätigt: {
    icon: <FileText className="h-4 w-4 mr-1" />,
    color: "primary",
    background: "bg-primary/10",
  },
  "In Produktion": {
    icon: <Truck className="h-4 w-4 mr-1" />,
    color: "primary",
    background: "bg-primary/20",
  },
  Fertig: {
    icon: <CheckCircle className="h-4 w-4 mr-1" />,
    color: "text-emerald-800",
    background: "bg-emerald-200 hover:bg-emerald-200",
  },
  Ausgeliefert: {
    icon: <CheckCircle className="h-4 w-4 mr-1" />,
    color: "text-emerald-800",
    background: "bg-emerald-100 hover:bg-emerald-100",
  },
};

export default function BestellungsList() {
  const { data: session } = useSession();
  const { showToast } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [bestellungen, setBestellungen] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedBestellungId, setExpandedBestellungId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchBestellungen = async () => {
      if (!session) return;

      setIsLoading(true);
      try {
        const response = await fetch("/api/bestellungen", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Fehler beim Laden der Bestellungen");
        }

        const data = await response.json();
        console.log("Данные от API /api/bestellungen:", data);
        setBestellungen(data.bestellungen || []);
      } catch (error) {
        showToast("Fehler beim Laden der Bestellungen", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestellungen();
  }, [session, showToast]);

  const filteredBestellungen = bestellungen.filter((bestellung) =>
    bestellung.fahrzeugName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number): string => {
    return `${value.toLocaleString("de-DE")} €`;
  };

  const toggleDetails = (id: string) => {
    setExpandedBestellungId(expandedBestellungId === id ? null : id);
  };

  const generatePDF = async (bestellung: any) => {
    const doc = new jsPDF();

    try {
      // statische logo.png-Datei mit Erhaltung des Seitenverhältnisses
      const logo = "/logo.png";
      const img = new Image();
      img.src = logo;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      const aspectRatio = img.width / img.height;
      const logoWidth = 50; // Feste Breite in mm
      const logoHeight = logoWidth / aspectRatio; // Berechnete Höhe in mm
      doc.addImage(logo, "PNG", 10, 10, logoWidth, logoHeight);
      generatePDFContent(doc, bestellung);
      doc.save(`Bestellung_${bestellung.id}.pdf`);
    } catch (error) {
      console.error("Fehler beim Generieren des PDFs:", error);
      showToast("Fehler beim Generieren des PDFs", "error");
      generatePDFContent(doc, bestellung);
      doc.save(`Bestellung_${bestellung.id}.pdf`);
    }
  };

  const generatePDFContent = (doc: jsPDF, bestellung: any) => {
    doc.setFont("Helvetica", "normal");

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Fahrzeugkonfigurator GmbH", 10, 35);
    doc.text("Musterstraße 123, 12345 Musterstadt", 10, 40);
    doc.text(
      "Tel: +49 123 456789 | Email: info@fahrzeugkonfigurator.de",
      10,
      45
    );

    doc.setDrawColor(200);
    doc.line(10, 50, 200, 50);

    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text("Bestellungsdetails", 105, 60, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(40);

    let yPosition = 70;

    doc.text(`Fahrzeug: ${bestellung.fahrzeugName}`, 10, yPosition);
    yPosition += 10;
    doc.text(
      `Gesamtpreis: ${formatCurrency(bestellung.gesamtPreis)}`,
      10,
      yPosition
    );
    yPosition += 10;
    doc.text(`Status: ${bestellung.status}`, 10, yPosition);
    yPosition += 10;
    doc.text(
      `Bestellt am: ${new Date(bestellung.bestellDatum).toLocaleDateString(
        "de-DE"
      )}`,
      10,
      yPosition
    );
    yPosition += 10;
    doc.text(
      `Voraussichtliche Lieferung: ${
        bestellung.lieferDatum
          ? new Date(bestellung.lieferDatum).toLocaleDateString("de-DE")
          : "Wird berechnet"
      }`,
      10,
      yPosition
    );
    yPosition += 15;

    doc.setFontSize(14);
    doc.text("Konfigurationsdetails", 10, yPosition);
    yPosition += 5;
    doc.setDrawColor(200);
    doc.line(10, yPosition, 80, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    doc.text(
      `Motor: ${bestellung.motor || "Unbekannter Motor"}`,
      10,
      yPosition
    );
    yPosition += 10;
    doc.text(`Farbe: ${bestellung.farbe || "Unbekannte Farbe"}`, 10, yPosition);
    yPosition += 10;
    doc.text(
      `Felgen: ${bestellung.felgen || "Unbekannte Felgen"}`,
      10,
      yPosition
    );
    yPosition += 10;
    doc.text(`Baujahr: ${bestellung.baujahr || "Unbekannt"}`, 10, yPosition);
    yPosition += 15;

    if (bestellung.options && bestellung.options.length > 0) {
      doc.setFontSize(14);
      doc.text("Zusätzliche Optionen", 10, yPosition);
      yPosition += 5;
      doc.setDrawColor(200);
      doc.line(10, yPosition, 80, yPosition);
      yPosition += 10;
      doc.setFontSize(12);

      bestellung.options.forEach((option: any, index: number) => {
        doc.text(
          `${index + 1}. ${option.name} (${option.kategorie}): ${formatCurrency(
            option.preis ?? 0
          )}`,
          10,
          yPosition
        );
        yPosition += 10;
      });
    }

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Vielen Dank für Ihre Bestellung!", 105, 280, { align: "center" });
    doc.text("FahrzeugKonfigurator GmbH", 105, 285, { align: "center" });
  };

  if (isLoading) {
    return <div>Lade Bestellungen...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-display font-medium">
          Meine Bestellungen
        </h2>
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Bestellung suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {filteredBestellungen.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              Keine Bestellungen gefunden
            </h3>
            <p className="text-muted-foreground mb-4">
              Sie haben noch keine Fahrzeuge bestellt oder Ihre Suche ergab
              keine Treffer.
            </p>
            <Link href="/konfigurator">
              <Button>Fahrzeug konfigurieren</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBestellungen.map((bestellung) => {
            const status = bestellung.status as BestellungStatus;
            const { icon, color, background } =
              statusConfig[status] || statusConfig["Neu"];
            const isExpanded = expandedBestellungId === bestellung.id;

            return (
              <Card key={bestellung.id} className="animate-fade-in">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{bestellung.fahrzeugName}</CardTitle>
                    <Badge
                      variant={color || "default"}
                      className={`${background} px-3 py-1`}
                    >
                      {icon}
                      {status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Bestellt am{" "}
                    {new Date(bestellung.bestellDatum).toLocaleDateString(
                      "de-DE"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Gesamtpreis
                      </p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(bestellung.gesamtPreis)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Voraussichtliche Lieferung
                      </p>
                      <p className="text-lg font-semibold">
                        {bestellung.lieferDatum
                          ? new Date(bestellung.lieferDatum).toLocaleDateString(
                              "de-DE"
                            )
                          : "Wird berechnet"}
                      </p>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-2 text-sm">
                      <p>
                        <strong>Motor:</strong>{" "}
                        {bestellung.motor || "Unbekannter Motor"}
                      </p>
                      <p>
                        <strong>Farbe:</strong>{" "}
                        {bestellung.farbe || "Unbekannte Farbe"}
                      </p>
                      <p>
                        <strong>Felgen:</strong>{" "}
                        {bestellung.felgen || "Unbekannte Felgen"}
                      </p>
                      <p>
                        <strong>Baujahr:</strong>{" "}
                        {bestellung.baujahr || "Unbekannt"}
                      </p>
                      {bestellung.options && bestellung.options.length > 0 && (
                        <div className="mt-2">
                          <strong>Zusätzliche Optionen:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {bestellung.options.map(
                              (option: any, index: number) => (
                                <li key={index} className="text-gray-700">
                                  <span className="font-medium">
                                    {option.name}
                                  </span>{" "}
                                  ({option.kategorie}): {option.value}
                                  <span className="text-green-600">
                                    {" "}
                                    (+
                                    {option.preis != null
                                      ? option.preis.toLocaleString("de-DE")
                                      : "0"}{" "}
                                    €)
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDetails(bestellung.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {isExpanded ? "Weniger" : "Details anzeigen"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generatePDF(bestellung)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Als PDF
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
