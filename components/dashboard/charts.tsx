"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts"

const requestData = [
  { time: "00:00", requests: 1200, errors: 12 },
  { time: "02:00", requests: 900, errors: 8 },
  { time: "04:00", requests: 600, errors: 5 },
  { time: "06:00", requests: 800, errors: 7 },
  { time: "08:00", requests: 1500, errors: 15 },
  { time: "10:00", requests: 2200, errors: 22 },
  { time: "12:00", requests: 2800, errors: 18 },
  { time: "14:00", requests: 2600, errors: 20 },
  { time: "16:00", requests: 2400, errors: 16 },
  { time: "18:00", requests: 2100, errors: 14 },
  { time: "20:00", requests: 1800, errors: 12 },
  { time: "22:00", requests: 1400, errors: 10 },
]

const transferData = [
  { time: "00:00", outgoing: 120, incoming: 80 },
  { time: "02:00", outgoing: 90, incoming: 60 },
  { time: "04:00", outgoing: 60, incoming: 40 },
  { time: "06:00", outgoing: 80, incoming: 55 },
  { time: "08:00", outgoing: 150, incoming: 100 },
  { time: "10:00", outgoing: 220, incoming: 150 },
  { time: "12:00", outgoing: 280, incoming: 190 },
  { time: "14:00", outgoing: 260, incoming: 180 },
  { time: "16:00", outgoing: 240, incoming: 160 },
  { time: "18:00", outgoing: 210, incoming: 140 },
  { time: "20:00", outgoing: 180, incoming: 120 },
  { time: "22:00", outgoing: 140, incoming: 95 },
]

const performanceData = [
  { name: "P50", value: 45 },
  { name: "P75", value: 78 },
  { name: "P90", value: 120 },
  { name: "P95", value: 180 },
  { name: "P99", value: 350 },
]

export function RequestsChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            İstek Trafiği
          </h3>
          <p className="text-sm text-muted-foreground">Son 24 saat</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-1" />
            <span className="text-sm text-muted-foreground">2XX</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-4" />
            <span className="text-sm text-muted-foreground">Hatalar</span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={requestData}>
            <defs>
              <linearGradient id="requestGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.7 0.15 180)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.7 0.15 180)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.005 260)" />
            <XAxis
              dataKey="time"
              tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
              axisLine={{ stroke: "oklch(0.22 0.005 260)" }}
            />
            <YAxis
              tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
              axisLine={{ stroke: "oklch(0.22 0.005 260)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.13 0.005 260)",
                border: "1px solid oklch(0.22 0.005 260)",
                borderRadius: "8px",
                color: "oklch(0.95 0 0)",
              }}
            />
            <Area
              type="monotone"
              dataKey="requests"
              stroke="oklch(0.7 0.15 180)"
              strokeWidth={2}
              fill="url(#requestGradient)"
            />
            <Line
              type="monotone"
              dataKey="errors"
              stroke="oklch(0.6 0.2 25)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function DataTransferChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            Veri Transferi
          </h3>
          <p className="text-sm text-muted-foreground">GB/saat</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-2" />
            <span className="text-sm text-muted-foreground">Giden</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-3" />
            <span className="text-sm text-muted-foreground">Gelen</span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={transferData}>
            <defs>
              <linearGradient id="outgoingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="incomingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.75 0.15 80)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.75 0.15 80)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.005 260)" />
            <XAxis
              dataKey="time"
              tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
              axisLine={{ stroke: "oklch(0.22 0.005 260)" }}
            />
            <YAxis
              tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
              axisLine={{ stroke: "oklch(0.22 0.005 260)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.13 0.005 260)",
                border: "1px solid oklch(0.22 0.005 260)",
                borderRadius: "8px",
                color: "oklch(0.95 0 0)",
              }}
            />
            <Area
              type="monotone"
              dataKey="outgoing"
              stroke="oklch(0.65 0.18 250)"
              strokeWidth={2}
              fill="url(#outgoingGradient)"
            />
            <Area
              type="monotone"
              dataKey="incoming"
              stroke="oklch(0.75 0.15 80)"
              strokeWidth={2}
              fill="url(#incomingGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function PerformanceChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          Yanıt Süreleri
        </h3>
        <p className="text-sm text-muted-foreground">Milisaniye (ms)</p>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={performanceData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.005 260)" />
            <XAxis
              type="number"
              tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
              axisLine={{ stroke: "oklch(0.22 0.005 260)" }}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
              axisLine={{ stroke: "oklch(0.22 0.005 260)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.13 0.005 260)",
                border: "1px solid oklch(0.22 0.005 260)",
                borderRadius: "8px",
                color: "oklch(0.95 0 0)",
              }}
            />
            <Bar dataKey="value" fill="oklch(0.7 0.15 180)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
