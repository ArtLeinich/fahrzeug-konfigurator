// KonfiguratorTabs.tsx
"use client";

import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { useSession } from "next-auth/react";
import FahrzeugTab from "./FahrzeugTab";
import MotorTab from "./MotorTab";
import FarbeTab from "./FarbeTab";
import FelgenTab from "./FelgenTab";
import AusstattungTab from "./AusstattungTab";
import ZusammenfassungTab from "./ZusammenfassungTab";
import NavigationButtons from "./NavigationButtons";

interface KonfiguratorTabsProps {
  fahrzeugId?: string;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export default function KonfiguratorTabs({ fahrzeugId, activeTab, onTabChange }: KonfiguratorTabsProps) {
  const { isLoading, validateStep, setFahrzeug, isEditing, toggleEditing } = useAppContext();
  const { data: session } = useSession();

  const handleNext = () => {
    const tabsOrder = ["fahrzeug", "motor", "farbe", "felgen", "ausstattung", "zusammenfassung"];
    const currentIndex = tabsOrder.indexOf(activeTab);
    if (currentIndex < tabsOrder.length - 1) {
      const nextTab = tabsOrder[currentIndex + 1];
      if (isEditing || validateStep(nextTab)) {
        onTabChange(nextTab);
      }
    }
  };

  const tabs = [
    { value: "fahrzeug", label: "Fahrzeug", Component: FahrzeugTab },
    { value: "motor", label: "Motor", Component: MotorTab },
    { value: "farbe", label: "Farbe", Component: FarbeTab },
    { value: "felgen", label: "Felgen", Component: FelgenTab },
    { value: "ausstattung", label: "Ausstattung", Component: AusstattungTab },
    { value: "zusammenfassung", label: "Zusammenfassung", Component: ZusammenfassungTab },
  ];

  const handleTabChangeInternal = (value: string) => {
    const tabsOrder = ["fahrzeug", "motor", "farbe", "felgen", "ausstattung", "zusammenfassung"];
    const currentIndex = tabsOrder.indexOf(activeTab);
    const newIndex = tabsOrder.indexOf(value);

    // Rückverfolgung ohne Validierung zulassen validateStep
    if (isEditing || newIndex < currentIndex || validateStep(value)) {
      onTabChange(value);
    }
  };

  useEffect(() => {
    if (fahrzeugId) setFahrzeug(fahrzeugId);
  }, [fahrzeugId, setFahrzeug]);

  if (isLoading) return <div>Lade Konfigurator...</div>;

  const ActiveTabComponent = tabs.find((tab) => tab.value === activeTab)?.Component;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Fahrzeugkonfigurator</h1>
        {session?.user?.role === "ADMIN" && (
          <Button onClick={toggleEditing} className="w-full sm:w-auto">
            {isEditing ? "Bearbeitung beenden" : "Bearbeitung starten"}
          </Button>
        )}
      </div>
      <Tabs value={activeTab} onValueChange={handleTabChangeInternal} className="w-full">
        <TabsList className="w-full overflow-x-auto whitespace-nowrap mb-6 scrollbar-hide">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              disabled={!isEditing && !validateStep(tab.value)}
              className="flex-0"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeTab}>
          {ActiveTabComponent && (
            <>
              {activeTab === "fahrzeug" ? (
                <ActiveTabComponent onNext={handleNext} />
              ) : activeTab === "zusammenfassung" ? (
                <ZusammenfassungTab onTabChange={onTabChange} />
              ) : (
                <ActiveTabComponent />
              )}
              {(isEditing || validateStep(activeTab)) && activeTab !== "zusammenfassung" && (
                <NavigationButtons currentTab={activeTab} setTab={onTabChange} />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}