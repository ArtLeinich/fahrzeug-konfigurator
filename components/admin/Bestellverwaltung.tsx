// components/Bestellverwaltung.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  Trash,
} from "lucide-react";
import { useToastContext } from "@/context/ToastContext";

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

export default function Bestellverwaltung() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [bestellungen, setBestellungen] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToastContext();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.push("/");
      return;
    }

    const fetchBestellungen = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/bestellungen", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Fehler beim Laden der Bestellungen");
        }

        const data = await response.json();
        setBestellungen(data.bestellungen || []);
      } catch (error) {
        showToast("Fehler beim Laden der Bestellungen", "error", {
          description:
            error instanceof Error ? error.message : "Unbekannter Fehler",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestellungen();
  }, [session, status, router, showToast]);

  const handleStatusUpdate = async (
    id: string,
    newStatus: BestellungStatus
  ) => {
    try {
      const response = await fetch(`/api/bestellungen/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Aktualisieren des Status");
      }

      setBestellungen((prev) =>
        prev.map((bestellung) =>
          bestellung.id === id
            ? { ...bestellung, status: newStatus }
            : bestellung
        )
      );
      showToast(`Status auf "${newStatus}" geändert`, "success");
    } catch (error) {
      showToast("Fehler beim Aktualisieren des Status", "error", {
        description:
          error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
  };

  const handleDeleteBestellung = async (id: string) => {
    if (!confirm("Möchten Sie diese Bestellung wirklich löschen?")) return;

    try {
      const response = await fetch("/api/admin/bestellungen/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Löschen");
      }

      setBestellungen((prev) => prev.filter((b) => b.id !== id));
      showToast("Bestellung erfolgreich gelöscht", "success");
    } catch (error) {
      showToast("Fehler beim Löschen der Bestellung", "error", {
        description:
          error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
  };

  const filteredBestellungen = bestellungen.filter(
    (bestellung) =>
      bestellung.fahrzeugName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      bestellung.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number): string => {
    return `${value.toLocaleString("de-DE")} €`;
  };

  if (isLoading) {
    return <div>Lade Bestellungen...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-display font-medium">
            Bestellverwaltung
          </h2>
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Nach Fahrzeug oder Nutzer suchen..."
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
                Es gibt keine Bestellungen oder Ihre Suche ergab keine Treffer.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBestellungen.map((bestellung) => {
              const status = bestellung.status as BestellungStatus;
              const { icon, color, background } =
                statusConfig[status] || statusConfig["Neu"];

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
                      Bestellt von {bestellung.userName} am{" "}
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
                            ? new Date(
                                bestellung.lieferDatum
                              ).toLocaleDateString("de-DE")
                            : "Wird berechnet"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-end gap-2">
                    {/* Erste Zeile der Schaltflächen: „Neu“, „Bestätigt“, „In Produktion“ */}
                    <div className="grid grid-cols-3 gap-2 w-full justify-end">
                      {Object.keys(statusConfig)
                        .slice(0, 3)
                        .map((newStatus) => (
                          <Button
                            key={newStatus}
                            variant={
                              status === newStatus ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(
                                bestellung.id,
                                newStatus as BestellungStatus
                              )
                            }
                            disabled={status === newStatus}
                            className="w-full sm:w-[200px]"
                          >
                            {newStatus}
                          </Button>
                        ))}
                    </div>
                    {/* Zweite Reihe von Schaltflächen: „Fertig“, „Ausgeliefert“, „Löschen“ */}
                    <div className="grid grid-cols-3 gap-2 w-full justify-end">
                      {Object.keys(statusConfig)
                        .slice(3, 5)
                        .map((newStatus) => (
                          <Button
                            key={newStatus}
                            variant={
                              status === newStatus ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(
                                bestellung.id,
                                newStatus as BestellungStatus
                              )
                            }
                            disabled={status === newStatus}
                            className="w-full sm:w-[200px]"
                          >
                            {newStatus}
                          </Button>
                        ))}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBestellung(bestellung.id)}
                        className="w-full sm:w-[200px] bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash className="h-4 w-4 mr-1" /> Löschen
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
