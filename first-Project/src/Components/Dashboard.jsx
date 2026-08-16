import "./css/Dashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function Dashboard({ transactions }) {
  const totalSpent = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => {
      const amount = parseFloat(t.amount.replace(/[₹\-+]/g, ""));
      return sum + amount;
    }, 0);

  const categoryExpenses = {};
  transactions
    .filter((t) => t.type === "Expense" && t.category !== "Income")
    .forEach((t) => {
      const amount = parseFloat(t.amount.replace(/[₹\-+]/g, ""));
      categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + amount;
    });

  const topCategory = Object.keys(categoryExpenses).length > 0
    ? Object.entries(categoryExpenses).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )
    : ["No data", 0];

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Generate lineData - Income vs Expense by month
  const monthlyData = {};
  transactions.forEach((t) => {
    const date = new Date(t.date);
    const monthKey = `${date.toLocaleString("en-US", { month: "short" })} ${date.getFullYear()}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { month: monthKey, income: 0, expense: 0 };
    }
    
    const amount = parseFloat(t.amount.replace(/[₹\-+]/g, ""));
    if (t.type === "Income") {
      monthlyData[monthKey].income += amount;
    } else {
      monthlyData[monthKey].expense += amount;
    }
  });

  const lineData = Object.values(monthlyData).length > 0
    ? Object.values(monthlyData)
    : [{ month: "No Data", income: 0, expense: 0 }];

  // Generate pieData - Expense breakdown by category
  const pieData = Object.entries(categoryExpenses).map(([category, value]) => ({
    name: category,
    value: Math.round(value),
  }));

  const COLORS = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#FF9F40",
    "#C9CBCF",
    "#FF6B6B",
    "#4ECDC4",
  ];

  return (
    <>
      <div className="Dashboard">
        <h1>My Dashboard</h1>
        <div className="dashboard-content">
          <div className="summary-card">
            Total Spent (This month)
            <h2>₹ {totalSpent.toFixed(2)}</h2>
          </div>
          <div className="dashboard-right-cards">
            <div className="summary-card">
              <div>
                Top Category
                <h3>{topCategory[0]} (₹{topCategory[1].toFixed(2)})</h3>
              </div>
            </div>
            <div className="summary-card">
              <div>
                Total Income
                <h3>₹ {transactions
                  .filter((t) => t.type === "Income")
                  .reduce((sum, t) => {
                    const amount = parseFloat(t.amount.replace(/[₹\-+]/g, ""));
                    return sum + amount;
                  }, 0)
                  .toFixed(2)}</h3>
              </div>
            </div>
            <div className="summary-card">
              <div>
                Total Transactions
                <h3>{transactions.length}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <div className="line-chart">
            <h2>Income vs Expense</h2>
            {lineData.length > 0 && lineData[0].month !== "No Data" ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: 250,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#999",
                }}
              >
                No transaction data available
              </div>
            )}
          </div>

          <div className="pie-chart">
            <h2>Expense Breakdown</h2>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    label={({ name }) => `${name}`}
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
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
            ) : (
              <div
                style={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#999",
                }}
              >
                No expense data available
              </div>
            )}
          </div>
        </div>

        <div className="transactions">
          <h2>Recent Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", color: "#999" }}>
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
export default Dashboard;
