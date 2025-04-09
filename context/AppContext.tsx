// context/AppContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToastContext } from "@/context/ToastContext";

interface Fahrzeug {
  id: string;
  marke: string;
  modell: string;
  basisPreis: number;
  bildUrl: string;
  beschreibung: string;
  verfuegbar: boolean;
  kategorieId: string;
  baujahr: number;
}

interface Motor {
  id: string;
  name: string;
  ps: number;
  preis: number;
}

interface Farbe {
  id: string;
  name: string;
  farbcode: string;
  preis: number;
  typ: string;
}

interface Felgen {
  id: string;
  name: string;
  groesse: number;
  preis: number;
  design: string;
  bildUrl: string;
}

interface Ausstattung {
  id: string;
  name: string;
  preis: number;
  kategorie: string;
}

interface Kategorie {
  id: string;
  name: string;
  fahrzeuge: Fahrzeug[];
}

interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface AppContextType {
  fahrzeuge: Fahrzeug[];
  motoren: Motor[];
  farben: Farbe[];
  felgen: Felgen[];
  ausstattungen: Ausstattung[];
  kategorien: Kategorie[];
  aktuellesFahrzeug: Fahrzeug | null;
  aktuellerMotor: Motor | null;
  aktuelleFarbe: Farbe | null;
  aktuelleFelgen: Felgen | null;
  aktuelleAusstattungen: Ausstattung[];
  isLoading: boolean;
  isEditing: boolean;
  toggleEditing: () => void;
  setFahrzeug: (id: string) => void;
  setMotor: (id: string) => void;
  setFarbe: (id: string) => void;
  setFelgen: (id: string) => void;
  toggleAusstattung: (id: string) => void;
  berechneGesamtpreis: () => number;
  speichereKonfiguration: () => void;
  resetKonfiguration: () => void;
  validateStep: (step: string) => boolean;
  setFarben: (farben: Farbe[]) => void;
  removeFarbe: (id: string) => void;
  setFelgen: (felgen: Felgen[]) => void;
  removeFelge: (id: string) => void;
  showToast: (message: string, type: "success" | "error" | "info", options?: ToastOptions) => void;
  dismissToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [fahrzeuge, setFahrzeuge] = useState<Fahrzeug[]>([]);
  const [motoren, setMotoren] = useState<Motor[]>([]);
  const [farben, setFarben] = useState<Farbe[]>([]);
  const [felgen, setFelgen] = useState<Felgen[]>([]);
  const [ausstattungen, setAusstattungen] = useState<Ausstattung[]>([]);
  const [kategorien, setKategorien] = useState<Kategorie[]>([]);
  const [aktuellesFahrzeug, setAktuellesFahrzeug] = useState<Fahrzeug | null>(null);
  const [aktuellerMotor, setAktuellerMotor] = useState<Motor | null>(null);
  const [aktuelleFarbe, setAktuelleFarbe] = useState<Farbe | null>(null);
  const [aktuelleFelgen, setAktuelleFelgen] = useState<Felgen | null>(null);
  const [aktuelleAusstattungen, setAktuelleAusstattungen] = useState<Ausstattung[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast, dismissToast } = useToastContext();
  const prevAusstattungenLength = useRef<number>(aktuelleAusstattungen.length); // Verfolgen Sie die vorherige Länge
  const isInitialLoad = useRef(true); // Flagge für den ersten Start

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/konfigurator/data");
        const data = await response.json();
        setFahrzeuge(data.fahrzeuge);
        setMotoren(data.motoren);
        setFarben(data.farben);
        setFelgen(data.felgen);
        setAusstattungen(data.ausstattungen);
        setKategorien(data.kategorien);
      } catch (error) {
        showToast(
          "Fehler beim Laden der Daten",
          "error",
          {
            description: error instanceof Error ? error.message : "Unbekannter Fehler",
          }
        );
      } finally {
        setIsLoading(false);
        isInitialLoad.current = false;
      }
    };
    fetchData();
  }, [showToast]);

  useEffect(() => {
    if (aktuellesFahrzeug) {
      showToast(`${aktuellesFahrzeug.marke} ${aktuellesFahrzeug.modell} ausgewählt`, "success");
    }
  }, [aktuellesFahrzeug, showToast]);

  useEffect(() => {
    if (aktuellerMotor) {
      showToast(`Motor ${aktuellerMotor.name} ausgewählt`, "success");
    }
  }, [aktuellerMotor, showToast]);

  useEffect(() => {
    if (aktuelleFarbe) {
      showToast(`Farbe ${aktuelleFarbe.name} ausgewählt`, "success");
    }
  }, [aktuelleFarbe, showToast]);

  useEffect(() => {
    if (aktuelleFelgen) {
      showToast(`Felgen ${aktuelleFelgen.name} ausgewählt`, "success");
    }
  }, [aktuelleFelgen, showToast]);

  useEffect(() => {
    // Prüfen, ob dies nicht der erste Start ist
    if (!isInitialLoad.current && ausstattungen.length > 0) {
      // Prüfung, ob der Übergang von einem nicht leeren Zustand in einen leeren Zustand stattgefunden hat
      if (prevAusstattungenLength.current > 0 && aktuelleAusstattungen.length === 0) {
        showToast("Alle Ausstattungen entfernt", "info");
      }
      // Anzeige der Hinzufügungsbenachrichtigung nur, wenn die Länge zugenommen hat
      if (aktuelleAusstattungen.length > prevAusstattungenLength.current) {
        const lastAusstattung = aktuelleAusstattungen[aktuelleAusstattungen.length - 1];
        showToast(`${lastAusstattung.name} ausgewählt`, "success");
      }
    }
    // Den vorherigen Wert aktualisieren
    prevAusstattungenLength.current = aktuelleAusstattungen.length;
  }, [aktuelleAusstattungen, ausstattungen, showToast]);

  const handleSetFahrzeug = (id: string) => {
    const fahrzeug = fahrzeuge.find((f) => f.id === id) || null;
    setAktuellesFahrzeug(fahrzeug);
  };

  const handleSetMotor = (id: string) => {
    const motor = motoren.find((m) => m.id === id) || null;
    setAktuellerMotor(motor);
  };

  const handleSetFarbe = (id: string) => {
    const farbe = farben.find((f) => f.id === id) || null;
    setAktuelleFarbe(farbe);
  };

  const handleSetFelgen = (id: string) => {
    const felge = felgen.find((f) => f.id === id) || null;
    setAktuelleFelgen(felge);
  };

  const toggleEditing = () => {
    if (session?.user.role === "ADMIN") {
      setIsEditing((prev) => !prev);
    } else {
      showToast("Nur Administratoren können bearbeiten", "error");
    }
  };

  const toggleAusstattung = (id: string) => {
    const ausstattung = ausstattungen.find((a) => a.id === id);
    if (!ausstattung) return;
    setAktuelleAusstattungen((prev) =>
      prev.some((a) => a.id === id)
        ? prev.filter((a) => a.id !== id)
        : [...prev, ausstattung]
    );
  };

  const berechneGesamtpreis = () => {
    const basisPreis = aktuellesFahrzeug?.basisPreis || 0;
    const motorPreis = aktuellerMotor?.preis || 0;
    const farbePreis = aktuelleFarbe?.preis || 0;
    const felgenPreis = aktuelleFelgen?.preis || 0;
    const ausstattungPreis = aktuelleAusstattungen.reduce((sum, a) => sum + a.preis, 0);
    return basisPreis + motorPreis + farbePreis + felgenPreis + ausstattungPreis;
  };

  const speichereKonfiguration = async () => {
    if (!session) {
      showToast("Anmeldung erforderlich", "error", {
        description: "Bitte melden Sie sich an, um die Konfiguration zu speichern",
        action: {
          label: "Anmelden",
          onClick: () => router.push("/login"),
        },
      });
      router.push("/login");
      return;
    }
  
    if (!aktuellesFahrzeug || !aktuellerMotor || !aktuelleFarbe || !aktuelleFelgen) {
      showToast("Bitte schließen Sie alle Schritte ab", "error", {
        description: `Fehlende Auswahl: ${
          !aktuellesFahrzeug ? "Fahrzeug" : ""
        } ${!aktuellerMotor ? "Motor" : ""} ${!aktuelleFarbe ? "Farbe" : ""} ${
          !aktuelleFelgen ? "Felgen" : ""
        }`.trim(),
      });
      return;
    }
  
    try {
      const response = await fetch("/api/konfigurator/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fahrzeugId: aktuellesFahrzeug?.id,
          motorId: aktuellerMotor?.id,
          farbeId: aktuelleFarbe?.id,
          felgenId: aktuelleFelgen?.id,
          ausstattungIds: aktuelleAusstattungen.map((a) => a.id),
          gesamtpreis: berechneGesamtpreis(),
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Speichern");
      }
  
      showToast("Konfiguration gespeichert!", "success");
      resetKonfiguration();
      router.push("/verwaltung");
    } catch (error) {
      showToast("Fehler beim Speichern der Konfiguration", "error", {
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
  };

  const resetKonfiguration = () => {
    setAktuellesFahrzeug(null);
    setAktuellerMotor(null);
    setAktuelleFarbe(null);
    setAktuelleFelgen(null);
    setAktuelleAusstattungen([]);
  };

  const validateStep = (step: string) => {
    if (isEditing) return true;
    switch (step) {
      case "fahrzeug":
        return true;
      case "motor":
        return !!aktuellesFahrzeug;
      case "farbe":
        return !!(aktuellesFahrzeug && aktuellerMotor);
      case "felgen":
        return !!(aktuellesFahrzeug && aktuellerMotor && aktuelleFarbe);
      case "ausstattung":
      case "zusammenfassung":
        return !!(aktuellesFahrzeug && aktuellerMotor && aktuelleFarbe && aktuelleFelgen);
      default:
        return false;
    }
  };

  const removeFarbe = (id: string) => {
    setFarben((prev) => prev.filter((f) => f.id !== id));
    if (aktuelleFarbe?.id === id) {
      setAktuelleFarbe(null);
    }
  };

  const removeFelge = (id: string) => {
    setFelgen((prev) => prev.filter((f) => f.id !== id));
    if (aktuelleFelgen?.id === id) {
      setAktuelleFelgen(null);
    }
  };

  const value = {
    fahrzeuge,
    motoren,
    farben,
    setFarben,
    felgen,
    setFelgen,
    ausstattungen,
    kategorien,
    aktuellesFahrzeug,
    aktuellerMotor,
    aktuelleFarbe,
    aktuelleFelgen,
    aktuelleAusstattungen,
    isLoading,
    setFahrzeug: handleSetFahrzeug,
    setMotor: handleSetMotor,
    setFarbe: handleSetFarbe,
    setFelgen: handleSetFelgen,
    toggleAusstattung,
    berechneGesamtpreis,
    speichereKonfiguration,
    resetKonfiguration,
    validateStep,
    isEditing,
    toggleEditing,
    removeFarbe,
    removeFelge,
    showToast,
    dismissToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};