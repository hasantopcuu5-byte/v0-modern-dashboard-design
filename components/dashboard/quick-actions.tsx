"use client"

import { Rocket, RefreshCw, Download, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const actions = [
  {
    icon: Rocket,
    label: "Deploy",
    description: "Production&apos;a deploy et",
    color: "bg-chart-1/10 text-chart-1 hover:bg-chart-1/20",
  },
  {
    icon: RefreshCw,
    label: "Cache Temizle",
    description: "Global cache&apos;i yenile",
    color: "bg-chart-2/10 text-chart-2 hover:bg-chart-2/20",
  },
  {
    icon: Download,
    label: "Rapor İndir",
    description: "CSV olarak dışa aktar",
    color: "bg-chart-3/10 text-chart-3 hover:bg-chart-3/20",
  },
  {
    icon: Settings2,
    label: "Ayarlar",
    description: "Proje ayarlarını düzenle",
    color: "bg-chart-5/10 text-chart-5 hover:bg-chart-5/20",
  },
]

export function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold text-card-foreground">
        Hızlı İşlemler
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`h-auto flex-col items-start gap-1 p-4 ${action.color} border border-transparent hover:border-border`}
          >
            <div className="flex w-full items-center gap-2">
              <action.icon className="h-4 w-4" />
              <span className="font-medium">{action.label}</span>
            </div>
            <span className="text-xs opacity-70">{action.description}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
