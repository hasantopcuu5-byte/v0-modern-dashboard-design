"use client"

import { ArrowUpRight, ArrowDownRight, Activity, Users, Zap, Database } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Toplam İstek",
    value: "2.4M",
    change: "+12.5%",
    trend: "up",
    icon: Activity,
    color: "text-chart-1",
  },
  {
    title: "Aktif Kullanıcılar",
    value: "18.2K",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "text-chart-2",
  },
  {
    title: "Fonksiyon Çağrıları",
    value: "842K",
    change: "-2.4%",
    trend: "down",
    icon: Zap,
    color: "text-chart-3",
  },
  {
    title: "Veritabanı Sorguları",
    value: "1.2M",
    change: "+15.3%",
    trend: "up",
    icon: Database,
    color: "text-chart-1",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="mt-2 text-3xl font-bold text-card-foreground">
                {stat.value}
              </p>
            </div>
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg bg-secondary",
                stat.color
              )}
            >
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1">
            {stat.trend === "up" ? (
              <ArrowUpRight className="h-4 w-4 text-chart-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-chart-4" />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                stat.trend === "up" ? "text-chart-1" : "text-chart-4"
              )}
            >
              {stat.change}
            </span>
            <span className="text-sm text-muted-foreground">geçen haftaya göre</span>
          </div>
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      ))}
    </div>
  )
}
