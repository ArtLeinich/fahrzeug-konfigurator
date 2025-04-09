"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import { Check, Save, X, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToastContext } from "@/context/ToastContext";

interface FahrzeugTabProps {
  onNext: () => void;
}

interface FahrzeugKategorie {
  id: string;
  name: string;
}

const FahrzeugTab: React.FC<FahrzeugTabProps> = ({ onNext }) => {
  const { fahrzeuge, aktuellesFahrzeug, setFahrzeug, isEditing } = useAppContext();
  const { showToast } = useToastContext();
  const [editedFahrzeuge, setEditedFahrzeuge] = useState(fahrzeuge);
  const [editingData, setEditingData] = useState<
    Record<
      string,
      {
        marke?: string;
        modell?: string;
        basisPreis?: number;
        beschreibung?: string;
        baujahr?: number;
        verfuegbar?: boolean;
        kategorieId?: string;
        file?: File;
      }
    >
  >({});
  const [kategorien, setKategorien] = useState<FahrzeugKategorie[]>([]);

  const [newFahrzeugData, setNewFahrzeugData] = useState({
    marke: "Neue Marke",
    modell: "Neues Modell",
    basisPreis: 0,
    bildUrl: "/placeholder.svg",
    beschreibung: "Neue Beschreibung",
    verfuegbar: true,
    kategorieId: "",
    baujahr: 2023,
  });

  useEffect(() => {
    const fetchKategorien = async () => {
      try {
        const response = await fetch("/api/admin/fahrzeugkategorien");
        if (response.ok) {
          const data = await response.json();
          setKategorien(data);
          if (data.length > 0 && !newFahrzeugData.kategorieId) {
            setNewFahrzeugData((prev) => ({
              ...prev,
              kategorieId: data[0].id,
            }));
          }
        } else {
          showToast("Fehler beim Laden der Fahrzeugkategorien", "error");
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Fahrzeugkategorien:", error);
        showToast("Fehler beim Laden der Fahrzeugkategorien", "error");
      }
    };

    if (isEditing) {
      fetchKategorien();
    }
  }, [isEditing, showToast]);

  const handleInputChange = (
    id: string,
    field: string,
    value: string | number | boolean | File
  ) => {
    setEditingData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
        ...(field !== "file" && { file: prev[id]?.file }),
      },
    }));
  };

  const handleNewFahrzeugChange = (field: string, value: string | number) => {
    setNewFahrzeugData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (id: string) => {
    const data = editingData[id];
    if (!data || Object.keys(data).length === 0) {
      showToast("Keine Änderungen zum Speichern", "info");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    if (data.marke) formData.append("marke", data.marke);
    if (data.modell) formData.append("modell", data.modell);
    if (data.basisPreis !== undefined && !isNaN(data.basisPreis)) {
      formData.append("basisPreis", data.basisPreis.toString());
    }
    if (data.beschreibung) formData.append("beschreibung", data.beschreibung);
    if (data.baujahr !== undefined) formData.append("baujahr", data.baujahr.toString());
    if (data.verfuegbar !== undefined) formData.append("verfuegbar", data.verfuegbar.toString());
    if (data.kategorieId) formData.append("kategorieId", data.kategorieId);
    if (data.file) formData.append("bildUrl", data.file);

    try {
      const response = await fetch(`/api/admin/fahrzeuge/update`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        const updatedFahrzeug = await response.json();
        setEditedFahrzeuge((prev) =>
          prev.map((f) => (f.id === id ? updatedFahrzeug : f))
        );
        setEditingData((prev) => {
          const newData = { ...prev };
          delete newData[id];
          return newData;
        });
        showToast("Fahrzeug erfolgreich gespeichert", "success");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || `Fehler beim Speichern (Status: ${response.status})`);
      }
    } catch (error) {
      console.error("Speicherfehler:", error);
      showToast("Fehler beim Speichern des Fahrzeugs", "error", {
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
  };

  const handleCancel = (id: string) => {
    setEditingData((prev) => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });
  };

  const handleAddFahrzeug = async () => {
    try {
      const response = await fetch("/api/admin/fahrzeuge/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFahrzeugData),
      });
      if (response.ok) {
        const createdFahrzeug = await response.json();
        setEditedFahrzeuge((prev) => [...prev, createdFahrzeug]);
        showToast("Neues Fahrzeug hinzugefügt", "success");
        setNewFahrzeugData({
          marke: "Neue Marke",
          modell: "Neues Modell",
          basisPreis: 0,
          bildUrl: "/placeholder.svg",
          beschreibung: "Neue Beschreibung",
          verfuegbar: true,
          kategorieId: kategorien[0]?.id || "",
          baujahr: 2023,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Hinzufügen");
      }
    } catch (error) {
      console.error("Fehler beim Hinzufügen:", error);
      showToast("Fehler beim Hinzufügen des Fahrzeugs", "error", {
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
  };

  const handleDeleteFahrzeug = async (id: string) => {
    if (!confirm("Möchten Sie dieses Fahrzeug wirklich löschen?")) return;

    try {
      const response = await fetch("/api/admin/fahrzeuge/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setEditedFahrzeuge((prev) => prev.filter((f) => f.id !== id));
        showToast("Fahrzeug erfolgreich gelöscht", "success");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Löschen");
      }
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      showToast("Fehler beim Löschen des Fahrzeugs", "error", {
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
  };

  const handleFahrzeugSelect = (id: string) => {
    setFahrzeug(id);
    if (!isEditing) {
      onNext(); 
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Wählen Sie Ihr Fahrzeug</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {editedFahrzeuge.map((fahrzeug) => (
          <Card
            key={fahrzeug.id}
            className={`transition-colors ${
              aktuellesFahrzeug?.id === fahrzeug.id ? "border-primary" : ""
            } ${!isEditing ? "cursor-pointer hover:border-primary" : ""}`}
            onClick={() => !isEditing && handleFahrzeugSelect(fahrzeug.id)}
          >
            <CardContent className="p-0">
              <div className="relative h-48 overflow-hidden bg-muted rounded-t-lg">
                <img
                  src={
                    editingData[fahrzeug.id]?.file
                      ? URL.createObjectURL(editingData[fahrzeug.id].file)
                      : fahrzeug.bildUrl
                  }
                  alt={`${fahrzeug.marke} ${fahrzeug.modell}`}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <div className="absolute bottom-2 left-2">
                    <Label htmlFor={`file-${fahrzeug.id}`} className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>Bild ändern</span>
                      </Button>
                    </Label>
                    <input
                      id={`file-${fahrzeug.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleInputChange(fahrzeug.id, "file", e.target.files?.[0]!)
                      }
                    />
                  </div>
                )}
                {!fahrzeug.verfuegbar && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      Nicht verfügbar
                    </span>
                  </div>
                )}
                {aktuellesFahrzeug?.id === fahrzeug.id && !isEditing && (
                  <div className="absolute top-2 right-2 bg-primary p-1 rounded-full">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div className="p-4">
                {isEditing ? (
                  <>
                    <Input
                      value={editingData[fahrzeug.id]?.modell ?? ""}
                      onChange={(e) =>
                        handleInputChange(fahrzeug.id, "modell", e.target.value)
                      }
                      placeholder={fahrzeug.modell}
                      className="font-semibold text-lg mb-2"
                    />
                    <Input
                      value={editingData[fahrzeug.id]?.marke ?? ""}
                      onChange={(e) =>
                        handleInputChange(fahrzeug.id, "marke", e.target.value)
                      }
                      placeholder={fahrzeug.marke}
                      className="text-sm text-gray-600 mb-2"
                    />
                    <Input
                      value={editingData[fahrzeug.id]?.basisPreis ?? ""}
                      onChange={(e) =>
                        handleInputChange(fahrzeug.id, "basisPreis", parseFloat(e.target.value))
                      }
                      placeholder={fahrzeug.basisPreis.toString()}
                      type="number"
                      className="font-semibold mb-2"
                    />
                    <Input
                      value={editingData[fahrzeug.id]?.beschreibung ?? ""}
                      onChange={(e) =>
                        handleInputChange(fahrzeug.id, "beschreibung", e.target.value)
                      }
                      placeholder={fahrzeug.beschreibung}
                      className="mb-2"
                    />
                    <Input
                      value={editingData[fahrzeug.id]?.baujahr ?? ""}
                      onChange={(e) =>
                        handleInputChange(fahrzeug.id, "baujahr", parseInt(e.target.value))
                      }
                      placeholder={fahrzeug.baujahr.toString()}
                      type="number"
                      className="mb-2"
                    />
                    <div className="flex items-center mb-2">
                      <Checkbox
                        id={`verfuegbar-${fahrzeug.id}`}
                        checked={
                          editingData[fahrzeug.id]?.verfuegbar ?? fahrzeug.verfuegbar
                        }
                        onCheckedChange={(checked) =>
                          handleInputChange(fahrzeug.id, "verfuegbar", checked as boolean)
                        }
                      />
                      <Label htmlFor={`verfuegbar-${fahrzeug.id}`} className="ml-2">
                        Verfügbar
                      </Label>
                    </div>
                    <select
                      value={editingData[fahrzeug.id]?.kategorieId ?? fahrzeug.kategorieId}
                      onChange={(e) =>
                        handleInputChange(fahrzeug.id, "kategorieId", e.target.value)
                      }
                      className="mb-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {kategorien.map((kategorie) => (
                        <option key={kategorie.id} value={kategorie.id}>
                          {kategorie.name}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSave(fahrzeug.id)}>
                        <Save className="h-4 w-4 mr-1" /> Speichern
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel(fahrzeug.id)}
                      >
                        <X className="h-4 w-4 mr-1" /> Abbrechen
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteFahrzeug(fahrzeug.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash className="h-4 w-4 mr-1" /> Löschen
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg">{fahrzeug.modell}</h3>
                    <p className="text-sm text-gray-600">{fahrzeug.marke}</p>
                    <p className="font-semibold mt-2">
                      {fahrzeug.basisPreis.toLocaleString("de-DE")} €
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {isEditing && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Neues Fahrzeug hinzufügen</h3>
          <div className="space-y-2">
            <div>
              <Label htmlFor="new-marke">Marke</Label>
              <Input
                id="new-marke"
                value={newFahrzeugData.marke}
                onChange={(e) => handleNewFahrzeugChange("marke", e.target.value)}
                placeholder="Marke"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-modell">Modell</Label>
              <Input
                id="new-modell"
                value={newFahrzeugData.modell}
                onChange={(e) => handleNewFahrzeugChange("modell", e.target.value)}
                placeholder="Modell"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-basisPreis">Basispreis</Label>
              <Input
                id="new-basisPreis"
                value={newFahrzeugData.basisPreis}
                onChange={(e) => handleNewFahrzeugChange("basisPreis", parseFloat(e.target.value))}
                placeholder="Basispreis"
                type="number"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-beschreibung">Beschreibung</Label>
              <Input
                id="new-beschreibung"
                value={newFahrzeugData.beschreibung}
                onChange={(e) => handleNewFahrzeugChange("beschreibung", e.target.value)}
                placeholder="Beschreibung"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-baujahr">Baujahr</Label>
              <Input
                id="new-baujahr"
                value={newFahrzeugData.baujahr}
                onChange={(e) => handleNewFahrzeugChange("baujahr", parseInt(e.target.value))}
                placeholder="Baujahr"
                type="number"
                className="mt-1"
              />
            </div>
            <div className="flex items-center">
              <Checkbox
                id="new-verfuegbar"
                checked={newFahrzeugData.verfuegbar}
                onCheckedChange={(checked) =>
                  handleNewFahrzeugChange("verfuegbar", checked as boolean)
                }
              />
              <Label htmlFor="new-verfuegbar" className="ml-2">
                Verfügbar
              </Label>
            </div>
            <div>
              <Label htmlFor="new-kategorie">Kategorie</Label>
              <select
                id="new-kategorie"
                value={newFahrzeugData.kategorieId}
                onChange={(e) => handleNewFahrzeugChange("kategorieId", e.target.value)}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {kategorien.length === 0 && (
                  <option value="">Keine Kategorien verfügbar</option>
                )}
                {kategorien.map((kategorie) => (
                  <option key={kategorie.id} value={kategorie.id}>
                    {kategorie.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button onClick={handleAddFahrzeug} className="mt-4">
            Neues Fahrzeug hinzufügen
          </Button>
        </div>
      )}
    </div>
  );
};

export default FahrzeugTab;