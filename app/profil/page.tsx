import { ProfileForm } from "@/components/profile-form";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Layout from "@/components/Layout";

export const metadata: Metadata = {
  title: "Mein Profil | Fahrzeugkonfigurator",
  description: "Verwalten Sie Ihre persönlichen Daten",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">
              Mein Profil
            </h1>
            <p className="text-muted-foreground">
              Verwalten Sie Ihre persönlichen Daten und Einstellungen.
            </p>
          </div>
          <ProfileForm user={user} />
        </div>
      </div>
    </Layout>
  );
}