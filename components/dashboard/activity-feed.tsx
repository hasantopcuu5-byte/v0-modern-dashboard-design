"use client"

import { CheckCircle, AlertCircle, Info, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const activities = [
  {
    type: "success",
    title: "Deployment başarılı",
    description: "production ortamına deploy edildi",
    time: "2 dk önce",
    icon: CheckCircle,
  },
  {
    type: "error",
    title: "Fonksiyon hatası",
    description: "/api/users endpoint&apos;inde timeout",
    time: "15 dk önce",
    icon: AlertCircle,
  },
  {
    type: "info",
    title: "Yeni kullanıcı",
    description: "kullanici@example.com kayıt oldu",
    time: "32 dk önce",
    icon: Info,
  },
  {
    type: "success",
    title: "Cache temizlendi",
    description: "Global cache yenilendi",
    time: "1 saat önce",
    icon: CheckCircle,
  },
  {
    type: "pending",
    title: "Build devam ediyor",
    description: "feature/new-dashboard branch&apos;i",
    time: "1 saat önce",
    icon: Clock,
  },
]

const typeStyles = {
  success: "text-chart-1 bg-chart-1/10",
  error: "text-chart-4 bg-chart-4/10",
  info: "text-chart-2 bg-chart-2/10",
  pending: "text-chart-3 bg-chart-3/10",
}

export function ActivityFeed() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">
          Son Aktiviteler
        </h3>
        <button className="text-sm text-primary hover:underline">
          Tümünü Gör
        </button>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-secondary/50"
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                typeStyles[activity.type as keyof typeof typeStyles]
              )}
            >
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-card-foreground">
                {activity.title}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {activity.description}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
