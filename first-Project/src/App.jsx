import Sidebar from "./Components/Sidebar";
import Dashboard from "./Components/Dashboard";
import Transactions from "./Components/Transactions";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (newTransaction) => {
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTransaction = (id, updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t))
    );
  };

  return (
    <>
      <Sidebar transactions={transactions} />

      <Routes>
        <Route
          path="/"
          element={<Dashboard transactions={transactions} />}
        />
        <Route
          path="/transactions"
          element={
            <Transactions
              transactions={transactions}
              addTransaction={addTransaction}
              deleteTransaction={deleteTransaction}
              updateTransaction={updateTransaction}
            />
          }
        />
      </Routes>
    </>
  );
}
export default App;
