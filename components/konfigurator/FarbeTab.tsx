"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import { Check, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToastContext } from "@/context/ToastContext";

const FarbeTab: React.FC = () => {
  const { farben, aktuelleFarbe, setFarbe, isEditing, setFarben, isLoading } = useAppContext();
  const { showToast } = useToastContext();
  const [editFarbe, setEditFarbe] = useState<{ id: string; name: string; farbcode: string; typ: string; preis: number } | null>(null);
  const [editedValues, setEditedValues] = useState({ name: "", farbcode: "", typ: "", preis: "" });
  const [newFarbe, setNewFarbe] = useState({ name: "", farbcode: "", typ: "", preis: "" });

  const handleSave = async (farbeId: string) => {
    if (editFarbe) {
      const updatedFarbe = {
        id: editFarbe.id,
        name: editedValues.name,
        farbcode: editedValues.farbcode,
        typ: editedValues.typ,
        preis: parseFloat(editedValues.preis),
      };
      try {
        const response = await fetch(`/api/admin/farben/${editFarbe.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFarbe),
        });
        if (response.ok) {
          setFarben((prev) =>
            prev.map((f) =>
              f.id === editFarbe.id ? { ...f, ...updatedFarbe } : f
            )
          );
          setEditFarbe(null);
          showToast("Farbe aktualisiert!", "success");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Fehler beim Aktualisieren der Farbe");
        }
      } catch (error) {
        showToast("Fehler beim Aktualisieren", "error", {
          description: error instanceof Error ? error.message : "Unbekannter Fehler",
        });
      }
    }
  };

  const handleCancel = () => {
    setEditFarbe(null);
    setEditedValues({ name: "", farbcode: "", typ: "", preis: "" });
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/farben/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setFarben((prev) => prev.filter((f) => f.id !== id));
        if (aktuelleFarbe?.id === id) {
          setFarbe(null);
        }
        showToast("Farbe gelöscht!", "success");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Löschen der Farbe");
      }
    } catch (error) {
      showToast("Fehler beim Löschen", "error", {
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
  };

  const handleAddFarbe = async () => {
    if (newFarbe.name && newFarbe.farbcode && newFarbe.typ && newFarbe.preis) {
      const farbeToAdd = {
        name: newFarbe.name,
        farbcode: newFarbe.farbcode,
        typ: newFarbe.typ,
        preis: parseFloat(newFarbe.preis),
      };
      try {
        const response = await fetch(`/api/admin/farben`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(farbeToAdd),
        });
        if (response.ok) {
          const addedFarbe = await response.json();
          setFarben((prev) => [...prev, addedFarbe]);
          setNewFarbe({ name: "", farbcode: "", typ: "", preis: "" });
          showToast("Neue Farbe hinzugefügt!", "success");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Fehler beim Hinzufügen der Farbe");
        }
      } catch (error) {
        showToast("Fehler beim Hinzufügen", "error", {
          description: error instanceof Error ? error.message : "Unbekannter Fehler",
        });
      }
    }
  };

  if (isLoading) return <div>Lade Farben...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Wählen Sie Ihre Lackierung</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {farben.map((farbe) => (
          <Card
            key={farbe.id}
            className={`cursor-pointer hover:border-primary transition-colors ${
              aktuelleFarbe?.id === farbe.id ? "border-primary" : ""
            }`}
          >
            <CardContent className="p-4">
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    value={editFarbe?.id === farbe.id ? editedValues.name : farbe.name}
                    onChange={(e) =>
                      setEditedValues({
                        ...editedValues,
                        name: e.target.value,
                      })
                    }
                    placeholder="Name"
                  />
                  <Input
                    value={editFarbe?.id === farbe.id ? editedValues.farbcode : farbe.farbcode}
                    onChange={(e) =>
                      setEditedValues({
                        ...editedValues,
                        farbcode: e.target.value,
                      })
                    }
                    placeholder="Farbcode (z.B. #FF0000)"
                  />
                  <Input
                    value={editFarbe?.id === farbe.id ? editedValues.typ : farbe.typ}
                    onChange={(e) =>
                      setEditedValues({
                        ...editedValues,
                        typ: e.target.value,
                      })
                    }
                    placeholder="Typ"
                  />
                  <Input
                    type="number"
                    value={editFarbe?.id === farbe.id ? editedValues.preis : farbe.preis.toString()}
                    onChange={(e) =>
                      setEditedValues({
                        ...editedValues,
                        preis: e.target.value,
                      })
                    }
                    placeholder="Preis (€)"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => handleSave(farbe.id)}>Speichern</Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Abbrechen
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(farbe.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash className="h-4 w-4 mr-1" /> 
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="w-full h-24 rounded-md mb-3"
                    style={{ backgroundColor: farbe.farbcode }}
                    onClick={() => setFarbe(farbe.id)}
                  ></div>
                  <h3 className="font-semibold">{farbe.name}</h3>
                  <p className="text-sm">{farbe.typ}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-semibold">
                      {farbe.preis === 0
                        ? "Serienausstattung"
                        : `+ ${farbe.preis.toLocaleString("de-DE")} €`}
                    </span>
                    {aktuelleFarbe?.id === farbe.id && (
                      <div className="bg-primary text-white p-1 rounded-full">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {isEditing && (
        <div className="mt-6 space-y-4">
          <h3 className="text-xl font-semibold">Neue Farbe hinzufügen</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              value={newFarbe.name}
              onChange={(e) => setNewFarbe({ ...newFarbe, name: e.target.value })}
              placeholder="Name"
            />
            <Input
              value={newFarbe.farbcode}
              onChange={(e) => setNewFarbe({ ...newFarbe, farbcode: e.target.value })}
              placeholder="Farbcode (z.B. #FF0000)"
            />
            <Input
              value={newFarbe.typ}
              onChange={(e) => setNewFarbe({ ...newFarbe, typ: e.target.value })}
              placeholder="Typ"
            />
            <Input
              type="number"
              value={newFarbe.preis}
              onChange={(e) => setNewFarbe({ ...newFarbe, preis: e.target.value })}
              placeholder="Preis (€)"
            />
          </div>
          <Button onClick={handleAddFarbe}>Farbe hinzufügen</Button>
        </div>
      )}
    </div>
  );
};

export default FarbeTab;