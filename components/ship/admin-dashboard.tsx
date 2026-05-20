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
  Settings,
} from "lucide-react";
import { useCallback, useState } from "react";

interface AdminDashboardProps {
  formData: ShipFormData;
  onImport: (data: ShipFormData) => void;
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
}: {
  title: string;
  ownerValue: number;
  chartererValue: number;
  unit: string;
  icon: React.ElementType;
  showDifference?: boolean;
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
                <p className="text-2xl font-bold">{ownerValue.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Owner</p>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div>
                <p className="text-2xl font-bold text-muted-foreground">
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

  const vlsfoDiff = totalVlsfoAllowed - totalVlsfoConsumedOwner;
  const lsmgoDiff = totalLsmgoAllowed - totalLsmgoConsumedOwner;

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

            <div
              className={`p-3 rounded-lg ${
                vlsfoDiff >= 0 ? "bg-green-500/10" : "bg-destructive/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {vlsfoDiff >= 0 ? "Fuel Saving" : "Over Consumption"}
                </span>
                <span
                  className={`text-lg font-bold ${
                    vlsfoDiff >= 0 ? "text-green-500" : "text-destructive"
                  }`}
                >
                  {vlsfoDiff >= 0 ? "+" : ""}
                  {vlsfoDiff.toFixed(1)} MT
                </span>
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

            <div
              className={`p-3 rounded-lg ${
                lsmgoDiff >= 0 ? "bg-green-500/10" : "bg-destructive/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {lsmgoDiff >= 0 ? "Fuel Saving" : "Over Consumption"}
                </span>
                <span
                  className={`text-lg font-bold ${
                    lsmgoDiff >= 0 ? "text-green-500" : "text-destructive"
                  }`}
                >
                  {lsmgoDiff >= 0 ? "+" : ""}
                  {lsmgoDiff.toFixed(1)} MT
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
          title="Daily Avg Speed"
          ownerValue={avgSpeedOwner}
          chartererValue={avgSpeedCharterer}
          unit="Knots"
          icon={Gauge}
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
                    }}
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
                    }}
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
                    }}
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

      {/* Water, Sludge & Waste Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Trash2 className="h-4 w-4 text-primary" />
            Fresh Water, Sludge & Garbage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: "Fresh Water",
                    value: formData.freshWater,
                    fill: "#3b82f6",
                  },
                  {
                    name: "Sludge",
                    value: formData.sludge,
                    fill: "#92400e",
                  },
                  {
                    name: "Garbage",
                    value: formData.garbage,
                    fill: "#dc2626",
                  },
                ]}
                layout="vertical"
                margin={{ left: 20, right: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                  unit=" m³"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                  width={100}
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
  formatter={(value: number) => [`${value} m³`, "Miktar"]}
/>
                <Bar
                  dataKey="value"
                  radius={[0, 4, 4, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#3b82f6" }} />
              <span className="text-sm text-muted-foreground">Fresh Water: {formData.freshWater} m³</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#92400e" }} />
              <span className="text-sm text-muted-foreground">Sludge: {formData.sludge} m³</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#dc2626" }} />
              <span className="text-sm text-muted-foreground">Garbage: {formData.garbage} m³</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
