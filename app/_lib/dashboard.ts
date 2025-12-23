// /vendor/admin/analytics?start_date=2025-01-01&end_date=2025-12-31


"use client";

import { AdminAnalytics, SubCategoryResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// 1. Modify fetch function to accept token as an argument
const fetchAnalytics = async (token: string | null) => {
  if (!token) {
    throw new Error("No auth token available");
  }

  const response = await axios.get<AdminAnalytics>(
    `${backendUrl}/vendor/admin/analytics?start_date=2025-01-01&end_date=2025-12-31`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};

export const useAnalytics = () => {
  // 2. State to hold the token
  const [token, setToken] = useState<string | null>(null);
  // 3. State to know we are on the client
  const [isClient, setIsClient] = useState(false);

  // 4. Use useEffect to get the token ONLY on the client-side
  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return useQuery({
    // 5. Add token to queryKey
    queryKey: ["analytics", token],
    // 6. Pass token to fetch function
    queryFn: () => fetchAnalytics(token),
    // 7. Enable only on client AND when token exists
    enabled: isClient && !!token,
  });
};
