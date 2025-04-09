import Layout from "@/components/Layout";
import { RegisterForm } from "@/components/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrieren | Fahrzeugkonfigurator",
  description:
    "Erstellen Sie ein Konto, um Ihre Fahrzeugkonfigurationen zu speichern",
};

export default function RegisterPage() {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Konto erstellen
            </h1>
            <p className="text-sm text-muted-foreground">
              Geben Sie Ihre Daten ein, um ein Konto zu erstellen
            </p>
          </div>
          <RegisterForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <a
              href="/login"
              className="hover:text-brand underline underline-offset-4"
            >
              Bereits ein Konto? Anmelden
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}