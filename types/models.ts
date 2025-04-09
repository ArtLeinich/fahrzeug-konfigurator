
// Modelle für unsere Fahrzeug-Konfigurationen

export interface Fahrzeug {
  id: string;
  marke: string;
  modell: string;
  baujahr: number;
  basisPreis: number;
  bildUrl: string;
  beschreibung: string;
  verfuegbar: boolean;
}

export interface FahrzeugKategorie {
  id: string;
  name: string;
  beschreibung: string;
  fahrzeuge: Fahrzeug[];
}

export interface FahrzeugAusstattung {
  id: string;
  name: string;
  beschreibung: string;
  preis: number;
  kategorie: string; // z.B. "Innenausstattung", "Motor", "Fahrwerk"
  bildUrl?: string;
}

export interface Motor {
  id: string;
  name: string;
  ps: number;
  hubraum: number; // in ccm
  kraftstoff: "Benzin" | "Diesel" | "Elektro" | "Hybrid";
  verbrauch: number; // l/100km oder kWh/100km
  co2Ausstoss: number; // g/km
  preis: number;
}

export interface Farbe {
  id: string;
  name: string;
  farbcode: string; // hex-code
  preis: number;
  typ: "Metallic" | "Uni" | "Perleffekt" | "Matt";
  bildUrl?: string;
}

export interface Felgen {
  id: string;
  name: string;
  groesse: number; // in Zoll
  design: string;
  preis: number;
  bildUrl?: string;
}

export interface Konfiguration {
  id: string;
  fahrzeugId: string;
  motorId: string;
  farbeId: string;
  felgenId: string;
  ausstattungIds: string[];
  gesamtPreis: number;
  erstelltAm: Date;
  kundeId?: string;
}

export interface Kunde {
  id: string;
  name: string;
  vorname: string;
  email: string;
  telefon?: string;
  adresse?: Adresse;
  region: string;
  konfigurationen: Konfiguration[];
}

export interface Adresse {
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  land: string;
}

export interface Bestellung {
  id: string;
  konfigurationId: string;
  kundeId: string;
  status: "Neu" | "Bestätigt" | "In Produktion" | "Fertig" | "Ausgeliefert";
  bestellDatum: Date;
  lieferDatum?: Date;
}

export interface Region {
  id: string;
  name: string;
  beschreibung?: string;
  kunden: Kunde[];
}

export interface Benutzer {
  id: string;
  benutzername: string;
  name: string;
  email: string;
  rolle: "Admin" | "Verkäufer" | "Kunde";
  regionId?: string;
}
