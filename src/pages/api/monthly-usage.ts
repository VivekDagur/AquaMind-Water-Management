// src/pages/api/monthly-usage.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const monthlyUsage = [
    { month: "Jan", usage: 120 },
    { month: "Feb", usage: 150 },
    { month: "Mar", usage: 180 },
    { month: "Apr", usage: 200 },
    { month: "May", usage: 175 },
    { month: "Jun", usage: 210 },
    { month: "Jul", usage: 195 },
    { month: "Aug", usage: 220 },
    { month: "Sep", usage: 205 },
    { month: "Oct", usage: 190 },
    { month: "Nov", usage: 160 },
    { month: "Dec", usage: 140 },
  ];

  res.status(200).json(monthlyUsage);
}
