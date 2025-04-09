"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useAppContext } from "@/context/AppContext";
import FahrzeugCard from "@/components/FahrzeugCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Filter, CarFront } from "lucide-react";

export default function Katalog() {
  const { fahrzeuge, kategorien, setFahrzeug } = useAppContext(); 
  const [searchTerm, setSearchTerm] = useState("");

 
  const handleConfigure = (fahrzeugId: string) => {
    setFahrzeug(fahrzeugId);
  
  };

  const filteredFahrzeuge = fahrzeuge.filter(
    (fahrzeug) =>
      fahrzeug.marke.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fahrzeug.modell.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fahrzeug.beschreibung.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="content-container max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="section-title">Fahrzeugkatalog</h1>
          <p className="text-muted-foreground max-w-2xl">
            Entdecken Sie unsere vielfältige Auswahl an Premium-Fahrzeugen und finden Sie Ihr Traumauto.
            Nutzen Sie die Filteroptionen, um genau das zu finden, wonach Sie suchen.
          </p>
        </div>

        <div className="bg-card rounded-lg p-4 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Suchen Sie nach Marke, Modell oder Eigenschaften..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 bg-background"
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <Button variant="outline" className="whitespace-nowrap">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <Tabs defaultValue="alle" className="mb-8">
          <TabsList className="mb-6 bg-card border p-1 justify-start overflow-x-auto flex-nowrap w-full">
            <TabsTrigger value="alle" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Alle Fahrzeuge
            </TabsTrigger>
            {kategorien.map((kategorie) => (
              <TabsTrigger
                key={kategorie.id}
                value={kategorie.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {kategorie.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="alle">
            {filteredFahrzeuge.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFahrzeuge.map((fahrzeug) => (
                  <FahrzeugCard
                    key={fahrzeug.id}
                    fahrzeug={fahrzeug}
                    onConfigure={handleConfigure} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-lg border">
                <CarFront className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Keine Fahrzeuge gefunden</h3>
                <p className="text-muted-foreground">
                  Keine Fahrzeuge gefunden, die Ihren Suchkriterien entsprechen.
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSearchTerm("")}
                  >
                    Suche zurücksetzen
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {kategorien.map((kategorie) => (
            <TabsContent key={kategorie.id} value={kategorie.id}>
              {kategorie.fahrzeuge
                .filter(
                  (fahrzeug) =>
                    fahrzeug.marke.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    fahrzeug.modell.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    fahrzeug.beschreibung.toLowerCase().includes(searchTerm.toLowerCase())
                ).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {kategorie.fahrzeuge
                    .filter(
                      (fahrzeug) =>
                        fahrzeug.marke.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        fahrzeug.modell.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        fahrzeug.beschreibung.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((fahrzeug) => (
                      <FahrzeugCard
                        key={fahrzeug.id}
                        fahrzeug={fahrzeug}
                        onConfigure={handleConfigure} 
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card rounded-lg border">
                  <CarFront className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Keine Fahrzeuge gefunden</h3>
                  <p className="text-muted-foreground">
                    Keine Fahrzeuge in dieser Kategorie gefunden, die Ihren Suchkriterien entsprechen.
                  </p>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setSearchTerm("")}
                    >
                      Suche zurücksetzen
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
}