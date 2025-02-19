'use client'
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { API_URL } from "../config";

const PriceHistoryChart = ({ productName }: { productName: string }) => {
  const [priceHistory, setPriceHistory] = useState<{ recordedAt: string; price: number }[]>([]);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/price-history?product=${encodeURIComponent(productName)}`);
        if (!response.ok) throw new Error("Failed to fetch price history");
        const data = await response.json();
        console.log({ data });

        setPriceHistory(data.map((entry: any) => {
          console.log({ entry });
          return {
            recordedAt: entry.recordedAt,
            price: entry.price,
          };
        }));
      } catch (error) {
        console.error("Error fetching price history:", error);
      }
    };

    fetchPriceHistory();
  }, [productName]);

  return (
    <div className="w-full h-96">
      <h2 className="text-xl font-semibold mb-4">Price History for {productName}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={priceHistory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="recordedAt" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceHistoryChart;
