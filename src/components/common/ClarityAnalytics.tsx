"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

const PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

/** Microsoft Clarity session analytics — production builds only, no-op without a project ID. */
export default function ClarityAnalytics() {
  useEffect(() => {
    if (!PROJECT_ID || process.env.NODE_ENV !== "production") return;
    Clarity.init(PROJECT_ID);
  }, []);

  return null;
}
