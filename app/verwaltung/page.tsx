"use client";
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import BestellungsList from "@/components/verwaltung/BestellungsList";
import KonfigurationsList from "@/components/verwaltung/KonfigurationsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Settings } from 'lucide-react';

const Kaufverwaltung: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('konfigurationen');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-display font-semibold">Kaufverwaltung</h1>
            <p className="text-muted-foreground mt-2">
              Verwalten Sie Ihre gespeicherten Konfigurationen und Bestellungen
            </p>
          </div>

          <Tabs
            defaultValue="konfigurationen"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="konfigurationen" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Konfigurationen
              </TabsTrigger>
              <TabsTrigger value="bestellungen" className="flex items-center">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Bestellungen
              </TabsTrigger>
            </TabsList>

            <TabsContent value="konfigurationen" className="mt-6">
              <KonfigurationsList />
            </TabsContent>

            <TabsContent value="bestellungen" className="mt-6">
              <BestellungsList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Kaufverwaltung;
