"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ShipFormData,
  operationOptions,
  seaStateOptions,
} from "@/lib/ship-data-types";
import {
  Anchor,
  Gauge,
  Fuel,
  Droplets,
  CloudSun,
  ChevronDown,
  Download,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

interface ShipDataFormProps {
  formData: ShipFormData;
  onFormChange: (data: ShipFormData) => void;
  onExport: () => void;
}

function FormField({
  label,
  id,
  value,
  onChange,
  type = "number",
  unit,
  step,
}: {
  label: string;
  id: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  unit?: string;
  step?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 text-sm pr-12"
          step={step}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function CollapsibleCard({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                {title}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export function ShipDataForm({
  formData,
  onFormChange,
  onExport,
}: ShipDataFormProps) {
  const updateField = <K extends keyof ShipFormData>(
    field: K,
    value: ShipFormData[K]
  ) => {
    onFormChange({ ...formData, [field]: value });
  };

  const runningGenerators = [
    formData.dgDailyRhsNo1,
    formData.dgDailyRhsNo2,
    formData.dgDailyRhsNo3,
  ].filter((hrs) => hrs > 0).length;

  const showGeneratorWarning =
    runningGenerators > 1 && !formData.isOfficeInformed;

  return (
    <div className="space-y-4">
      {/* Card 1: General Voyage & Distance */}
      <CollapsibleCard title="General Voyage & Distance" icon={Anchor}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Operation</Label>
            <Select
              value={formData.operation}
              onValueChange={(v) => updateField("operation", v)}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {operationOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Date & Time</Label>
            <Input
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => updateField("dateTime", e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <FormField
            label="Steaming Time"
            id="steamingTime"
            value={formData.steamingTime}
            onChange={(v) => updateField("steamingTime", parseFloat(v) || 0)}
            unit="hrs"
          />
          <FormField
            label="Avr. RPM"
            id="avgRpm"
            value={formData.avgRpm}
            onChange={(v) => updateField("avgRpm", parseFloat(v) || 0)}
            unit="rpm"
          />
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField
            label="Distance Covered (Owner)"
            id="distanceCoveredOwner"
            value={formData.distanceCoveredOwner}
            onChange={(v) =>
              updateField("distanceCoveredOwner", parseFloat(v) || 0)
            }
            unit="nm"
            step="0.1"
          />
          <FormField
            label="Distance Covered (Charterer)"
            id="distanceCoveredCharterer"
            value={formData.distanceCoveredCharterer}
            onChange={(v) =>
              updateField("distanceCoveredCharterer", parseFloat(v) || 0)
            }
            unit="nm"
            step="0.1"
          />
          <FormField
            label="Ordered Speed"
            id="orderedSpeed"
            value={formData.orderedSpeed}
            onChange={(v) => updateField("orderedSpeed", parseFloat(v) || 0)}
            unit="kts"
            step="0.1"
          />
          <FormField
            label="M/E Slip %"
            id="meSlipPercent"
            value={formData.meSlipPercent}
            onChange={(v) => updateField("meSlipPercent", parseFloat(v) || 0)}
            unit="%"
            step="0.1"
          />
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <FormField
            label="Daily Log Distance (Owner)"
            id="dailyLogDistanceOwner"
            value={formData.dailyLogDistanceOwner}
            onChange={(v) =>
              updateField("dailyLogDistanceOwner", parseFloat(v) || 0)
            }
            unit="nm"
            step="0.1"
          />
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Charterparty Term
            </Label>
            <Input
              type="text"
              value={formData.charterpartyTerm}
              onChange={(e) => updateField("charterpartyTerm", e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <FormField
            label="Cargo/Ballast Qty"
            id="cargoQuantity"
            value={formData.cargoQuantity}
            onChange={(v) => updateField("cargoQuantity", parseFloat(v) || 0)}
            unit="MT"
          />
        </div>
      </CollapsibleCard>

      {/* Card 2: Engine & Generator Running Hours */}
      <CollapsibleCard title="Engine & Generator Running Hours" icon={Gauge}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField
            label="M/E Load %"
            id="meLoadPercent"
            value={formData.meLoadPercent}
            onChange={(v) => updateField("meLoadPercent", parseFloat(v) || 0)}
            unit="%"
          />
          <FormField
            label="M/E Daily Running Hrs"
            id="meDailyRunningHrs"
            value={formData.meDailyRunningHrs}
            onChange={(v) =>
              updateField("meDailyRunningHrs", parseFloat(v) || 0)
            }
            unit="hrs"
          />
          <FormField
            label="Boiler Daily Hrs"
            id="boilerDailyHrs"
            value={formData.boilerDailyHrs}
            onChange={(v) => updateField("boilerDailyHrs", parseFloat(v) || 0)}
            unit="hrs"
            step="0.1"
          />
          <FormField
            label="DG Total Power"
            id="dgTotalPowerKw"
            value={formData.dgTotalPowerKw}
            onChange={(v) => updateField("dgTotalPowerKw", parseFloat(v) || 0)}
            unit="kW"
          />
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            label="DG No.1 Daily RHs"
            id="dgDailyRhsNo1"
            value={formData.dgDailyRhsNo1}
            onChange={(v) => updateField("dgDailyRhsNo1", parseFloat(v) || 0)}
            unit="hrs"
          />
          <FormField
            label="DG No.2 Daily RHs"
            id="dgDailyRhsNo2"
            value={formData.dgDailyRhsNo2}
            onChange={(v) => updateField("dgDailyRhsNo2", parseFloat(v) || 0)}
            unit="hrs"
          />
          <FormField
            label="DG No.3 Daily RHs"
            id="dgDailyRhsNo3"
            value={formData.dgDailyRhsNo3}
            onChange={(v) => updateField("dgDailyRhsNo3", parseFloat(v) || 0)}
            unit="hrs"
          />
        </div>

        {showGeneratorWarning && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded-lg flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-warning-foreground">
                Multiple generators running ({runningGenerators})
              </p>
              <p className="text-xs text-muted-foreground">
                Please confirm the office has been informed.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isOfficeInformed}
                onCheckedChange={(v) => updateField("isOfficeInformed", v)}
              />
              <Label className="text-xs">Informed</Label>
            </div>
          </div>
        )}

        <Separator className="my-4" />

        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">EPL Status</span>
            <Badge variant={formData.eplStatus ? "default" : "secondary"}>
              {formData.eplStatus ? "ON" : "OFF"}
            </Badge>
          </div>
          <Switch
            checked={formData.eplStatus}
            onCheckedChange={(v) => updateField("eplStatus", v)}
          />
        </div>
      </CollapsibleCard>

      {/* Card 3: Fuel Consumptions */}
      <CollapsibleCard title="Fuel Consumptions" icon={Fuel}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Owner Actual */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10">
                Owner Actual
              </Badge>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">VLSFO</p>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  label="Boiler"
                  id="ownerActualVlsfoBoiler"
                  value={formData.ownerActualVlsfoBoiler}
                  onChange={(v) =>
                    updateField("ownerActualVlsfoBoiler", parseFloat(v) || 0)
                  }
                  unit="MT"
                  step="0.1"
                />
                <FormField
                  label="DG"
                  id="ownerActualVlsfoDg"
                  value={formData.ownerActualVlsfoDg}
                  onChange={(v) =>
                    updateField("ownerActualVlsfoDg", parseFloat(v) || 0)
                  }
                  unit="MT"
                  step="0.1"
                />
                <FormField
                  label="M/E"
                  id="ownerActualVlsfoMe"
                  value={formData.ownerActualVlsfoMe}
                  onChange={(v) =>
                    updateField("ownerActualVlsfoMe", parseFloat(v) || 0)
                  }
                  unit="MT"
                  step="0.1"
                />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">LSMGO</p>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  label="Boiler"
                  id="ownerActualLsmgoBoiler"
                  value={formData.ownerActualLsmgoBoiler}
                  onChange={(v) =>
                    updateField("ownerActualLsmgoBoiler", parseFloat(v) || 0)
                  }
                  unit="MT"
                  step="0.1"
                />
                <FormField
                  label="DG"
                  id="ownerActualLsmgoDg"
                  value={formData.ownerActualLsmgoDg}
                  onChange={(v) =>
                    updateField("ownerActualLsmgoDg", parseFloat(v) || 0)
                  }
                  unit="MT"
                  step="0.1"
                />
                <FormField
                  label="M/E"
                  id="ownerActualLsmgoMe"
                  value={formData.ownerActualLsmgoMe}
                  onChange={(v) =>
                    updateField("ownerActualLsmgoMe", parseFloat(v) || 0)
                  }
                  unit="MT"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Charterer Allowed */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-accent/10">
                Charterer Allowed
              </Badge>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">VLSFO</p>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  label="Boiler"
                  id="chartererAllowedVlsfoBoiler"
                  value={formData.chartererAllowedVlsfoBoiler}
                  onChange={(v) =>
                    updateField(
                      "chartererAllowedVlsfoBoiler",
                      parseFloat(v) || 0
                    )
                  }
                  unit="MT"
                  step="0.1"
                />
                <FormField
                  label="DG"
                  id="chartererAllowedVlsfoDg"
                  value={formData.chartererAllowedVlsfoDg}
                  onChange={(v) =>
                    updateField("chartererAllowedVlsfoDg", parseFloat(v) || 0)
                  }
                  unit="MT"
                  step="0.1"
                />
                <FormField
                  label="M/E"
                  id="chartererAllowedVlsfoMe"
                  value={formData.chartererAllowedVlsfoMe}
                  onChange={(v) =>
                    updateField("chartererAllowedVlsfoMe", parseFloat(v) || 0)
                  }
                  unit="MT"
                  step="0.1"
                />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">LSMGO</p>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  label="Boiler"
                  id="chartererAllowedLsmgoBoiler"
                  value={formData.chartererAllowedLsmgoBoiler}
                  onChange={(v) =>
                    updateField(
                      "chartererAllowedLsmgoBoiler",
                      parseFloat(v) || 0
                    )
                  }
                  unit="MT"
                  step="0.1"
                />
                <FormField
                  label="DG"
                  id="chartererAllowedLsmgoDg"
                  value={formData.chartererAllowedLsmgoDg}
                  onChange={(v) =>
                    updateField("chartererAllowedLsmgoDg", parseFloat(v) || 0)
                  }
                  unit="MT"
                  step="0.1"
                />
                <FormField
                  label="M/E"
                  id="chartererAllowedLsmgoMe"
                  value={formData.chartererAllowedLsmgoMe}
                  onChange={(v) =>
                    updateField("chartererAllowedLsmgoMe", parseFloat(v) || 0)
                  }
                  unit="MT"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        </div>
      </CollapsibleCard>

      {/* Card 4: Lubricants, Water & Waste */}
      <CollapsibleCard title="Lubricants, Water & Waste" icon={Droplets}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField
            label="M/E Sys Oil"
            id="meSysOil"
            value={formData.meSysOil}
            onChange={(v) => updateField("meSysOil", parseFloat(v) || 0)}
            unit="L"
          />
          <FormField
            label="M/E Cyl Oil"
            id="meCylOil"
            value={formData.meCylOil}
            onChange={(v) => updateField("meCylOil", parseFloat(v) || 0)}
            unit="L"
          />
          <FormField
            label="A/E Sys Oil"
            id="aeSysOil"
            value={formData.aeSysOil}
            onChange={(v) => updateField("aeSysOil", parseFloat(v) || 0)}
            unit="L"
          />
          <FormField
            label="Fresh Water"
            id="freshWater"
            value={formData.freshWater}
            onChange={(v) => updateField("freshWater", parseFloat(v) || 0)}
            unit="MT"
            step="0.1"
          />
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField
            label="Slop"
            id="slop"
            value={formData.slop}
            onChange={(v) => updateField("slop", parseFloat(v) || 0)}
            unit="m3"
            step="0.1"
          />
          <FormField
            label="Sludge"
            id="sludge"
            value={formData.sludge}
            onChange={(v) => updateField("sludge", parseFloat(v) || 0)}
            unit="m3"
            step="0.1"
          />
          <FormField
            label="Sewage"
            id="sewage"
            value={formData.sewage}
            onChange={(v) => updateField("sewage", parseFloat(v) || 0)}
            unit="m3"
            step="0.1"
          />
          <FormField
            label="Garbage"
            id="garbage"
            value={formData.garbage}
            onChange={(v) => updateField("garbage", parseFloat(v) || 0)}
            unit="m3"
            step="0.01"
          />
        </div>
      </CollapsibleCard>

      {/* Card 5: Bunker Supply & Weather */}
      <CollapsibleCard title="Bunker Supply & Weather Conditions" icon={CloudSun}>
        <div className="space-y-6">
          {/* Bunker Supply */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Bunker Supply</p>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="VLSFO Supply"
                id="vlsfoSupply"
                value={formData.vlsfoSupply}
                onChange={(v) => updateField("vlsfoSupply", parseFloat(v) || 0)}
                unit="MT"
                step="0.1"
              />
              <FormField
                label="LSMGO Supply"
                id="lsmgoSupply"
                value={formData.lsmgoSupply}
                onChange={(v) => updateField("lsmgoSupply", parseFloat(v) || 0)}
                unit="MT"
                step="0.1"
              />
            </div>
          </div>

          <Separator />

          {/* Weather Sections */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Weather Owner */}
            <div className="space-y-3">
              <Badge variant="outline" className="bg-primary/10">
                Weather (Owner)
              </Badge>
              <div className="space-y-3">
                <FormField
                  label="Wind"
                  id="weatherOwnerWind"
                  value={formData.weatherOwnerWind}
                  onChange={(v) =>
                    updateField("weatherOwnerWind", parseFloat(v) || 0)
                  }
                  unit="kts"
                />
                <FormField
                  label="Swell"
                  id="weatherOwnerSwell"
                  value={formData.weatherOwnerSwell}
                  onChange={(v) =>
                    updateField("weatherOwnerSwell", parseFloat(v) || 0)
                  }
                  unit="m"
                  step="0.1"
                />
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Sea State
                  </Label>
                  <Select
                    value={formData.weatherOwnerSeaState}
                    onValueChange={(v) =>
                      updateField("weatherOwnerSeaState", v)
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {seaStateOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormField
                  label="Adverse Current"
                  id="weatherOwnerAdverseCurrent"
                  value={formData.weatherOwnerAdverseCurrent}
                  onChange={(v) =>
                    updateField("weatherOwnerAdverseCurrent", parseFloat(v) || 0)
                  }
                  unit="kts"
                  step="0.1"
                />
              </div>
            </div>

            {/* Weather Charterer */}
            <div className="space-y-3">
              <Badge variant="outline" className="bg-accent/10">
                Weather (Charterer)
              </Badge>
              <div className="space-y-3">
                <FormField
                  label="Wind"
                  id="weatherChartererWind"
                  value={formData.weatherChartererWind}
                  onChange={(v) =>
                    updateField("weatherChartererWind", parseFloat(v) || 0)
                  }
                  unit="kts"
                />
                <FormField
                  label="Swell"
                  id="weatherChartererSwell"
                  value={formData.weatherChartererSwell}
                  onChange={(v) =>
                    updateField("weatherChartererSwell", parseFloat(v) || 0)
                  }
                  unit="m"
                  step="0.1"
                />
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Sea State
                  </Label>
                  <Select
                    value={formData.weatherChartererSeaState}
                    onValueChange={(v) =>
                      updateField("weatherChartererSeaState", v)
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {seaStateOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Weather Routing */}
            <div className="space-y-3">
              <Badge variant="outline" className="bg-muted">
                Weather (Routing)
              </Badge>
              <div className="space-y-3">
                <FormField
                  label="Wind"
                  id="weatherRoutingWind"
                  value={formData.weatherRoutingWind}
                  onChange={(v) =>
                    updateField("weatherRoutingWind", parseFloat(v) || 0)
                  }
                  unit="kts"
                />
                <FormField
                  label="Swell"
                  id="weatherRoutingSwell"
                  value={formData.weatherRoutingSwell}
                  onChange={(v) =>
                    updateField("weatherRoutingSwell", parseFloat(v) || 0)
                  }
                  unit="m"
                  step="0.1"
                />
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Sea State
                  </Label>
                  <Select
                    value={formData.weatherRoutingSeaState}
                    onValueChange={(v) =>
                      updateField("weatherRoutingSeaState", v)
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {seaStateOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleCard>

      {/* Export Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={onExport} size="lg" className="gap-2">
          <Download className="h-4 w-4" />
          Save & Export as JSON
        </Button>
      </div>
    </div>
  );
}
