"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { useAppContext } from "@/context/AppContext";
import KonfigurationsUebersicht from "@/components/KonfigurationsUebersicht";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import KonfiguratorTabs from "@/components/konfigurator/KonfiguratorTabs";

export default function Konfigurator() {
  const router = useRouter();
  const {
    aktuellesFahrzeug,
    aktuellerMotor,
    aktuelleFarbe,
    aktuelleFelgen,
    validateStep,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState("fahrzeug");

  const isTabEnabled = (tab: string) => {
    return validateStep(tab);
  };

  const handleTabChange = (value: string) => {
    if (isTabEnabled(value)) {
      setActiveTab(value);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Fahrzeug-Konfigurator</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <KonfiguratorTabs
              fahrzeugId={undefined}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
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