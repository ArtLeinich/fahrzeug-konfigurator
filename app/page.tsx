import React from "react";
import Layout from "@/components/Layout";
import ClientIndex from "./ClientIndex"; 
import { AppProvider } from "@/context/AppContext"; 

export default function Home() {
  return (
    <Layout>
      <AppProvider>
        <ClientIndex />
      </AppProvider>
    </Layout>
  );
}