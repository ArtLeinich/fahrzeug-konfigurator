// components/KonfigurationsList.tsx
"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
import { Eye, Play, AlertTriangle, Trash2, CreditCard } from "lucide-react";

export default function KonfigurationsList() {
  const { fahrzeuge, showToast } = useAppContext();
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [konfigurationen, setKonfigurationen] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedKonfigId, setExpandedKonfigId] = useState<string | null>(null);

  useEffect(() => {
    const fetchKonfigurationen = async () => {
      if (!session) return;

      setIsLoading(true);
      try {
        const response = await fetch("/api/verwaltung", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Fehler beim Laden der Konfigurationen");
        }

        const data = await response.json();
        console.log("Erhaltene Konfigurationen:", data.konfigurationen);
        setKonfigurationen(data.konfigurationen || []);
      } catch (error) {
        showToast("Fehler beim Laden der Konfigurationen", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchKonfigurationen();
  }, [session, showToast]);

  const filteredKonfigurationen = konfigurationen.filter((konfig) => {
    const fahrzeugName = konfig.fahrzeug || "";
    return fahrzeugName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDeleteKonfiguration = async (id: string) => {
    try {
      const response = await fetch(`/api/konfigurator/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Fehler beim Löschen der Konfiguration");
      }

      setKonfigurationen(konfigurationen.filter((konfig) => konfig.id !== id));
      showToast("Konfiguration wurde gelöscht", "success");
      if (expandedKonfigId === id) setExpandedKonfigId(null);
    } catch (error) {
      showToast("Fehler beim Löschen der Konfiguration", "error");
    }
  };

  const handlePayment = async (id: string) => {
    try {
      const response = await fetch("/api/bestellungen/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ konfigurationId: id }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Erstellen der Bestellung");
      }

      showToast("Ihre Bestellung wurde aufgenommen und wird bearbeitet!", "success");
      setKonfigurationen((prev) =>
        prev.map((konfig) =>
          konfig.id === id ? { ...konfig, isBestellt: true } : konfig
        )
      );
    } catch (error) {
      showToast("Fehler beim Erstellen der Bestellung", "error");
    }
  };

  const formatCurrency = (value: number): string => {
    return `${value.toLocaleString("de-DE")} €`;
  };

  const toggleDetails = (id: string) => {
    setExpandedKonfigId(expandedKonfigId === id ? null : id);
  };

  if (isLoading) {
    return <div>Lade Konfigurationen...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-display font-medium">
          Gespeicherte Konfigurationen
        </h2>
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Konfiguration suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {filteredKonfigurationen.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              Keine Konfigurationen gefunden
            </h3>
            <p className="text-muted-foreground mb-4">
              Sie haben noch keine Fahrzeugkonfigurationen gespeichert oder Ihre
              Suche ergab keine Treffer.
            </p>
            <Link href="/konfigurator">
              <Button>Neues Fahrzeug konfigurieren</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredKonfigurationen.map((konfig) => {
            const fahrzeug = fahrzeuge.find((f) => f.id === konfig.fahrzeugId);
            const fahrzeugName = konfig.fahrzeug || "Unbekanntes Fahrzeug";
            const isExpanded = expandedKonfigId === konfig.id;

            return (
              <Card key={konfig.id} className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{fahrzeugName}</span>
                    <span className="text-primary font-semibold">
                      {formatCurrency(konfig.gesamtpreis)}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Erstellt am{" "}
                    {new Date(konfig.createdAt).toLocaleDateString("de-DE")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {fahrzeug && (
                    <div className="aspect-[16/9] overflow-hidden rounded-md bg-muted">
                      <img
                        src={fahrzeug.bildUrl || "/placeholder.svg"}
                        alt={fahrzeugName}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  {isExpanded && (
                    <div className="mt-4 space-y-2 text-sm">
                      {/* Angaben zur Konfiguration */}
                      <p><strong>Motor:</strong> {konfig.motor || "Unbekannter Motor"}</p>
                      <p><strong>Farbe:</strong> {konfig.farbe || "Unbekannte Farbe"}</p>
                      <p><strong>Felgen:</strong> {konfig.felgen || "Unbekannte Felgen"}</p>
                      {/* Fahrzeugdaten */}
                      {fahrzeug && (
                        <>
                          <p><strong>Baujahr:</strong> {fahrzeug.baujahr}</p>
                          <p><strong>Verfügbarkeit:</strong> {fahrzeug.verfuegbar ? "Ja" : "Nein"}</p>
                          <p><strong>Beschreibung:</strong> {fahrzeug.beschreibung || "Keine Beschreibung"}</p>
                        </>
                      )}
                      {/* Zusätzliche Optionen (Ausstattung) */}
                      {konfig.options && konfig.options.length > 0 && (
                        <div className="mt-2">
                          <strong>Zusätzliche Optionen:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {konfig.options.map((option: any, index: number) => (
                              <li key={index} className="text-gray-700">
                                <span className="font-medium">{option.name}</span> ({option.kategorie}): {option.value}
                                <span className="text-green-600"> (+{option.preis.toLocaleString("de-DE")} €)</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row justify-between w-full">
                    {/* Mobile Version: „Löschen“ und „Details“ in einer eingerückten Zeile */}
                    <div className="flex w-full sm:w-auto gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteKonfiguration(konfig.id)}
                        className="w-1/2 sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Löschen
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleDetails(konfig.id)}
                        className="w-1/2 sm:w-auto"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {isExpanded ? "Weniger" : "Details"}
                      </Button>
                    </div>
                    {/* Mobile Version: „Konfigurieren“ unten rechts eingerückt */}
                    <div className="w-full sm:w-auto mt-2 sm:mt-0">
                      <Link href={`/konfigurator/${konfig.fahrzeugId}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={konfig.isBestellt}
                          className="w-1/2 ml-auto sm:w-auto"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Konfigurieren
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handlePayment(konfig.id)}
                    disabled={konfig.isBestellt}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {konfig.isBestellt ? "Bestellt" : "Jetzt kaufen"}
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