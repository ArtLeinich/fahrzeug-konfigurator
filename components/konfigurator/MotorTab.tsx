"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import { Check, Save, X, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToastContext } from "@/context/ToastContext";

interface Motor {
  id: string;
  name: string;
  ps: number;
  hubraum: number;
  kraftstoff: string;
  verbrauch: number;
  co2Ausstoss: number;
  preis: number;
}

const MotorTab: React.FC = () => {
  const { motoren, aktuellerMotor, setMotor, isEditing } = useAppContext();
  const { showToast } = useToastContext();
  const [editedMotoren, setEditedMotoren] = useState<Motor[]>(motoren);
  const [editingData, setEditingData] = useState<
    Record<
      string,
      {
        name?: string;
        ps?: number;
        hubraum?: number;
        kraftstoff?: string;
        verbrauch?: number;
        co2Ausstoss?: number;
        preis?: number;
      }
    >
  >({});

  const [newMotorData, setNewMotorData] = useState({
    name: "Neuer Motor",
    ps: 0,
    hubraum: 0,
    kraftstoff: "Benzin",
    verbrauch: 0,
    co2Ausstoss: 0,
    preis: 0,
  });

  // Aktualisiere die Liste der Motoren, wenn sich die Daten im Kontext ändern
  React.useEffect(() => {
    setEditedMotoren(motoren);
  }, [motoren]);

  // Behandle Änderungen an bestehenden Motorfeldern
  const handleInputChange = (id: string, field: string, value: string | number) => {
    setEditingData((prev) => {
      const newValue =
        field === "name" || field === "kraftstoff"
          ? (value as string)
          : value === "" || isNaN(Number(value))
          ? 0
          : Number(value);
      return {
        ...prev,
        [id]: {
          ...prev[id],
          [field]: newValue,
        },
      };
    });
  };

  // Behandle Änderungen an Feldern für einen neuen Motor
  const handleNewMotorChange = (field: string, value: string | number) => {
    setNewMotorData((prev) => {
      if (field === "name" || field === "kraftstoff") {
        return { ...prev, [field]: value as string };
      }
      const numValue = value === "" ? 0 : parseFloat(value as string) || 0;
      return { ...prev, [field]: numValue };
    });
  };

  // Speichere Änderungen an einem bestehenden Motor
  const handleSave = async (id: string) => {
    const data = editingData[id];
    console.log("Zu speichernde Daten für ID", id, ":", data);
    if (!data || Object.keys(data).length === 0) {
      showToast("Keine Änderungen zum Speichern", "info");
      return;
    }

    try {
      const response = await fetch(`/api/admin/motoren/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });
      if (response.ok) {
        const updatedMotor = await response.json();
        setEditedMotoren((prev) =>
          prev.map((m) => (m.id === id ? updatedMotor : m))
        );
        setEditingData((prev) => {
          const newData = { ...prev };
          delete newData[id];
          return newData;
        });
        showToast("Motor erfolgreich gespeichert", "success");
      } else {
        const errorData = await response.json();
        console.error("Fehler vom Server:", errorData);
        throw new Error(errorData.error || "Fehler beim Speichern");
      }
    } catch (error) {
      console.error("Speicherfehler:", error);
      showToast("Fehler beim Speichern des Motors", "error", {
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
  };

  // Breche Änderungen an einem Motor ab
  const handleCancel = (id: string) => {
    setEditingData((prev) => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });
  };

  // Füge einen neuen Motor hinzu
  const handleAddMotor = async () => {
    if (!newMotorData.name || !newMotorData.kraftstoff) {
      showToast("Name und Kraftstoff sind erforderlich", "error");
      return;
    }

    try {
      console.log("Sende Daten:", newMotorData);
      const response = await fetch("/api/admin/motoren/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMotorData),
      });
      if (response.ok) {
        const createdMotor = await response.json();
        setEditedMotoren((prev) => [...prev, createdMotor]);
        showToast("Neuer Motor hinzugefügt", "success");
        setNewMotorData({
          name: "Neuer Motor",
          ps: 0,
          hubraum: 0,
          kraftstoff: "Benzin",
          verbrauch: 0,
          co2Ausstoss: 0,
          preis: 0,
        });
      } else {
        const errorData = await response.json();
        console.error("Fehler vom Server:", errorData);
        throw new Error(errorData.error || "Fehler beim Hinzufügen");
      }
    } catch (error) {
      console.error("Fehler beim Hinzufügen:", error);
      showToast("Fehler beim Hinzufügen des Motors", "error", {
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
  };

  // Lösche einen Motor
  const handleDeleteMotor = async (id: string) => {
    if (!confirm("Möchten Sie diesen Motor wirklich löschen?")) return;

    try {
      const response = await fetch("/api/admin/motoren/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setEditedMotoren((prev) => prev.filter((m) => m.id !== id));
        if (aktuellerMotor?.id === id) setMotor("");
        showToast("Motor erfolgreich gelöscht", "success");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Löschen");
      }
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      showToast("Fehler beim Löschen des Motors", "error", {
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Wählen Sie Ihren Motor</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {editedMotoren.map((motor) => (
          <Card
            key={motor.id}
            className={`transition-colors ${
              aktuellerMotor?.id === motor.id ? "border-primary" : ""
            } ${!isEditing ? "cursor-pointer hover:border-primary" : ""}`}
            onClick={() => !isEditing && setMotor(motor.id)}
          >
            <CardContent className="p-4 relative">
              {isEditing ? (
                <>
                  <Input
                    value={editingData[motor.id]?.name ?? ""}
                    onChange={(e) => handleInputChange(motor.id, "name", e.target.value)}
                    placeholder={motor.name}
                    className="font-semibold text-lg mb-2"
                  />
                  <Input
                    value={editingData[motor.id]?.ps ?? ""}
                    onChange={(e) => handleInputChange(motor.id, "ps", parseInt(e.target.value))}
                    placeholder={`${motor.ps} PS`}
                    type="number"
                    className="mb-2"
                  />
                  <Input
                    value={editingData[motor.id]?.hubraum ?? ""}
                    onChange={(e) =>
                      handleInputChange(motor.id, "hubraum", parseInt(e.target.value))
                    }
                    placeholder={`${motor.hubraum} cm³`}
                    type="number"
                    className="mb-2"
                  />
                  <Input
                    value={editingData[motor.id]?.kraftstoff ?? ""}
                    onChange={(e) => handleInputChange(motor.id, "kraftstoff", e.target.value)}
                    placeholder={motor.kraftstoff}
                    className="mb-2"
                  />
                  <Input
                    value={editingData[motor.id]?.verbrauch ?? ""}
                    onChange={(e) =>
                      handleInputChange(motor.id, "verbrauch", parseFloat(e.target.value))
                    }
                    placeholder={`${motor.verbrauch} l/100km`}
                    type="number"
                    step="0.1"
                    className="mb-2"
                  />
                  <Input
                    value={editingData[motor.id]?.co2Ausstoss ?? ""}
                    onChange={(e) =>
                      handleInputChange(motor.id, "co2Ausstoss", parseFloat(e.target.value))
                    }
                    placeholder={`${motor.co2Ausstoss} g/km`}
                    type="number"
                    step="0.1"
                    className="mb-2"
                  />
                  <Input
                    value={editingData[motor.id]?.preis ?? ""}
                    onChange={(e) =>
                      handleInputChange(motor.id, "preis", parseFloat(e.target.value))
                    }
                    placeholder={`${motor.preis.toLocaleString("de-DE")} €`}
                    type="number"
                    step="0.01"
                    className="mb-2"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSave(motor.id)}>
                      <Save className="h-4 w-4 mr-1" /> Speichern
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancel(motor.id)}
                    >
                      <X className="h-4 w-4 mr-1" /> Abbrechen
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteMotor(motor.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash className="h-4 w-4 mr-1" /> Löschen
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-lg">{motor.name}</h3>
                  <div className="mt-2 space-y-1">
                    <p>
                      <span className="font-medium">Leistung:</span> {motor.ps} PS
                    </p>
                    <p>
                      <span className="font-medium">Hubraum:</span>{" "}
                      {motor.hubraum > 0 ? `${motor.hubraum} ccm` : "Elektro"}
                    </p>
                    <p>
                      <span className="font-medium">Kraftstoff:</span> {motor.kraftstoff}
                    </p>
                    <p>
                      <span className="font-medium">Verbrauch:</span> {motor.verbrauch}{" "}
                      {motor.kraftstoff === "Elektro" ? "kWh/100km" : "l/100km"}
                    </p>
                    <p>
                      <span className="font-medium">CO2-Ausstoß:</span> {motor.co2Ausstoss}{" "}
                      g/km
                    </p>
                  </div>
                  <div className="mt-4">
                    <span className="font-semibold">
                      {motor.preis === 0
                        ? "Serienausstattung"
                        : `+ ${motor.preis.toLocaleString("de-DE")} €`}
                    </span>
                  </div>
                  {aktuellerMotor?.id === motor.id && (
                    <div className="absolute top-2 right-2 bg-primary p-1 rounded-full">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {isEditing && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Neuen Motor hinzufügen</h3>
          <div className="space-y-2">
            <div>
              <Label htmlFor="new-name">Name</Label>
              <Input
                id="new-name"
                value={newMotorData.name}
                onChange={(e) => handleNewMotorChange("name", e.target.value)}
                placeholder="Neuer Motor"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-ps">Leistung (PS)</Label>
              <Input
                id="new-ps"
                value={newMotorData.ps}
                onChange={(e) => handleNewMotorChange("ps", parseInt(e.target.value))}
                placeholder="0"
                type="number"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-hubraum">Hubraum (cm³)</Label>
              <Input
                id="new-hubraum"
                value={newMotorData.hubraum}
                onChange={(e) => handleNewMotorChange("hubraum", parseInt(e.target.value))}
                placeholder="0"
                type="number"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-kraftstoff">Kraftstoff</Label>
              <Input
                id="new-kraftstoff"
                value={newMotorData.kraftstoff}
                onChange={(e) => handleNewMotorChange("kraftstoff", e.target.value)}
                placeholder="Benzin"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-verbrauch">Verbrauch (l/100km)</Label>
              <Input
                id="new-verbrauch"
                value={newMotorData.verbrauch}
                onChange={(e) => handleNewMotorChange("verbrauch", parseFloat(e.target.value))}
                placeholder="0"
                type="number"
                step="0.1"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-co2Ausstoss">CO₂-Ausstoß (g/km)</Label>
              <Input
                id="new-co2Ausstoss"
                value={newMotorData.co2Ausstoss}
                onChange={(e) => handleNewMotorChange("co2Ausstoss", parseFloat(e.target.value))}
                placeholder="0"
                type="number"
                step="0.1"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-preis">Preis (€)</Label>
              <Input
                id="new-preis"
                value={newMotorData.preis}
                onChange={(e) => handleNewMotorChange("preis", parseFloat(e.target.value))}
                placeholder="0"
                type="number"
                step="0.01"
                className="mt-1"
              />
            </div>
            <Button onClick={handleAddMotor} className="mt-4">
              Neuen Motor hinzufügen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MotorTab;