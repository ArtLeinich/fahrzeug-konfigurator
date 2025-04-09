"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToastContext } from "@/context/ToastContext"; // Замена sonnerToast

const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "Der Vorname muss mindestens 2 Zeichen lang sein.",
  }),
  lastName: z.string().min(2, {
    message: "Der Nachname muss mindestens 2 Zeichen lang sein.",
  }),
  email: z.string().email({
    message: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  }),
});

const addressFormSchema = z.object({
  street: z.string().min(2, {
    message: "Bitte geben Sie eine gültige Straße ein.",
  }),
  houseNumber: z.string().min(1, {
    message: "Bitte geben Sie eine gültige Hausnummer ein.",
  }),
  postalCode: z.string().min(5, {
    message: "Bitte geben Sie eine gültige Postleitzahl ein.",
  }),
  city: z.string().min(2, {
    message: "Bitte geben Sie eine gültige Stadt ein.",
  }),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, {
    message: "Bitte geben Sie Ihr aktuelles Passwort ein.",
  }),
  newPassword: z.string().min(8, {
    message: "Das neue Passwort muss mindestens 8 Zeichen lang sein.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Bitte bestätigen Sie Ihr neues Passwort.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Die Passwörter stimmen nicht überein.",
  path: ["confirmPassword"],
});

interface ProfileFormProps {
  user: {
    id: string;
    firstName: string | null; // Обновлено с name на firstName
    lastName: string | null;  // Добавлено lastName
    email: string;
    street: string | null;
    houseNumber: string | null;
    postalCode: string | null;
    city: string | null;
    createdAt: Date;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { showToast } = useToastContext(); // Используем общую систему уведомлений
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
    },
  });

  const addressForm = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      street: user.street || "",
      houseNumber: user.houseNumber || "",
      postalCode: user.postalCode || "",
      city: user.city || "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsProfileLoading(true);

    try {
      const response = await fetch("/api/profil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Fehler beim Aktualisieren des Profils");
      }

      showToast("Profil aktualisiert", "success", {
        description: "Ihre Profildaten wurden erfolgreich aktualisiert.",
      });
    } catch (error) {
      showToast("Fehler", "error", {
        description: error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten",
      });
    } finally {
      setIsProfileLoading(false);
    }
  }

  async function onAddressSubmit(values: z.infer<typeof addressFormSchema>) {
    setIsAddressLoading(true);

    try {
      const response = await fetch("/api/profil/address", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Fehler beim Aktualisieren der Adresse");
      }

      showToast("Adresse aktualisiert", "success", {
        description: "Ihre Adressdaten wurden erfolgreich aktualisiert.",
      });
    } catch (error) {
      showToast("Fehler", "error", {
        description: error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten",
      });
    } finally {
      setIsAddressLoading(false);
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    setIsPasswordLoading(true);

    try {
      const response = await fetch("/api/profil/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Fehler beim Ändern des Passworts");
      }

      showToast("Passwort geändert", "success", {
        description: "Ihr Passwort wurde erfolgreich geändert.",
      });

      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      showToast("Fehler", "error", {
        description: error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-muted rounded-md p-1">
        <TabsTrigger
          value="profile"
          className="data-[state=active]:bg-card data-[state=active]:text-primary rounded-md transition-colors"
        >
          Profil
        </TabsTrigger>
        <TabsTrigger
          value="address"
          className="data-[state=active]:bg-card data-[state=active]:text-primary rounded-md transition-colors"
        >
          Adresse
        </TabsTrigger>
        <TabsTrigger
          value="password"
          className="data-[state=active]:bg-card data-[state=active]:text-primary rounded-md transition-colors"
        >
          Passwort
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-6">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-display font-semibold text-foreground">
              Profil
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Verwalten Sie Ihre persönlichen Daten.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Vorname</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-input border-border text-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Nachname</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-input border-border text-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">E-Mail</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-input border-border text-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isProfileLoading}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  {isProfileLoading ? "Wird gespeichert..." : "Speichern"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="address" className="mt-6">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-display font-semibold text-foreground">
              Adresse
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Verwalten Sie Ihre Adressdaten.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...addressForm}>
              <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addressForm.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Straße</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-input border-border text-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="houseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Hausnummer</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-input border-border text-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addressForm.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">PLZ</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-input border-border text-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Stadt</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-input border-border text-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isAddressLoading}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  {isAddressLoading ? "Wird gespeichert..." : "Speichern"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="password" className="mt-6">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-display font-semibold text-foreground">
              Passwort ändern
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Ändern Sie Ihr Passwort.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Aktuelles Passwort</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="bg-input border-border text-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Neues Passwort</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="bg-input border-border text-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Passwort bestätigen</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="bg-input border-border text-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isPasswordLoading}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  {isPasswordLoading ? "Wird gespeichert..." : "Passwort ändern"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}