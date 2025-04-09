"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { useAppContext } from "@/context/AppContext";
import KonfigurationsUebersicht from "@/components/KonfigurationsUebersicht";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ChevronRight } from "lucide-react";
import KonfiguratorTabs from "@/components/konfigurator/KonfiguratorTabs";
import FahrzeugTab from "@/components/konfigurator/FahrzeugTab";
import MotorTab from "@/components/konfigurator/MotorTab";
import FarbeTab from "@/components/konfigurator/FarbeTab";
import FelgenTab from "@/components/konfigurator/FelgenTab";
import AusstattungTab from "@/components/konfigurator/AusstattungTab";
import ZusammenfassungTab from "@/components/konfigurator/ZusammenfassungTab";
import NavigationButtons from "@/components/konfigurator/NavigationButtons";

export default function KonfiguratorWithId() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    fahrzeuge,
    aktuellesFahrzeug,
    aktuellerMotor,
    aktuelleFarbe,
    aktuelleFelgen,
    setFahrzeug,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState("fahrzeug");

  useEffect(() => {
    if (id && fahrzeuge.length > 0 && !aktuellesFahrzeug) {
      const selectedFahrzeug = fahrzeuge.find((f) => f.id === id);
      if (selectedFahrzeug) {
        setFahrzeug(id);
        setActiveTab("motor");
      }
    }
  }, [id, fahrzeuge, setFahrzeug, aktuellesFahrzeug]);

  const isTabEnabled = (tab: string) => {
    switch (tab) {
      case "fahrzeug":
        return true;
      case "motor":
        return !!aktuellesFahrzeug;
      case "farbe":
        return !!aktuellesFahrzeug && !!aktuellerMotor;
      case "felgen":
        return !!aktuellesFahrzeug && !!aktuellerMotor && !!aktuelleFarbe;
      case "ausstattung":
        return !!aktuellesFahrzeug && !!aktuellerMotor && !!aktuelleFarbe && !!aktuelleFelgen;
      case "zusammenfassung":
        return !!aktuellesFahrzeug && !!aktuellerMotor && !!aktuelleFarbe && !!aktuelleFelgen;
      default:
        return false;
    }
  };

  const handleTabChange = (value: string) => {
    if (isTabEnabled(value)) {
      setActiveTab(value);
    }
  };

  const handleNextTab = () => {
    const nextTabs = {
      fahrzeug: "motor",
      motor: "farbe",
      farbe: "felgen",
      felgen: "ausstattung",
      ausstattung: "zusammenfassung",
    };
    if (isTabEnabled(nextTabs[activeTab as keyof typeof nextTabs])) {
      setActiveTab(nextTabs[activeTab as keyof typeof nextTabs]);
    }
  };

  const handlePreviousTab = () => {
    const prevTabs = {
      zusammenfassung: "ausstattung",
      ausstattung: "felgen",
      felgen: "farbe",
      farbe: "motor",
      motor: "fahrzeug",
    };
    if (activeTab !== "fahrzeug") {
      setActiveTab(prevTabs[activeTab as keyof typeof prevTabs]);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Fahrzeug-Konfigurator</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <KonfiguratorTabs activeTab={activeTab} onTabChange={handleTabChange} isTabEnabled={isTabEnabled} />
              <TabsContent value="fahrzeug" className="space-y-6">
                <FahrzeugTab onNext={handleNextTab} />
                <NavigationButtons
                  showPrevious={false}
                  showNext={true}
                  onNext={handleNextTab}
                  nextDisabled={!aktuellesFahrzeug}
                  onPrevious={() => {}}
                />
              </TabsContent>
              <TabsContent value="motor" className="space-y-6">
                <MotorTab />
                <NavigationButtons
                  showPrevious={true}
                  showNext={true}
                  onPrevious={handlePreviousTab}
                  onNext={handleNextTab}
                  nextDisabled={!aktuellerMotor}
                />
              </TabsContent>
              <TabsContent value="farbe" className="space-y-6">
                <FarbeTab />
                <NavigationButtons
                  showPrevious={true}
                  showNext={true}
                  onPrevious={handlePreviousTab}
                  onNext={handleNextTab}
                  nextDisabled={!aktuelleFarbe}
                />
              </TabsContent>
              <TabsContent value="felgen" className="space-y-6">
                <FelgenTab />
                <NavigationButtons
                  showPrevious={true}
                  showNext={true}
                  onPrevious={handlePreviousTab}
                  onNext={handleNextTab}
                  nextDisabled={!aktuelleFelgen}
                />
              </TabsContent>
              <TabsContent value="ausstattung" className="space-y-6">
                <AusstattungTab />
                <NavigationButtons
                  showPrevious={true}
                  showNext={true}
                  onPrevious={handlePreviousTab}
                  onNext={handleNextTab}
                  nextText="Weiter zur Zusammenfassung"
                />
              </TabsContent>
              <TabsContent value="zusammenfassung" className="space-y-6">
                <ZusammenfassungTab onPrevious={handlePreviousTab} />
              </TabsContent>
            </Tabs>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Ihre Konfiguration</h2>
              <KonfigurationsUebersicht />
              {activeTab !== "zusammenfassung" && isTabEnabled("zusammenfassung") && (
                <div className="mt-6 text-right">
                  <Button
                    onClick={() => setActiveTab("zusammenfassung")}
                    variant="outline"
                    className="flex items-center ml-auto"
                  >
                    Zur Zusammenfassung
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}