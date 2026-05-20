"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShipDataForm } from "./ship-data-form";
import { AdminDashboard } from "./admin-dashboard";
import { AuthModal } from "./auth-modal";
import { ShipFormData, defaultFormData } from "@/lib/ship-data-types";
import { Ship, LayoutDashboard, Anchor, LogOut, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ShipPerformanceApp() {
  const [formData, setFormData] = useState<ShipFormData>(defaultFormData);
  const [activeTab, setActiveTab] = useState("data-entry");
  
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState<"none" | "user" | "admin">("none");

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

  const handleLogout = (type: "user" | "admin") => {
    if (type === "user") {
      setIsUserAuthenticated(false);
    } else {
      setIsAdminAuthenticated(false);
    }
  };

  // 1. İLK GİRİŞ EKRANI (Role Selection)
  if (!isUserAuthenticated && !isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="text-center mb-8">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Anchor className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Ship Performance Manager</h1>
          <p className="text-muted-foreground mt-2">Lütfen giriş yapmak istediğiniz paneli seçin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <Card 
            className="hover:border-primary hover:bg-primary/5 cursor-pointer transition-all" 
            onClick={() => { setLoginPrompt("user"); setActiveTab("data-entry"); }}
          >
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Ship className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Gemi Girişi</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              Gemi personeli için veri giriş paneli
            </CardContent>
          </Card>

          <Card 
            className="hover:border-destructive hover:bg-destructive/5 cursor-pointer transition-all" 
            onClick={() => { setLoginPrompt("admin"); setActiveTab("admin-dashboard"); }}
          >
            <CardHeader className="text-center">
              <div className="mx-auto bg-destructive/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle>Admin Paneli</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              Ofis personeli için analiz ve raporlama
            </CardContent>
          </Card>
        </div>

        {loginPrompt !== "none" && (
          <AuthModal
            type={loginPrompt}
            onAuthenticate={() => {
              if (loginPrompt === "user") setIsUserAuthenticated(true);
              if (loginPrompt === "admin") setIsAdminAuthenticated(true);
              setLoginPrompt("none");
            }}
            onCancel={() => setLoginPrompt("none")}
          />
        )}
      </div>
    );
  }

  // Check if current active tab requires authentication (kullanıcı paneller arası geçerse)
  const needsUserAuth = activeTab === "data-entry" && !isUserAuthenticated;
  const needsAdminAuth = activeTab === "admin-dashboard" && !isAdminAuthenticated;

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

            <div className="flex items-center gap-4">
              <ThemeToggle />

              {/* Logout Button */}
              {((activeTab === "data-entry" && isUserAuthenticated) ||
                (activeTab === "admin-dashboard" && isAdminAuthenticated)) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleLogout(activeTab === "data-entry" ? "user" : "admin")
                  }
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Çıkış</span>
                </Button>
              )}
            </div>
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
          <TabsContent value="data-entry" className="mt-0 relative">
            {needsUserAuth && (
              <AuthModal
                type="user"
                onAuthenticate={() => setIsUserAuthenticated(true)}
              />
            )}
            <div className={needsUserAuth ? "blur-sm pointer-events-none select-none" : ""}>
              <ShipDataForm
                formData={formData}
                onFormChange={setFormData}
                onExport={handleExport}
              />
            </div>
          </TabsContent>
          <TabsContent value="admin-dashboard" className="mt-0 relative">
            {needsAdminAuth && (
              <AuthModal
                type="admin"
                onAuthenticate={() => setIsAdminAuthenticated(true)}
              />
            )}
            <div className={needsAdminAuth ? "blur-sm pointer-events-none select-none" : ""}>
              <AdminDashboard formData={formData} onImport={handleImport} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
