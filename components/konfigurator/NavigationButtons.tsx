// NavigationButtons.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";

interface NavigationButtonsProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ currentTab, setTab }) => {
  const { validateStep, isEditing, speichereKonfiguration } = useAppContext();
  const tabsOrder = ["fahrzeug", "motor", "farbe", "felgen", "ausstattung", "zusammenfassung"];
  const currentIndex = tabsOrder.indexOf(currentTab);

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevTab = tabsOrder[currentIndex - 1];
      setTab(prevTab);
    }
  };

  const handleNext = () => {
    if (currentIndex < tabsOrder.length - 1) {
      const nextTab = tabsOrder[currentIndex + 1];
      if (isEditing || validateStep(nextTab)) {
        setTab(nextTab);
      }
    }
  };

  const handleSave = () => {
    speichereKonfiguration();
  };

  return (
    <div className="mt-4 flex justify-between flex-wrap gap-2">
      {currentIndex > 0 && (
        <Button onClick={handleBack} variant="outline" className="w-full sm:w-auto">
          Zurück
        </Button>
      )}
      {currentIndex < tabsOrder.length - 1 ? (
        <Button onClick={handleNext} className="w-full sm:w-auto">
          Weiter
        </Button>
      ) : (
        <Button onClick={handleSave} className="w-full sm:w-auto">
          Konfiguration speichern
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;