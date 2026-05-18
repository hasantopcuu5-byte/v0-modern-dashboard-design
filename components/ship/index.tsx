"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShipDataForm } from "./ship-data-form";
import { AdminDashboard } from "./admin-dashboard";
import { ShipFormData, defaultFormData } from "@/lib/ship-data-types";
import { Ship, LayoutDashboard, Anchor } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function ShipPerformanceApp() {
  const [formData, setFormData] = useState<ShipFormData>(defaultFormData);
  const [activeTab, setActiveTab] = useState("data-entry");

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ship-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [formData]);

  const handleImport = useCallback((data: ShipFormData) => {
    setFormData(data);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Anchor className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Ship Performance Manager</h1>
                <p className="text-xs text-muted-foreground">
                  Voyage Data & Analytics
                </p>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="hidden md:block"
            >
              <TabsList className="grid grid-cols-2 w-[400px]">
                <TabsTrigger value="data-entry" className="gap-2">
                  <Ship className="h-4 w-4" />
                  Ship Data Entry
                </TabsTrigger>
                <TabsTrigger value="admin-dashboard" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Dashboard
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile Tabs */}
      <div className="md:hidden border-b bg-card">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start rounded-none h-12 p-0 bg-transparent">
            <TabsTrigger
              value="data-entry"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <Ship className="h-4 w-4 mr-2" />
              Data Entry
            </TabsTrigger>
            <TabsTrigger
              value="admin-dashboard"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="data-entry" className="mt-0">
            <ShipDataForm
              formData={formData}
              onFormChange={setFormData}
              onExport={handleExport}
            />
          </TabsContent>
          <TabsContent value="admin-dashboard" className="mt-0">
            <AdminDashboard formData={formData} onImport={handleImport} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
