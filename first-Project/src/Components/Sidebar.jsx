import Navigation from "./Navigation";
import "./css/Sidebar.css";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";

function Sidebar({ transactions }) {

  const dailyData = {};
  let runningBalance = 0;

  (transactions || []).forEach((t) => {
    const date = new Date(t.date);
    const dayKey = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    const amount = parseFloat(t.amount.replace(/[₹\-+]/g, ""));
    const adjustedAmount = t.type === "Income" ? amount : -amount;

    if (!dailyData[dayKey]) {
      dailyData[dayKey] = { name: dayKey, value: 0 };
    }
    dailyData[dayKey].value += adjustedAmount;
  });

  const chartData = Object.values(dailyData).length > 0
    ? Object.values(dailyData).map((entry) => {
        runningBalance += entry.value;
        return { ...entry, value: Math.max(runningBalance, 0) };
      })
    : [
        { name: "Mon", value: 0 },
        { name: "Tue", value: 0 },
        { name: "Wed", value: 0 },
        { name: "Thu", value: 0 },
        { name: "Fri", value: 0 },
        { name: "Sat", value: 0 },
        { name: "Sun", value: 0 },
      ];

 
  const totalBalance = transactions
    .reduce((sum, t) => {
      const amount = parseFloat(t.amount.replace(/[₹\-+]/g, ""));
      return t.type === "Income" ? sum + amount : sum - amount;
    }, 0)
    .toFixed(2);


  const percentChange = transactions.length > 1 ? "+2.5%" : "0%";

  return (
    <>
      <aside className="Sidebar">
        <h2> My App </h2>
        <Navigation />

        <div className="wallet-card">
          <p>Total Balance</p>
          <h2>₹{totalBalance}</h2>
          <p>
            <span>{percentChange}</span> from last month
          </p>
          <div className="chart">
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </aside>

    </>
  );
}

export default Sidebar;
