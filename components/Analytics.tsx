"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  MessageCircle,
  MousePointer2,
  ArrowUpRight,
  Calendar,
  Download,
} from "lucide-react";
import Layout from "@/layout/Layout";
import moment from "moment";

// Mock Data
const revenueData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 900 },
  { name: "Jul", value: 1100 },
];

const COLORS = ["#2563eb", "#60a5fa"];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);

  const today = moment(new Date()).format("YYYY-MM-DD");
  const weekDaysAgo = moment(
    new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
  ).format("YYYY-MM-DD");

  const fetchData = async () => {
    const response = await fetch(
      `/api/analytics/card?start=${today}&end=${weekDaysAgo}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Disable caching to always fetch fresh data
      },
    );

    setData(await response.json());

    if (!response.ok) {
      throw new Error("Failed to fetch analytics data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pieData = [
    { name: "Instagram", value: data ? data.instagram : 550 },
    { name: "Facebook", value: data ? data.facebook : 300 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-800 rounded-xl p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Overview
            </h1>
            <p className="text-slate-500 dark:text-slate-200 font-medium">
              Real-time metrics for your automations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border dark:bg-slate-600 border-slate-200 dark:border-slate-400 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              <Calendar className="w-4 h-4" /> Last 30 Days
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 dark:shadow-slate-600 hover:bg-blue-700 transition-all">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* --- STAT CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value="৳1,25,430"
            growth="+12.5%"
            icon={TrendingUp}
            color="blue"
          />
          <StatCard
            title="Active Automations"
            value={data ? data.total : "..."}
            growth="-8.2%"
            icon={ZapIcon}
            color="blue"
          />
          <StatCard
            title="New Leads"
            value="1,204"
            growth="+24%"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Conv. Rate"
            value="12.5%"
            growth="+4.3%"
            icon={MousePointer2}
            color="blue"
          />
        </div>

        {/* --- CHARTS SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
          {/* Main Growth Chart */}
          <div className="lg:col-span-2 bg-white border border-slate-100 dark:border-slate-400 p-6 rounded-4xl shadow-sm dark:bg-slate-600">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg">
                Revenue Growth
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
                <span className="text-xs font-bold text-slate-400 dark:text-slate-100 uppercase tracking-wider">
                  This Year
                </span>
              </div>
            </div>
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%" className="">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Goal Completion (Circular) */}
          <div className="bg-white dark:bg-slate-600 border border-slate-100 dark:border-slate-400 p-6 rounded-4xl shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg mb-6 w-full text-left">
              Channel Split
            </h3>
            <div className="h-50 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2 w-full">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-100 font-bold">Instagram</span>
                <span className="text-slate-900 dark:text-slate-100 font-black">
                  {((data?.instagram / data?.total) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-100 font-bold">Facebook</span>
                <span className="text-slate-900 dark:text-slate-100 font-black">
                  {((data?.facebook / data?.total) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ title, value, growth, icon: Icon, color }: any) {
  return (
    <div className="bg-white dark:bg-slate-600 border border-slate-100 dark:border-slate-400 p-6 rounded-[28px] shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-200 group-hover:bg-blue-600 dark:group-hover:bg-slate-900 group-hover:text-white dark:group-hover:text-blue-500 transition-all">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-1 text-emerald-500 dark:text-emerald-100 bg-emerald-50 dark:bg-emerald-800 px-2 py-1 rounded-lg text-xs font-black">
          {growth} <ArrowUpRight className="w-3 h-3" />
        </div>
      </div>
      <div>
        <p className="text-slate-400 dark:text-slate-200 text-xs font-bold uppercase tracking-widest mb-1">
          {title}
        </p>
        <h4 className="text-2xl font-black text-slate-900 dark:text-slate-200 tracking-tight">
          {value}
        </h4>
      </div>
    </div>
  );
}

function ZapIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-zap"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
