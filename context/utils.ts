import { Konfiguration } from "@/types/models";

export const initialKonfiguration: Konfiguration = {
  id: "",
  fahrzeugId: "",
  motorId: "",
  farbeId: "",
  felgenId: "",
  ausstattungIds: [],
  gesamtPreis: 0,
  erstelltAm: new Date(),
};

export const validateConfigurationStep = (
  step: string,
  isFahrzeugSelected: boolean,
  isMotorSelected: boolean,
  isFarbeSelected: boolean,
  isFelgenSelected: boolean
): boolean => {
  switch (step) {
    case "fahrzeug":
      return true;
    case "motor":
      return isFahrzeugSelected;
    case "farbe":
      return isFahrzeugSelected && isMotorSelected;
    case "felgen":
      return isFahrzeugSelected && isMotorSelected && isFarbeSelected;
    case "ausstattung":
      return isFahrzeugSelected && isMotorSelected && isFarbeSelected && isFelgenSelected;
    case "zusammenfassung":
      return isFahrzeugSelected && isMotorSelected && isFarbeSelected && isFelgenSelected;
    default:
      return false;
  }
};