import Layout from "@/components/Layout";
import { LoginForm } from "@/components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anmelden | Fahrzeugkonfigurator",
  description:
    "Melden Sie sich an, um Ihre Fahrzeugkonfigurationen zu verwalten",
};

export default function LoginPage() {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Anmelden</h1>
            <p className="text-sm text-muted-foreground">
              Geben Sie Ihre E-Mail-Adresse und Ihr Passwort ein, um sich
              anzumelden
            </p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <a
              href="/registrieren"
              className="hover:text-brand underline underline-offset-4"
            >
              Noch kein Konto? Registrieren
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
