// src/pages/Dashboard.tsx
import ChatWidget from "@/components/ChatWidget";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Droplets, TrendingUp, AlertTriangle, CheckCircle, Zap, DollarSign, RefreshCw } from 'lucide-react';
import SmallBarChart from "@/components/SmallBarChart";
import { WaterChart } from "@/components/WaterChart";
import { TankCard } from "@/components/TankCard";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { useAuth } from '@/hooks/useAuth';
import { calculateKPIs, generateHistoricalData, type Tank, mockTanks } from "@/utils/mockData";
import { apiClient } from "@/utils/api";
import { getSensorInstance, startSensorSimulation } from "@/utils/sensors";
import { useToast } from "@/hooks/use-toast";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [selectedTank, setSelectedTank] = useState<Tank | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  // 🔹 Monthly usage (client-side realtime generator, no backend)
  const [monthlyUsage, setMonthlyUsage] = useState<{label: string; value: number}[]>([]);

  // Calculate KPIs
  const [apiKpis, setApiKpis] = useState<{ totalWaterStored?: number; totalCapacity?: number; utilizationPercentage?: number; communityTanks?: number; nextRefillETA?: number } | null>(null);
  const kpis = apiKpis
    ? {
        totalWaterStored: apiKpis.totalWaterStored || 0,
        totalCapacity: apiKpis.totalCapacity || 0,
        utilizationPercentage: apiKpis.utilizationPercentage || 0,
        communityTanks: apiKpis.communityTanks || (tanks?.length || 0),
        avgDailyConsumption: 0,
        nextRefillETA: apiKpis.nextRefillETA || 0,
        criticalTankCount: calculateKPIs(tanks).criticalTankCount,
        lowTankCount: calculateKPIs(tanks).lowTankCount,
      }
    : calculateKPIs(tanks.length ? tanks : []);

  // Chart data (existing generator you already have)
  const chartData = selectedTank ? generateHistoricalData(selectedTank, 24) : [];
  // 🔹 Load tanks and KPIs from backend
  useEffect(() => {
    const load = async () => {
      try {
        const [tanksRes, kpiRes] = await Promise.all([
          apiClient.get("/tanks"),
          apiClient.get("/kpis"),
        ]);

        // Map backend Tank model to frontend Tank shape if needed
        type BackendTank = { _id?: string; name?: string; capacity?: number; currentLevel?: number; location?: string };
        const backendTanks: BackendTank[] = (tanksRes.data as BackendTank[]) || [];
        let mapped: Tank[] = backendTanks.map((t, i) => ({
          tank_id: t._id ?? String(i),
          name: t.name ?? `Tank ${i + 1}`,
          capacity_liters: t.capacity ?? 0,
          current_liters: t.currentLevel ?? 0,
          location: t.location ?? "",
          status: (t.currentLevel ?? 0) < (t.capacity ?? 0) * 0.1 ? "critical" : (t.currentLevel ?? 0) < (t.capacity ?? 0) * 0.3 ? "low" : "healthy",
          avg_consumption_lph: 50,
          last_refill_iso: new Date().toISOString(),
          is_community: false,
          owner: "",
        }));
        if (!mapped.length) {
          mapped = mockTanks;
        }
        setTanks(mapped);
        setSelectedTank((prev) => prev ?? mapped[0] ?? null);
        try {
          const k = kpiRes.data || null;
          setApiKpis(k);
        } catch (kpiErr) {
          console.error("Failed to load KPIs", kpiErr);
        }
      } catch (err) {
        console.error("Failed to load tanks/kpis", err);
        // Fallback entirely to mock if API fails
        setTanks(mockTanks);
        setSelectedTank((prev) => prev ?? mockTanks[0]);
      }
    };
    load();
  }, []);

  // 🔹 Realtime monthly usage simulation (12 months rolling)
  const monthLabels = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(undefined, { month: "short" });
    const now = new Date();
    const labels: string[] = [];
    for (let i = 11; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(formatter.format(d));
    }
    return labels;
  }, []);

  useEffect(() => {
    // initialize with a smooth baseline
    const base = 200 + Math.random() * 150;
    const initial: {label: string; value: number}[] = monthLabels.map((m, i) => ({
      label: m,
      value: Math.max(50, Math.round(base + 60 * Math.sin(i / 2) + (Math.random() - 0.5) * 40)),
    }));
    setMonthlyUsage(initial);

    // update last month every 3 seconds to emulate realtime
    const id = setInterval(() => {
      setMonthlyUsage((prev) => {
        if (prev.length === 0) return prev;
        const next = [...prev];
        const last = next[next.length - 1]?.value ?? 0;
        const drift = (Math.random() - 0.5) * 20;
        const updated = Math.max(50, Math.round(last + drift));
        next[next.length - 1] = { label: next[next.length - 1].label, value: updated };
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, [monthLabels]);

  // 🔹 Prefer backend monthly usage if available, refresh every 20s
  useEffect(() => {
    let stop = false;
    const fetchMonthly = async () => {
      try {
        type Monthly = { month: string; usage: number };
        const res = await apiClient.get<Monthly[]>("/monthly-usage");
        if (!stop && Array.isArray(res.data) && res.data.length) {
          setMonthlyUsage(res.data.map((d) => ({ label: d.month, value: d.usage })));
        }
      } catch {
        // ignore, fallback to client sim already running
      }
    };
    fetchMonthly();
    const id = setInterval(fetchMonthly, 20000);
    return () => { stop = true; clearInterval(id); };
  }, []);

  // Init sensor simulation (existing code - unchanged)
  useEffect(() => {
    if (!selectedTank) return;
    const sensorInstance = startSensorSimulation(tanks);
    setIsSimulationRunning(true);

    const unsubscribeTanks = sensorInstance.onTankUpdate((updatedTanks) => {
      setTanks([...updatedTanks]);
      setLastUpdate(new Date());

      const updatedSelected = updatedTanks.find(
        (t) => t.tank_id === selectedTank.tank_id
      );
      if (updatedSelected) {
        setSelectedTank(updatedSelected);
      }
    });

    const unsubscribeAlerts = sensorInstance.onAlert((alert) => {
      const severity =
        alert.severity === "critical"
          ? "destructive"
          : alert.severity === "high"
          ? "destructive"
          : "default";
      toast({
        variant: severity as "destructive" | "default",
        title: `${alert.type.toUpperCase()} Alert`,
        description: alert.message,
      });
    });

    return () => {
      unsubscribeTanks();
      unsubscribeAlerts();
      sensorInstance.stop();
      setIsSimulationRunning(false);
    };
  }, [selectedTank, toast, tanks]);

  const criticalCount = kpis.criticalTankCount;
  const lowCount = kpis.lowTankCount;
  const needsRefillCount = criticalCount + lowCount;

  const handleRefillTank = (tankId: string) => {
    try {
      const sensorInstance = getSensorInstance();
      sensorInstance.refillTank(tankId);

      toast({
        title: "Tank Refilled! 🚰",
        description: "Tank has been successfully refilled.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Refill Failed",
        description: "Unable to refill tank. Please try again.",
      });
    }
  };

  const handleRefresh = () => {
    setLastUpdate(new Date());
    toast({
      title: "Data Refreshed",
      description: "Tank information has been updated.",
    });
  };

  // Check if user is in demo mode
  const isDemoMode = user?.tankSetup?.wantsDemoMode;

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Demo Mode Enhancement for Hackathon */}
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isDemoMode ? '🚀 AquaMind Demo - Water Management Dashboard' : 'Water Management Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              {isDemoMode ? 'Live demonstration with AI-powered insights and real-time monitoring' : 'Monitor and manage your water systems in real-time'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={isSimulationRunning}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* ====== KPI CARDS ====== */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="text-xs text-muted-foreground mb-1">Total Water Stored</div>
            <div className="text-2xl font-semibold text-primary">
              {kpis.totalWaterStored.toLocaleString()} L
            </div>
            <div className="text-xs text-muted-foreground mt-1">{Math.round((kpis.totalWaterStored / (kpis.totalCapacity || 1)) * 100)}% of capacity</div>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="text-xs text-muted-foreground mb-1">Community Tanks</div>
            <div className="text-2xl font-semibold text-emerald-600">{kpis.communityTanks}</div>
            <div className="text-xs text-muted-foreground mt-1">Active monitoring</div>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="text-xs text-muted-foreground mb-1">Daily Consumption</div>
            <div className="text-2xl font-semibold text-cyan-600">{selectedTank ? Math.round(((selectedTank.avg_consumption_lph || 50) * 24)) : 0} L</div>
            <div className="text-xs text-muted-foreground mt-1">Average per day</div>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="text-xs text-muted-foreground mb-1">Next Refill ETA</div>
            <div className="text-2xl font-semibold text-amber-600">{kpis.nextRefillETA || 0}h</div>
            <div className="text-xs text-muted-foreground mt-1">Most urgent tank</div>
          </div>
        </div>

        {/* ====== ALERT BANNER ====== */}
        {needsRefillCount > 0 && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 text-destructive p-4 flex items-center gap-3">
            <span className="inline-flex h-2 w-2 rounded-full bg-destructive" />
            <span className="font-medium">Attention Required:</span>
            <span>{needsRefillCount} tank{needsRefillCount > 1 ? "s" : ""} need refilling</span>
            {lowCount > 0 && <span className="text-xs text-muted-foreground">{lowCount} low</span>}
          </div>
        )}
        {/* ====== CHARTS ROW ====== */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* left: WaterChart */}
          <div className="lg:col-span-2">
            <WaterChart
              data={chartData}
              title={`${selectedTank ? selectedTank.name : "Tank"} - Water Level Trend`}
              height={400}
            />
          </div>

          {/* right: Monthly Usage BarChart */}
          <div className="flex flex-col">
            <div className="rounded-xl border bg-card p-4 shadow-sm mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <h3 className="font-semibold">Quick Actions</h3>
              </div>
              <label className="text-xs text-muted-foreground">Monitor Tank</label>
              <select
                className="mt-1 w-full rounded-md border bg-background p-2 text-sm"
                value={selectedTank?.tank_id || ""}
                onChange={(e) => {
                  const t = tanks.find((x) => x.tank_id === e.target.value);
                  if (t) setSelectedTank(t);
                }}
              >
                {tanks.map((t) => (
                  <option key={t.tank_id} value={t.tank_id}>{t.name} ({Math.round((t.current_liters / t.capacity_liters) * 100)}%)</option>
                ))}
              </select>

              <div className="mt-3 text-sm">
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">Active Tanks</span>
                  <span>{tanks.length}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">Monitoring</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">Live</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">AI Insights</span>
                  <span className="rounded-full bg-primary/15 text-primary px-2 py-0.5 text-xs">Active</span>
                </div>
              </div>
            </div>

            <SmallBarChart
              data={monthlyUsage}
              title="Monthly Usage"
              height={260}
            />
          </div>
        </div>

        {/* Tank Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Tank Overview</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLastUpdate(new Date());
                toast({
                  title: "Data Refreshed",
                  description: "Tank information has been updated.",
                });
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tanks.map((tank) => (
              <TankCard
                key={tank.tank_id}
                tank={tank}
                onRefill={handleRefillTank}
                className="animate-slide-up"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ✅ AI Chat Widget */}
      <ChatWidget
        projectSummary="AquaMind is a water management system that monitors tanks and alerts users."
        selectedTank={selectedTank}
        kpis={kpis}
      />
    </ProtectedLayout>
  );
};

export default Dashboard;
