"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, User, Shield, Ship, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  type: "user" | "admin";
  onAuthenticate: () => void;
  onCancel?: () => void;
}

// Demo credentials
const CREDENTIALS = {
  user: { username: "user", password: "user123" },
  admin: { username: "admin", password: "admin123" },
};

export function AuthModal({ type, onAuthenticate, onCancel }: AuthModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate authentication delay
    setTimeout(() => {
      const creds = CREDENTIALS[type];
      if (username === creds.username && password === creds.password) {
        onAuthenticate();
      } else {
        setError("Geçersiz kullanıcı adı veya şifre");
      }
      setIsLoading(false);
    }, 500);
  };

  const isAdmin = type === "admin";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />

      {/* Auth Card */}
      <Card className="relative z-10 w-full max-w-md mx-4 shadow-2xl border-2">
        {onCancel && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2" 
            onClick={onCancel}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <CardHeader className="text-center pb-2 pt-6">
          <div
            className={cn(
              "mx-auto mb-4 p-4 rounded-full",
              isAdmin ? "bg-destructive/10" : "bg-primary/10"
            )}
          >
            {isAdmin ? (
              <Shield className="h-8 w-8 text-destructive" />
            ) : (
              <Ship className="h-8 w-8 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isAdmin ? "Admin Girişi" : "Kullanıcı Girişi"}
          </CardTitle>
          <CardDescription>
            {isAdmin
              ? "Admin paneline erişim için yetkilendirme gerekli"
              : "Veri giriş sistemine erişim için giriş yapın"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Kullanıcı adınızı girin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Şifrenizi girin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              variant={isAdmin ? "destructive" : "default"}
            >
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>

            <div className="mt-4 p-3 rounded-lg bg-muted text-xs text-muted-foreground">
              <p className="font-medium mb-1">Demo Bilgileri:</p>
              <p>
                Kullanıcı: <code className="bg-background px-1 rounded">{CREDENTIALS[type].username}</code>
              </p>
              <p>
                Şifre: <code className="bg-background px-1 rounded">{CREDENTIALS[type].password}</code>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
