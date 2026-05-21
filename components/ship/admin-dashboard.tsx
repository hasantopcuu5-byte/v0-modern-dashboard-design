"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ShipFormData,
  CospData,
  defaultCospData,
} from "@/lib/ship-data-types";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Compass,
  Fuel,
  TrendingUp,
  TrendingDown,
  Upload,
  Ship,
  Gauge,
  Droplet,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Anchor,
  CloudSun,
} from "lucide-react";
import { useCallback, useState } from "react";

interface AdminDashboardProps {
  formData: ShipFormData;
  onImport: (data: ShipFormData) => void;
}

// CANAL vessel tank capacities (CBM)
const VESSEL_CAPACITIES = {
  freshWater: 445.4,
  sludge: 60,
  garbage: 8,
};

type FuelStatus = "green" | "grey" | "red";

function fuelStatusStyle(status: FuelStatus) {
  return {
    box:
      status === "green"
        ? "bg-green-500/10 border-green-500/30"
        : status === "red"
        ? "bg-destructive/10 border-destructive/30"
        : "bg-muted/50 border-border",
    text:
      status === "green"
        ? "text-green-500"
        : status === "red"
        ? "text-destructive"
        : "text-muted-foreground",
  };
}

function fuelLabel(status: FuelStatus) {
  if (status === "grey") return "Within Target (±5%)";
  if (status === "green") return "Fuel Saving (vs Target)";
  return "Over Consumption (vs Target)";
}

// Mock historical data for charts
const generateHistoricalData = (currentData: ShipFormData) => {
  const days = 7;
  const data = [];

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const variance = () => (Math.random() - 0.5) * 2;

    data.push({
      date: dateStr,
      orderedSpeed: currentData.orderedSpeed,
      avgSpeedOwner:
        i === 0
          ? currentData.distanceCoveredOwner / currentData.steamingTime
          : currentData.orderedSpeed + variance(),
      avgSpeedCharterer:
        i === 0
          ? currentData.distanceCoveredCharterer / currentData.steamingTime
          : currentData.orderedSpeed + variance() * 0.8,
      vlsfoOwner:
        i === 0
          ? currentData.ownerActualVlsfoBoiler +
            currentData.ownerActualVlsfoDg +
            currentData.ownerActualVlsfoMe
          : 30 + variance() * 3,
      vlsfoCharterer:
        i === 0
          ? currentData.chartererAllowedVlsfoBoiler +
            currentData.chartererAllowedVlsfoDg +
            currentData.chartererAllowedVlsfoMe
          : 32 + variance() * 2,
      lsmgoOwner:
        i === 0
          ? currentData.ownerActualLsmgoBoiler +
            currentData.ownerActualLsmgoDg +
            currentData.ownerActualLsmgoMe
          : 0.6 + variance() * 0.2,
      lsmgoCharterer:
        i === 0
          ? currentData.chartererAllowedLsmgoBoiler +
            currentData.chartererAllowedLsmgoDg +
            currentData.chartererAllowedLsmgoMe
          : 0.7 + variance() * 0.15,
      wind: i === 0 ? currentData.weatherOwnerWind : 15 + variance() * 5,
      swell: i === 0 ? currentData.weatherOwnerSwell : 2 + variance() * 0.5,
      sogStwDiff:
        i === 0
          ? currentData.distanceCoveredOwner -
            currentData.distanceCoveredCharterer
          : variance() * 4,
    });
  }

  return data;
};

function KPICard({
  title,
  ownerValue,
  chartererValue,
  unit,
  icon: Icon,
  showDifference = false,
  valueColors,
}: {
  title: string;
  ownerValue: number;
  chartererValue: number;
  unit: string;
  icon: React.ElementType;
  showDifference?: boolean;
  valueColors?: { owner?: string; charterer?: string };
}) {
  const difference = ownerValue - chartererValue;
  const isNegative = difference < 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-4">
              <div>
                <p className={`text-2xl font-bold ${valueColors?.owner || ""}`}>{ownerValue.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Owner</p>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div>
                <p className={`text-2xl font-bold ${valueColors?.charterer || "text-muted-foreground"}`}>
                  {chartererValue.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">Charterer</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{unit}</p>
          </div>
          <div
            className={`p-2 rounded-lg ${
              showDifference && isNegative
                ? "bg-destructive/10"
                : "bg-primary/10"
            }`}
          >
            <Icon
              className={`h-5 w-5 ${
                showDifference && isNegative
                  ? "text-destructive"
                  : "text-primary"
              }`}
            />
          </div>
        </div>
        {showDifference && (
          <div
            className={`mt-3 flex items-center gap-1 text-sm ${
              isNegative ? "text-destructive" : "text-green-500"
            }`}
          >
            {isNegative ? (
              <ArrowDownRight className="h-4 w-4" />
            ) : (
              <ArrowUpRight className="h-4 w-4" />
            )}
            <span className="font-medium">{Math.abs(difference).toFixed(2)}</span>
            <span className="text-muted-foreground">difference</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ROBTracker({
  formData,
  cospData,
}: {
  formData: ShipFormData;
  cospData: CospData;
}) {
  const totalVlsfoConsumedOwner =
    formData.ownerActualVlsfoBoiler +
    formData.ownerActualVlsfoDg +
    formData.ownerActualVlsfoMe;
  const totalLsmgoConsumedOwner =
    formData.ownerActualLsmgoBoiler +
    formData.ownerActualLsmgoDg +
    formData.ownerActualLsmgoMe;

  const totalVlsfoAllowed =
    formData.chartererAllowedVlsfoBoiler +
    formData.chartererAllowedVlsfoDg +
    formData.chartererAllowedVlsfoMe;
  const totalLsmgoAllowed =
    formData.chartererAllowedLsmgoBoiler +
    formData.chartererAllowedLsmgoDg +
    formData.chartererAllowedLsmgoMe;

  const vlsfoRob =
    cospData.vlsfoInitial + formData.vlsfoSupply - totalVlsfoConsumedOwner;
  const lsmgoRob =
    cospData.lsmgoInitial + formData.lsmgoSupply - totalLsmgoConsumedOwner;

  // DYNAMIC C/P FUEL LIMIT CALCULATION
  const cpFuelMatch = formData.charterpartyTerm.match(/Abt\s*([0-9.]+)\s*Mt/i);
  const cpDailyFuelLimit = cpFuelMatch ? parseFloat(cpFuelMatch[1]) : 0;
  
  // Eğer listeden C/P seçildiyse (steaming time'a göre) orantıla, yoksa manuel Charterer değerini kullan
  const cpVoyageLimitVlsfo = cpDailyFuelLimit > 0 
    ? (cpDailyFuelLimit / 24) * formData.steamingTime 
    : totalVlsfoAllowed;

  const vlsfoDiff = cpVoyageLimitVlsfo - totalVlsfoConsumedOwner;
  const lsmgoDiff = totalLsmgoAllowed - totalLsmgoConsumedOwner;

  // ±5% tolerance: grey zone
  const vlsfoBase = cpDailyFuelLimit > 0 ? cpVoyageLimitVlsfo : totalVlsfoAllowed;
  const vlsfoStatus: FuelStatus =
    Math.abs(vlsfoDiff) <= vlsfoBase * 0.05 ? "grey" : vlsfoDiff > 0 ? "green" : "red";

  const lsmgoStatus: FuelStatus =
    Math.abs(lsmgoDiff) <= totalLsmgoAllowed * 0.05 ? "grey" : lsmgoDiff > 0 ? "green" : "red";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Fuel className="h-4 w-4 text-primary" />
          Bunker / R.O.B. Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* VLSFO */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-primary/10">
                VLSFO
              </Badge>
              <span className="text-lg font-bold">{vlsfoRob.toFixed(1)} MT</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Initial COSP</span>
                <span>{cospData.vlsfoInitial} MT</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>+ Supply</span>
                <span>+{formData.vlsfoSupply} MT</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>- Daily Consumption</span>
                <span>-{totalVlsfoConsumedOwner.toFixed(1)} MT</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Current R.O.B.</span>
                <span>{vlsfoRob.toFixed(1)} MT</span>
              </div>
            </div>

            {/* VLSFO DIFFERENCE BOX */}
            <div className={`p-4 border-2 rounded-xl mt-4 ${fuelStatusStyle(vlsfoStatus).box}`}>
              <div className="flex flex-col gap-1 text-center">
                <span className="text-sm font-medium text-foreground">
                  {fuelLabel(vlsfoStatus)}
                </span>
                <span className={`text-3xl font-black ${fuelStatusStyle(vlsfoStatus).text}`}>
                  {vlsfoDiff > 0 ? "+" : ""}{vlsfoDiff.toFixed(1)} MT
                </span>
                {cpDailyFuelLimit > 0 && (
                  <span className="text-xs text-muted-foreground mt-1">
                    C/P Limit: <b>{cpVoyageLimitVlsfo.toFixed(1)} MT</b> based on {formData.steamingTime}h
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* LSMGO */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-accent/10">
                LSMGO
              </Badge>
              <span className="text-lg font-bold">{lsmgoRob.toFixed(1)} MT</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Initial COSP</span>
                <span>{cospData.lsmgoInitial} MT</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>+ Supply</span>
                <span>+{formData.lsmgoSupply} MT</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>- Daily Consumption</span>
                <span>-{totalLsmgoConsumedOwner.toFixed(1)} MT</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Current R.O.B.</span>
                <span>{lsmgoRob.toFixed(1)} MT</span>
              </div>
            </div>

            <div className={`p-4 border-2 rounded-xl mt-4 ${fuelStatusStyle(lsmgoStatus).box}`}>
              <div className="flex flex-col gap-1 text-center">
                <span className="text-sm font-medium text-foreground">
                  {fuelLabel(lsmgoStatus)}
                </span>
                <span className={`text-3xl font-black ${fuelStatusStyle(lsmgoStatus).text}`}>
                  {lsmgoDiff > 0 ? "+" : ""}{lsmgoDiff.toFixed(2)} MT
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Allowed: <b>{totalLsmgoAllowed.toFixed(2)} MT</b>
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminDashboard({ formData, onImport }: AdminDashboardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [cospData] = useState<CospData>(defaultCospData);

  const chartData = generateHistoricalData(formData);

  const avgSpeedOwner =
    formData.distanceCoveredOwner / formData.steamingTime;
  const avgSpeedCharterer =
    formData.distanceCoveredCharterer / formData.steamingTime;
  const sogStwDiff =
    formData.distanceCoveredOwner - formData.distanceCoveredCharterer;

  // DYNAMIC C/P SPEED LIMIT CALCULATION
  const cpSpeedMatch = formData.charterpartyTerm.match(/Abt\s*([0-9.]+)\s*Kt/i);
  const cpSpeedTarget = cpSpeedMatch ? parseFloat(cpSpeedMatch[1]) : 0;

  // HIZ RENKLENDİRMESİ (Hedefi aşarsa Kırmızı, Altındaysa Yeşil)
  const ownerSpeedColor = cpSpeedTarget > 0 
    ? (avgSpeedOwner > cpSpeedTarget ? "text-destructive" : "text-green-500") 
    : "";
    
  const chartererSpeedColor = cpSpeedTarget > 0 
    ? (avgSpeedCharterer > cpSpeedTarget ? "text-destructive" : "text-green-500") 
    : "text-muted-foreground";

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            onImport(data);
          } catch (err) {
            console.error("Invalid JSON file", err);
          }
        };
        reader.readAsText(file);
      }
    },
    [onImport]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          onImport(data);
        } catch (err) {
          console.error("Invalid JSON file", err);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Import Zone */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="py-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 rounded-full bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">Import JSON Data</p>
              <p className="text-sm text-muted-foreground">
                Drag and drop a JSON file or click to browse
              </p>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleFileInput}
              className="hidden"
              id="json-upload"
            />
            <Button variant="outline" asChild>
              <label htmlFor="json-upload" className="cursor-pointer">
                Browse Files
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Distance"
          ownerValue={formData.distanceCoveredOwner}
          chartererValue={formData.distanceCoveredCharterer}
          unit="Nautical Miles"
          icon={Compass}
        />
        <KPICard
          title={`Daily Avg Speed ${cpSpeedTarget > 0 ? `(Target: ${cpSpeedTarget} kts)` : ''}`}
          ownerValue={avgSpeedOwner}
          chartererValue={avgSpeedCharterer}
          unit="Knots"
          icon={Gauge}
          valueColors={{ owner: ownerSpeedColor, charterer: chartererSpeedColor }}
        />
        <KPICard
          title="Daily Avg Speed STW"
          ownerValue={avgSpeedOwner * 0.98}
          chartererValue={avgSpeedCharterer * 0.97}
          unit="Knots"
          icon={Ship}
        />
        <KPICard
          title="SOG - STW Diff"
          ownerValue={sogStwDiff}
          chartererValue={0}
          unit="Nautical Miles"
          icon={sogStwDiff < 0 ? TrendingDown : TrendingUp}
          showDifference
        />
      </div>

      {/* ROB Tracker */}
      <ROBTracker formData={formData} cospData={cospData} />

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Speed Analysis Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Speed Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    domain={["auto", "auto"]}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--card-foreground))",
                    }}
                    itemStyle={{ color: "hsl(var(--card-foreground))" }}
                    labelStyle={{ color: "hsl(var(--card-foreground))" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="orderedSpeed"
                    name="Ordered Speed"
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgSpeedOwner"
                    name="Avg Speed (Owner)"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgSpeedCharterer"
                    name="Avg Speed (Charterer)"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Fuel Consumption Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Droplet className="h-4 w-4 text-primary" />
              Fuel Consumption Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.slice(-5)}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--card-foreground))",
                    }}
                    itemStyle={{ color: "hsl(var(--card-foreground))" }}
                    labelStyle={{ color: "hsl(var(--card-foreground))" }}
                    formatter={(value: number) => [`${value} MT`, "Miktar"]}
                  />
                  <Legend />
                  <Bar
                    dataKey="vlsfoOwner"
                    name="VLSFO Owner"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="vlsfoCharterer"
                    name="VLSFO Charterer"
                    fill="hsl(var(--accent))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weather Impact Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Compass className="h-4 w-4 text-primary" />
              Weather Impact Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--card-foreground))",
                    }}
                    itemStyle={{ color: "hsl(var(--card-foreground))" }}
                    labelStyle={{ color: "hsl(var(--card-foreground))" }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="wind"
                    name="Wind (kts)"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    stroke="hsl(var(--primary))"
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="swell"
                    name="Swell (m)"
                    fill="hsl(var(--accent))"
                    fillOpacity={0.2}
                    stroke="hsl(var(--accent))"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="sogStwDiff"
                    name="SOG-STW Diff"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Water, Sludge & Waste — Capacity Progress Bars */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Trash2 className="h-4 w-4 text-primary" />
            Fresh Water, Sludge & Garbage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">

          {/* Fresh Water */}
          {(() => {
            const pct = Math.min((formData.freshWater / VESSEL_CAPACITIES.freshWater) * 100, 100);
            const barColor =
              pct < 30 ? "bg-destructive" : pct < 55 ? "bg-amber-500" : "bg-blue-500";
            const badgeColor =
              pct < 30 ? "border-destructive text-destructive" : "border-muted-foreground text-muted-foreground";
            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                    <span className="font-medium">Fresh Water</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-semibold text-foreground">{formData.freshWater.toFixed(1)}</span>
                    <span>/</span>
                    <span>{VESSEL_CAPACITIES.freshWater} CBM</span>
                    <Badge variant="outline" className={`text-xs ${badgeColor}`}>
                      {pct.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {pct < 30 ? "⚠ Low level — consider bunkering fresh water" : pct < 55 ? "Moderate level" : "Good level"}
                </p>
              </div>
            );
          })()}

          {/* Sludge */}
          {(() => {
            const pct = Math.min((formData.sludge / VESSEL_CAPACITIES.sludge) * 100, 100);
            const barColor =
              pct > 80 ? "bg-destructive" : pct > 60 ? "bg-amber-500" : "bg-amber-800";
            const badgeColor =
              pct > 80 ? "border-destructive text-destructive" :
              pct > 60 ? "border-amber-500 text-amber-600" : "border-muted-foreground text-muted-foreground";
            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-800 shrink-0" />
                    <span className="font-medium">Sludge Tank</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-semibold text-foreground">{formData.sludge.toFixed(1)}</span>
                    <span>/</span>
                    <span>{VESSEL_CAPACITIES.sludge} CBM</span>
                    <Badge variant="outline" className={`text-xs ${badgeColor}`}>
                      {pct.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {pct > 80 ? "⚠ High — arrange discharge at next port" : pct > 60 ? "Getting full — monitor closely" : "Normal level"}
                </p>
              </div>
            );
          })()}

          {/* Garbage */}
          {(() => {
            const pct = Math.min((formData.garbage / VESSEL_CAPACITIES.garbage) * 100, 100);
            const barColor =
              pct > 80 ? "bg-destructive" : pct > 60 ? "bg-amber-500" : "bg-red-700";
            const badgeColor =
              pct > 80 ? "border-destructive text-destructive" :
              pct > 60 ? "border-amber-500 text-amber-600" : "border-muted-foreground text-muted-foreground";
            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-700 shrink-0" />
                    <span className="font-medium">Garbage</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-semibold text-foreground">{formData.garbage.toFixed(2)}</span>
                    <span>/</span>
                    <span>{VESSEL_CAPACITIES.garbage} CBM</span>
                    <Badge variant="outline" className={`text-xs ${badgeColor}`}>
                      {pct.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {pct > 80 ? "⚠ Almost full — dispose at next port" : pct > 60 ? "Getting full" : "Normal level"}
                </p>
              </div>
            );
          })()}

          <p className="text-xs text-muted-foreground pt-1 border-t border-border">
            Vessel: <span className="font-medium text-foreground">CANAL</span> — FW Tank: {VESSEL_CAPACITIES.freshWater} CBM · Sludge Tank: {VESSEL_CAPACITIES.sludge} CBM · Garbage: {VESSEL_CAPACITIES.garbage} CBM
          </p>
        </CardContent>
      </Card>

      {/* DETAILED RAW DATA SEPARATED INTO CARDS */}
      <div className="space-y-6 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold tracking-tight">Detailed Voyage Data</h3>

        {/* 1. General Details Card */}
        <Card>
          <CardHeader className="pb-3 bg-muted/20 border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <Anchor className="h-4 w-4 text-primary" />
              General Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">Operation</span>
                <p className="font-medium capitalize"><Badge variant="outline">{formData.operation.replace('-', ' ')}</Badge></p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">Date & Time</span>
                <p className="font-medium">{new Date(formData.dateTime).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">Steaming Time</span>
                <p className="font-medium">{formData.steamingTime} hrs</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">C/P Term</span>
                <p className="font-medium">{formData.charterpartyTerm || '-'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">Cargo Qty</span>
                <p className="font-medium">{formData.cargoQuantity.toLocaleString()} MT</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">M/E Slip</span>
                <p className="font-medium">{formData.meSlipPercent}%</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">Avr. RPM</span>
                <p className="font-medium">{formData.avgRpm}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Engine & Consumables Details Card */}
        <Card>
          <CardHeader className="pb-3 bg-muted/20 border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <Gauge className="h-4 w-4 text-primary" />
              Engine & Consumables Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">EPL Status</span>
                <p><Badge variant={formData.eplStatus ? "default" : "secondary"}>{formData.eplStatus ? "ON" : "OFF"}</Badge></p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">M/E Load / RHs</span>
                <p className="font-medium">{formData.meLoadPercent}% <span className="text-muted-foreground mx-1">|</span> {formData.meDailyRunningHrs} hrs</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">DG Power / Boiler</span>
                <p className="font-medium">{formData.dgTotalPowerKw} kW <span className="text-muted-foreground mx-1">|</span> {formData.boilerDailyHrs} hrs</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">M/E Cyl / Sys Oil</span>
                <p className="font-medium">{formData.meCylOil} L <span className="text-muted-foreground mx-1">|</span> {formData.meSysOil} L</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">A/E Sys Oil</span>
                <p className="font-medium">{formData.aeSysOil} L</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">Slop / Sewage</span>
                <p className="font-medium">{formData.slop} m³ <span className="text-muted-foreground mx-1">|</span> {formData.sewage} m³</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Weather Conditions Card */}
        <Card>
          <CardHeader className="pb-3 bg-muted/20 border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <CloudSun className="h-4 w-4 text-primary" />
              Weather Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">Owner Actual</span>
                <div className="bg-muted/40 border p-3 rounded-lg space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Wind</span>
                    <span>{formData.weatherOwnerWind} kts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Swell</span>
                    <span>{formData.weatherOwnerSwell} m</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-border">
                    <Badge variant="outline" className="capitalize text-xs font-normal bg-background">{formData.weatherOwnerSeaState.replace('-', ' ')}</Badge>
                    <span className="text-xs text-muted-foreground">Adv. Curr: {formData.weatherOwnerAdverseCurrent} kts</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">Charterer Allowed</span>
                <div className="bg-muted/40 border p-3 rounded-lg space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Wind</span>
                    <span>{formData.weatherChartererWind} kts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Swell</span>
                    <span>{formData.weatherChartererSwell} m</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-border">
                    <Badge variant="outline" className="capitalize text-xs font-normal bg-background">{formData.weatherChartererSeaState.replace('-', ' ')}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">Weather Routing</span>
                <div className="bg-muted/40 border p-3 rounded-lg space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Wind</span>
                    <span>{formData.weatherRoutingWind} kts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Swell</span>
                    <span>{formData.weatherRoutingSwell} m</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-border">
                    <Badge variant="outline" className="capitalize text-xs font-normal bg-background">{formData.weatherRoutingSeaState.replace('-', ' ')}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
