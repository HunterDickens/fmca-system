"use client"

import { useEffect, useState } from "react"
import { parseAccessToken } from "@/lib/parse"
import { useRouter } from "next/navigation"

export default function AppPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("accessToken") || '';
    const user = parseAccessToken(accessToken);
    if (!user) {
      router.push("/login");
      return;
    }
    router.push("/get-started");
  }, [router])
}