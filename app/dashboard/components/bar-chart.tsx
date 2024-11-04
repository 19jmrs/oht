import { BarChart, ResponsiveContainer } from "recharts";

export function ChartBar() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart></BarChart>
    </ResponsiveContainer>
  );
}
