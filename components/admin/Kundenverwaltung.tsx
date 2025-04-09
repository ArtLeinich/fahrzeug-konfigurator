"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertTriangle, Eye, Edit, Trash2, Plus, Save, X } from "lucide-react";
import { useToastContext } from "@/context/ToastContext";

// Interface für Nutzer
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  orderCount: number;
  createdAt: string;
}

// Interface für Konfigurationen
interface Konfiguration {
  id: string;
  fahrzeug: string;
  motor: string;
  farbe: string;
  felgen: string;
  gesamtpreis: number;
  createdAt: string;
  options: Array<{
    name: string;
    value: string; //  (beschreibung)
    preis: number;
    kategorie: string;
  }>;
}
// Interface für Bestellungen
interface Bestellung {
  id: string;
  produkt: string;
  preis: number;
  status: string;
  bestellDatum: string;
}

export default function Kundenverwaltung() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToastContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [addingNewUser, setAddingNewUser] = useState<Partial<User> | null>(
    null
  );
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<{
    konfigurationen: Konfiguration[];
    bestellungen: Bestellung[];
  } | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.push("/");
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/kunden", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Fehler beim Laden der Nutzer");
        }

        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        showToast("Fehler beim Laden der Nutzer", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [session, status, router, showToast]);

  const fetchUserDetails = async (userId: string) => {
    try {
      const [konfigurationenRes, bestellungenRes] = await Promise.all([
        fetch(`/api/admin/kunden/${userId}/konfigurationen`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
        fetch(`/api/admin/kunden/${userId}/bestellungen`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
      ]);

      if (!konfigurationenRes.ok) {
        const errorText = await konfigurationenRes.text();
        console.error(
          "Fehler in der Konfigurationsanfrage:",
          konfigurationenRes.status,
          errorText
        );
        throw new Error(`Fehler beim Laden der Konfigurationen: ${errorText}`);
      }
      if (!bestellungenRes.ok) {
        const errorText = await bestellungenRes.text();
        console.error(
          "Fehler in der Bestellanfrage:",
          bestellungenRes.status,
          errorText
        );
        throw new Error(`Fehler beim Laden der Bestellungen: ${errorText}`);
      }

      const konfigurationen = await konfigurationenRes.json();
      const bestellungen = await bestellungenRes.json();

      console.log("Heruntergeladene Konfigurationen:", konfigurationen);
      console.log("Geladene Bestellungen:", bestellungen);

      setUserDetails({
        konfigurationen: konfigurationen || [],
        bestellungen: bestellungen || [],
      });
    } catch (error) {
      console.error("Fehler in fetchUserDetails:", error);
      showToast("Fehler beim Laden der Nutzerdetails", "error");
      setUserDetails(null);
    }
  };
  const toggleExpandUser = (userId: string) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      setUserDetails(null);
    } else {
      setExpandedUserId(userId);
      fetchUserDetails(userId);
    }
  };

  const filteredUsers = users.filter((user) =>
    [user.firstName, user.lastName, user.email, user.city]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddUser = () => {
    setAddingNewUser({
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      houseNumber: "",
      postalCode: "",
      city: "",
    });
  };

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user });
  };

  const handleDeleteUser = async (id: string) => {
    if (
      window.confirm("Sind Sie sicher, dass Sie diesen Nutzer löschen möchten?")
    ) {
      try {
        const response = await fetch(`/api/admin/kunden/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Fehler beim Löschen des Nutzers");
        }

        setUsers(users.filter((u) => u.id !== id));
        showToast("Nutzer erfolgreich gelöscht", "success");
      } catch (error) {
        showToast("Fehler beim Löschen des Nutzers", "error");
      }
    }
  };

  const handleSaveNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingNewUser) return;

    const userData = {
      firstName: addingNewUser.firstName,
      lastName: addingNewUser.lastName,
      email: addingNewUser.email,
      street: addingNewUser.street,
      houseNumber: addingNewUser.houseNumber,
      postalCode: addingNewUser.postalCode,
      city: addingNewUser.city,
    };

    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.email ||
      !userData.street ||
      !userData.houseNumber ||
      !userData.postalCode ||
      !userData.city
    ) {
      showToast("Bitte füllen Sie alle Felder aus", "error");
      return;
    }

    try {
      const response = await fetch("/api/admin/kunden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Erstellen des Nutzers");
      }

      const newUser = await response.json();
      setUsers([...users, newUser]);
      setAddingNewUser(null);

      showToast(
        <div>
          <p>Nutzer erfolgreich hinzugefügt!</p>
          <p>
            Generierter Passwort: <strong>{newUser.generatedPassword}</strong>
          </p>
          <p>
            Bitte speichern Sie das Passwort, es wird nicht erneut angezeigt.
          </p>
        </div>,
        "success",
        { duration: 10000 }
      );
    } catch (error) {
      showToast("Fehler beim Erstellen des Nutzers", "error");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser.id) return;

    const userData = {
      firstName: editingUser.firstName,
      lastName: editingUser.lastName,
      email: editingUser.email,
      street: editingUser.street,
      houseNumber: editingUser.houseNumber,
      postalCode: editingUser.postalCode,
      city: editingUser.city,
    };

    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.email ||
      !userData.street ||
      !userData.houseNumber ||
      !userData.postalCode ||
      !userData.city
    ) {
      showToast("Bitte füllen Sie alle Felder aus", "error");
      return;
    }

    try {
      const response = await fetch(`/api/admin/kunden/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Aktualisieren des Nutzers");
      }

      const updatedUser = await response.json();
      setUsers(
        users.map((u) =>
          u.id === editingUser.id ? { ...u, ...updatedUser } : u
        )
      );
      setEditingUser(null);
      showToast("Nutzer erfolgreich aktualisiert", "success");
    } catch (error) {
      showToast("Fehler beim Aktualisieren des Nutzers", "error");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFormData: React.Dispatch<React.SetStateAction<Partial<User> | null>>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const formatAddress = (street: string, houseNumber: string) => {
    return `${street} ${houseNumber}`.trim();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-display font-medium">
            Kundenverwaltung
          </h2>
          <div className="flex gap-2">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Suche nach Namen, E-Mail oder Stadt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="default" onClick={handleAddUser}>
              <Plus className="h-4 w-4 mr-2" />
              Neuer Nutzer
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div>Lade Nutzer...</div>
        ) : filteredUsers.length === 0 && !addingNewUser ? (
          <Card className="border-dashed border-2">
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                Keine Nutzer gefunden
              </h3>
              <p className="text-muted-foreground mb-4">
                Es gibt keine Nutzer oder Ihre Suche ergab keine Treffer.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kontakt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Käufe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registriert am
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {addingNewUser && (
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Input
                          name="firstName"
                          value={addingNewUser.firstName || ""}
                          onChange={(e) =>
                            handleInputChange(e, setAddingNewUser)
                          }
                          placeholder="Vorname"
                          required
                          className="w-1/2"
                        />
                        <Input
                          name="lastName"
                          value={addingNewUser.lastName || ""}
                          onChange={(e) =>
                            handleInputChange(e, setAddingNewUser)
                          }
                          placeholder="Nachname"
                          required
                          className="w-1/2"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        name="email"
                        type="email"
                        value={addingNewUser.email || ""}
                        onChange={(e) => handleInputChange(e, setAddingNewUser)}
                        placeholder="E-Mail"
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Input
                          name="street"
                          value={addingNewUser.street || ""}
                          onChange={(e) =>
                            handleInputChange(e, setAddingNewUser)
                          }
                          placeholder="Straße"
                          required
                          className="w-2/3"
                        />
                        <Input
                          name="houseNumber"
                          value={addingNewUser.houseNumber || ""}
                          onChange={(e) =>
                            handleInputChange(e, setAddingNewUser)
                          }
                          placeholder="Hausnummer"
                          required
                          className="w-1/3"
                        />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Input
                          name="postalCode"
                          value={addingNewUser.postalCode || ""}
                          onChange={(e) =>
                            handleInputChange(e, setAddingNewUser)
                          }
                          placeholder="PLZ"
                          required
                          className="w-1/3"
                        />
                        <Input
                          name="city"
                          value={addingNewUser.city || ""}
                          onChange={(e) =>
                            handleInputChange(e, setAddingNewUser)
                          }
                          placeholder="Ort"
                          required
                          className="w-2/3"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className="bg-gray-100 text-gray-800 px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        0
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setAddingNewUser(null)}
                        >
                          <X className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleSaveNewUser}
                        >
                          <Save className="h-4 w-4 text-green-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}

                {filteredUsers.map((user) => (
                  <React.Fragment key={user.id}>
                    {editingUser && editingUser.id === user.id ? (
                      <tr key={user.id} className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Input
                              name="firstName"
                              value={editingUser.firstName || ""}
                              onChange={(e) =>
                                handleInputChange(e, setEditingUser)
                              }
                              placeholder="Vorname"
                              required
                              className="w-1/2"
                            />
                            <Input
                              name="lastName"
                              value={editingUser.lastName || ""}
                              onChange={(e) =>
                                handleInputChange(e, setEditingUser)
                              }
                              placeholder="Nachname"
                              required
                              className="w-1/2"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Input
                            name="email"
                            type="email"
                            value={editingUser.email || ""}
                            onChange={(e) =>
                              handleInputChange(e, setEditingUser)
                            }
                            required
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Input
                              name="street"
                              value={editingUser.street || ""}
                              onChange={(e) =>
                                handleInputChange(e, setEditingUser)
                              }
                              placeholder="Straße"
                              required
                              className="w-2/3"
                            />
                            <Input
                              name="houseNumber"
                              value={editingUser.houseNumber || ""}
                              onChange={(e) =>
                                handleInputChange(e, setEditingUser)
                              }
                              placeholder="Hausnummer"
                              required
                              className="w-1/3"
                            />
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Input
                              name="postalCode"
                              value={editingUser.postalCode || ""}
                              onChange={(e) =>
                                handleInputChange(e, setEditingUser)
                              }
                              placeholder="PLZ"
                              required
                              className="w-1/3"
                            />
                            <Input
                              name="city"
                              value={editingUser.city || ""}
                              onChange={(e) =>
                                handleInputChange(e, setEditingUser)
                              }
                              placeholder="Ort"
                              required
                              className="w-2/3"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            className={`${
                              user.orderCount > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            } px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}
                          >
                            {user.orderCount}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString("de-DE")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingUser(null)}
                            >
                              <X className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleUpdateUser}
                            >
                              <Save className="h-4 w-4 text-green-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                              <span className="text-primary font-medium">
                                {user.firstName.charAt(0) +
                                  user.lastName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {`${user.firstName} ${user.lastName}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatAddress(user.street, user.houseNumber)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.postalCode} {user.city}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            className={`${
                              user.orderCount > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            } px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}
                          >
                            {user.orderCount}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString("de-DE")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleExpandUser(user.id)}
                            >
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4 text-indigo-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                    {expandedUserId === user.id && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4">
                          <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold mb-4">
                              Details zu {user.firstName} {user.lastName}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              <div>
                                <p>
                                  <span className="font-medium">Vorname:</span>{" "}
                                  {user.firstName}
                                </p>
                                <p>
                                  <span className="font-medium">Nachname:</span>{" "}
                                  {user.lastName}
                                </p>
                                <p>
                                  <span className="font-medium">E-Mail:</span>{" "}
                                  {user.email}
                                </p>
                                <p>
                                  <span className="font-medium">Adresse:</span>{" "}
                                  {formatAddress(user.street, user.houseNumber)}
                                  , {user.postalCode} {user.city}
                                </p>
                                <p>
                                  <span className="font-medium">
                                    Registriert am:
                                  </span>{" "}
                                  {new Date(user.createdAt).toLocaleDateString(
                                    "de-DE"
                                  )}
                                </p>
                              </div>
                            </div>

                            <Tabs
                              defaultValue="konfigurationen"
                              className="w-full"
                            >
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="konfigurationen">
                                  Konfigurationen
                                </TabsTrigger>
                                <TabsTrigger value="bestellungen">
                                  Bestellungen
                                </TabsTrigger>
                              </TabsList>
                              <TabsContent value="konfigurationen">
                                {userDetails?.konfigurationen.length ? (
                                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {userDetails.konfigurationen.map(
                                      (konfig) => (
                                        <Card
                                          key={konfig.id}
                                          className="p-4 shadow-md hover:shadow-lg transition-shadow"
                                        >
                                          <CardContent>
                                            <h4 className="text-lg font-semibold mb-2">
                                              Konfiguration #
                                              {konfig.id.slice(0, 8)}
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                              <p>
                                                <strong>Fahrzeug:</strong>{" "}
                                                {konfig.fahrzeug}
                                              </p>
                                              <p>
                                                <strong>Motor:</strong>{" "}
                                                {konfig.motor}
                                              </p>
                                              <p>
                                                <strong>Farbe:</strong>{" "}
                                                {konfig.farbe}
                                              </p>
                                              <p>
                                                <strong>Felgen:</strong>{" "}
                                                {konfig.felgen}
                                              </p>
                                              <p>
                                                <strong>Preis:</strong>{" "}
                                                {konfig.gesamtpreis.toLocaleString(
                                                  "de-DE"
                                                )}{" "}
                                                €
                                              </p>
                                              <p>
                                                <strong>Erstellt am:</strong>{" "}
                                                {new Date(
                                                  konfig.createdAt
                                                ).toLocaleDateString("de-DE")}
                                              </p>
                                              {konfig.options &&
                                                konfig.options.length > 0 && (
                                                  <div className="mt-2">
                                                    <strong>
                                                      Zusätzliche Optionen:
                                                    </strong>
                                                    <ul className="list-disc list-inside mt-1">
                                                      {konfig.options.map(
                                                        (option, index) => (
                                                          <li
                                                            key={index}
                                                            className="text-gray-700"
                                                          >
                                                            <span className="font-medium">
                                                              {option.name}
                                                            </span>{" "}
                                                            ({option.kategorie}
                                                            ): {option.value}
                                                            <span className="text-green-600">
                                                              {" "}
                                                              (+
                                                              {option.preis.toLocaleString(
                                                                "de-DE"
                                                              )}{" "}
                                                              €)
                                                            </span>
                                                          </li>
                                                        )
                                                      )}
                                                    </ul>
                                                  </div>
                                                )}
                                            </div>
                                          </CardContent>
                                        </Card>
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-gray-500 mt-4">
                                    Keine Konfigurationen vorhanden.
                                  </p>
                                )}
                              </TabsContent>
                              <TabsContent value="bestellungen">
                                {userDetails?.bestellungen.length ? (
                                  <div className="mt-4">
                                    <table className="min-w-full divide-y divide-gray-200">
                                      <thead className="bg-gray-50">
                                        <tr>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Produkt
                                          </th>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Preis
                                          </th>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                          </th>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Bestelldatum
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white divide-y divide-gray-200">
                                        {userDetails.bestellungen.map(
                                          (bestellung) => (
                                            <tr key={bestellung.id}>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {bestellung.produkt}
                                              </td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {bestellung.preis.toLocaleString(
                                                  "de-DE"
                                                )}{" "}
                                                €
                                              </td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {bestellung.status}
                                              </td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(
                                                  bestellung.bestellDatum
                                                ).toLocaleDateString("de-DE")}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <p className="text-gray-500 mt-4">
                                    Keine Bestellungen vorhanden.
                                  </p>
                                )}
                              </TabsContent>
                            </Tabs>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
