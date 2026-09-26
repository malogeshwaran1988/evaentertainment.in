"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";
import { CLARITY_PROJECT_ID } from "@@/constants/constants";

/** Microsoft Clarity session analytics — production builds only, so local dev sessions aren't recorded. */
export default function ClarityAnalytics() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    Clarity.init(CLARITY_PROJECT_ID);
  }, []);

  return null;
}
