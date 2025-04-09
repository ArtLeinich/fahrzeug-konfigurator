"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import { Check, Trash, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToastContext } from "@/context/ToastContext";

const FelgenTab: React.FC = () => {
  const {
    felgen,
    aktuelleFelgen,
    setFelgen,
    isEditing,
    setFelgen: setFelgenState,
    isLoading,
  } = useAppContext();
  const { showToast } = useToastContext();
  const [editFelgen, setEditFelgen] = useState<{
    [key: string]: {
      name: string;
      groesse: string;
      design: string;
      preis: string;
      bildUrl: string;
    };
  }>({});
  const [newFelge, setNewFelge] = useState({
    name: "",
    groesse: "",
    design: "",
    preis: "",
    bildUrl: "",
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [editImages, setEditImages] = useState<{ [key: string]: File | null }>(
    {}
  );
  const [previewImages, setPreviewImages] = useState<{
    [key: string]: string | null;
  }>({});

  // Initialisiere editFelgen und previewImages, wenn der Bearbeitungsmodus aktiviert wird
  useEffect(() => {
    if (isEditing) {
      const initialEditFelgen = felgen.reduce(
        (acc, felge) => ({
          ...acc,
          [felge.id]: {
            name: felge.name,
            groesse: felge.groesse.toString(),
            design: felge.design,
            preis: felge.preis.toString(),
            bildUrl: felge.bildUrl || "",
          },
        }),
        {}
      );
      const initialPreviewImages = felgen.reduce(
        (acc, felge) => ({
          ...acc,
          [felge.id]: felge.bildUrl || null,
        }),
        {}
      );
      setEditFelgen(initialEditFelgen);
      setPreviewImages(initialPreviewImages);
    } else {
      setEditFelgen({});
      setEditImages({});
      setPreviewImages({});
    }
  }, [isEditing, felgen]);

  // Funktion zum Bearbeiten der Felgen-Daten
  const handleEditChange = (felgeId: string, field: string, value: string) => {
    setEditFelgen((prev) => ({
      ...prev,
      [felgeId]: {
        ...prev[felgeId],
        [field]: value,
      },
    }));
  };

  // Funktion zum Ändern des Bildes einer Felge
  const handleImageChange = (felgeId: string, file: File | null) => {
    setEditImages((prev) => ({
      ...prev,
      [felgeId]: file,
    }));
    setPreviewImages((prev) => ({
      ...prev,
      [felgeId]: file ? URL.createObjectURL(file) : prev[felgeId],
    }));
  };

  // Speichere die bearbeiteten Felgen-Daten
  const handleSave = async (felgeId: string) => {
    const felgeToUpdate = editFelgen[felgeId];
    if (!felgeToUpdate) {
      showToast("Keine Daten zum Speichern", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", felgeToUpdate.name);
    formData.append("groesse", felgeToUpdate.groesse);
    formData.append("design", felgeToUpdate.design);
    formData.append("preis", felgeToUpdate.preis);
    if (editImages[felgeId]) {
      formData.append("image", editImages[felgeId]!);
    }
    console.log("Sending FormData for update:", Object.fromEntries(formData));

    try {
      const response = await fetch(`/api/admin/felgen/${felgeId}`, {
        method: "PUT",
        body: formData,
      });
      const responseData = await response.json();
      console.log("Response from server:", responseData);

      if (response.ok) {
        setFelgenState((prev) =>
          prev.map((f) => (f.id === felgeId ? { ...f, ...responseData } : f))
        );
        setEditFelgen((prev) => {
          const newEditFelgen = { ...prev };
          delete newEditFelgen[felgeId];
          return newEditFelgen;
        });
        setEditImages((prev) => {
          const newEditImages = { ...prev };
          delete newEditImages[felgeId];
          return newEditImages;
        });
        setPreviewImages((prev) => ({
          ...prev,
          [felgeId]: responseData.bildUrl || null,
        }));
        showToast("Felge aktualisiert!", "success");
        const responseDataReload = await fetch("/api/konfigurator/data");
        const data = await responseDataReload.json();
        setFelgenState(data.felgen);
      } else {
        throw new Error(
          responseData.error || "Fehler beim Aktualisieren der Felge"
        );
      }
    } catch (error) {
      console.error("Error updating felge:", error);
      showToast("Fehler beim Aktualisieren", "error", {
        description:
          error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
  };

  // Breche die Bearbeitung einer Felge ab
  const handleCancel = (felgeId: string) => {
    setEditFelgen((prev) => {
      const newEditFelgen = { ...prev };
      delete newEditFelgen[felgeId];
      return newEditFelgen;
    });
    setEditImages((prev) => {
      const newEditImages = { ...prev };
      delete newEditImages[felgeId];
      return newEditImages;
    });
    setPreviewImages((prev) => {
      const newPreviewImages = { ...prev };
      delete newPreviewImages[felgeId];
      return newPreviewImages;
    });
  };

  // Lösche eine Felge
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/felgen/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const responseData = await response.json();
      console.log("Delete response:", responseData);

      if (response.ok) {
        setFelgenState((prev) => prev.filter((f) => f.id !== id));
        if (aktuelleFelgen?.id === id) {
          setFelgen(null);
        }
        showToast("Felge gelöscht!", "success");
      } else {
        throw new Error(responseData.error || "Fehler beim Löschen der Felge");
      }
    } catch (error) {
      console.error("Error deleting felge:", error);
      showToast("Fehler beim Löschen", "error", {
        description:
          error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
  };

  // Füge eine neue Felge hinzu
  const handleAddFelge = async () => {
    if (
      newFelge.name &&
      newFelge.groesse &&
      newFelge.design &&
      newFelge.preis &&
      newImage
    ) {
      const formData = new FormData();
      formData.append("name", newFelge.name);
      formData.append("groesse", newFelge.groesse);
      formData.append("design", newFelge.design);
      formData.append("preis", newFelge.preis);
      formData.append("image", newImage);

      try {
        const response = await fetch(`/api/admin/felgen`, {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const addedFelge = await response.json();
          setFelgenState((prev) => [...prev, addedFelge]);
          setNewFelge({
            name: "",
            groesse: "",
            design: "",
            preis: "",
            bildUrl: "",
          });
          setNewImage(null);
          showToast("Neue Felge hinzugefügt!", "success");
        } else {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Fehler beim Hinzufügen der Felge"
          );
        }
      } catch (error) {
        console.error("Error adding felge:", error);
        showToast("Fehler beim Hinzufügen", "error", {
          description:
            error instanceof Error ? error.message : "Unbekannter Fehler",
        });
      }
    } else {
      showToast("Bitte füllen Sie alle Felder aus", "error");
    }
  };

  // Wähle eine Felge aus
  const handleSelectFelge = (felge: any) => {
    if (!isEditing) {
      console.log("Selecting felge id:", felge.id);
      setFelgen(felge.id);
      console.log("Updated aktuelleFelgen:", aktuelleFelgen);
    } else {
      console.log("Selection disabled in edit mode");
    }
  };

  if (isLoading) return <div>Lade Felgen...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Wählen Sie Ihre Felgen</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {felgen.map((felge) => (
          <Card
            key={felge.id}
            className={`cursor-pointer hover:border-primary transition-colors ${
              aktuelleFelgen?.id === felge.id ? "border-primary" : ""
            }`}
            onClick={() => handleSelectFelge(felge)}
          >
            <CardContent className="p-4 flex">
              {isEditing ? (
                <div className="space-y-4 w-full">
                  {/* Bildvorschau */}
                  <div className="w-24 h-24">
                    {previewImages[felge.id] ? (
                      <img
                        src={previewImages[felge.id]!}
                        alt={felge.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
                        Kein Bild
                      </div>
                    )}
                  </div>
                  {/* Button "Bild ändern" unter dem Bild */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mb-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      document
                        .getElementById(`image-upload-${felge.id}`)
                        ?.click();
                    }}
                  >
                    <Camera className="h-4 w-4 mr-1" /> Bild ändern
                  </Button>
                  <Input
                    id={`image-upload-${felge.id}`}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      e.stopPropagation();
                      handleImageChange(
                        felge.id,
                        e.target.files ? e.target.files[0] : null
                      );
                    }}
                  />
                  {/* Titel unter dem Button */}
                  <h3 className="font-semibold">{felge.name}</h3>
                  <Input
                    value={editFelgen[felge.id]?.name ?? felge.name}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleEditChange(felge.id, "name", e.target.value);
                    }}
                    placeholder="Name"
                  />
                  <Input
                    type="number"
                    value={
                      editFelgen[felge.id]?.groesse ?? felge.groesse.toString()
                    }
                    onChange={(e) => {
                      e.stopPropagation();
                      handleEditChange(felge.id, "groesse", e.target.value);
                    }}
                    placeholder="Größe (Zoll)"
                  />
                  <Input
                    value={editFelgen[felge.id]?.design ?? felge.design}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleEditChange(felge.id, "design", e.target.value);
                    }}
                    placeholder="Design"
                  />
                  <Input
                    type="number"
                    value={
                      editFelgen[felge.id]?.preis ?? felge.preis.toString()
                    }
                    onChange={(e) => {
                      e.stopPropagation();
                      handleEditChange(felge.id, "preis", e.target.value);
                    }}
                    placeholder="Preis (€)"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(felge.id);
                      }}
                    >
                      Speichern
                    </Button>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel(felge.id);
                      }}
                    >
                      Abbrechen
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(felge.id);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash className="h-4 w-4 mr-1" /> Löschen
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {felge.bildUrl && (
                    <div className="w-24 h-24 mr-4">
                      <img
                        src={felge.bildUrl}
                        alt={felge.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{felge.name}</h3>
                    <div className="mt-1 space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Größe:</span>{" "}
                        {felge.groesse} Zoll
                      </p>
                      <p>
                        <span className="font-medium">Design:</span>{" "}
                        {felge.design}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-semibold">
                        {felge.preis === 0
                          ? "Serienausstattung"
                          : `+ ${felge.preis.toLocaleString("de-DE")} €`}
                      </span>
                      {aktuelleFelgen?.id === felge.id && (
                        <div className="bg-primary text-white p-1 rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {isEditing && (
        <div className="mt-6 space-y-4">
          <h3 className="text-xl font-semibold">Neue Felge hinzufügen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bildvorschau und Datei-Input in einer Spalte */}
            <div className="flex flex-col items-start">
              <div className="w-24 h-24 mb-2">
                {newImage ? (
                  <img
                    src={URL.createObjectURL(newImage)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
                    Kein Bild
                  </div>
                )}
              </div>
              <Input
                type="file"
                className="w-48"
                onChange={(e) =>
                  setNewImage(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>
            {/* Eingabefelder in der zweiten Spalte */}
            <div className="flex flex-col gap-3">
              <Input
                value={newFelge.name}
                onChange={(e) =>
                  setNewFelge({ ...newFelge, name: e.target.value })
                }
                placeholder="Name"
              />
              <Input
                type="number"
                value={newFelge.groesse}
                onChange={(e) =>
                  setNewFelge({ ...newFelge, groesse: e.target.value })
                }
                placeholder="Größe (Zoll)"
              />
              <Input
                value={newFelge.design}
                onChange={(e) =>
                  setNewFelge({ ...newFelge, design: e.target.value })
                }
                placeholder="Design"
              />
              <Input
                type="number"
                value={newFelge.preis}
                onChange={(e) =>
                  setNewFelge({ ...newFelge, preis: e.target.value })
                }
                placeholder="Preis (€)"
              />
            </div>
          </div>
          {/* Button "Felge hinzufügen" unter den Eingabefeldern */}
          <div className="flex justify-start">
            <Button onClick={handleAddFelge}>Felge hinzufügen</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FelgenTab;