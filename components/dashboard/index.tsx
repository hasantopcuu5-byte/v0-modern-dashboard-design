"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RequestsChart, DataTransferChart, PerformanceChart } from "@/components/dashboard/charts"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { QuickActions } from "@/components/dashboard/quick-actions"

export function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 pl-64 transition-all duration-300">
        <Header />
        <main className="p-6">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Genel Bakış</h2>
            <p className="text-muted-foreground">
              Projenizin performans metriklerini ve aktivitelerini görüntüleyin
            </p>
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Charts Row */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <RequestsChart />
            <DataTransferChart />
          </div>

          {/* Bottom Row */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ActivityFeed />
            </div>
            <div className="space-y-6">
              <PerformanceChart />
              <QuickActions />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
