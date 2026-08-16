import "./css/Transactions.css";
import { useState } from "react";
import React from "react";
import TransactionForm from "./TransactionForm";

function Transactions({ transactions: initialTransactions, addTransaction: onAddTransaction, deleteTransaction, updateTransaction }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [type, setType] = useState("All Types");
  const [date, setDate] = useState("All Dates");

  const [showform, setShowform] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleAddNew = () => {
    setEditingTransaction(null);
    setShowform(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowform(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
    }
  };

  const addTransaction = (newTransaction) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, newTransaction);
      setEditingTransaction(null);
    } else {
      onAddTransaction(newTransaction);
    }
    setShowform(false);
  };

  React.useEffect(() => {
    if (showform) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showform]);

  const filteredTransactions = [...(initialTransactions || [])]
    .filter((item) => {
      const matchesSearch =
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase()) ||
        item.amount.toString().toLowerCase().includes(search.toLowerCase()) ||
        item.date.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All Categories" || item.category === category;

      const matchesType = type === "All Types" || item.type === type;

      const matchesDate = date === "All Dates" || item.date.includes(date);

      return matchesSearch && matchesCategory && matchesType && matchesDate;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  
  const uniqueDates = Array.from(
    new Set((initialTransactions || []).map((t) => t.date))
  ).sort((a, b) => new Date(b) - new Date(a));

 
  const uniqueCategories = Array.from(
    new Set(
      (initialTransactions || [])
        .filter((t) => t.category !== "Income")
        .map((t) => t.category)
    )
  ).sort();

  return (
    <>
      {showform && (
        <div className="modal-overlay" onClick={() => setShowform(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowform(false)}
            >
              ×
            </button>
            <TransactionForm
              addTransaction={addTransaction}
              onClose={() => setShowform(false)}
              editingTransaction={editingTransaction}
            />
          </div>
        </div>
      )}
      <div className="Dashboard transactions-page">
        <div className="payment-section">
          <h2>Transactions</h2>
          <p>View and manage all your income and expenses</p>
          <button onClick={handleAddNew}>+ Add Transactions</button>
        </div>
        <div className="toolbar">
          <div className="search-box">
            <input
              type="text"
              placeholder=" 🔍︎ Search Transactions"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="button">Search</button>
          </div>

          <div className="filter">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>All Categories</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option>All Types</option>
              <option>Income</option>
              <option>Expense</option>
            </select>
            <select value={date} onChange={(e) => setDate(e.target.value)}>
              <option>All Dates</option>
              {uniqueDates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="list">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.category}</td>
                <td>{item.description}</td>
                <td>
                  <span
                    className={
                      item.type === "Income"
                        ? "type-badge income"
                        : "type-badge expense"
                    }
                  >
                    {item.type}
                  </span>
                </td>
                <td>
                  <span
                    className={
                      item.type === "Income"
                        ? "amount-badge income"
                        : "amount-badge expense"
                    }
                  >
                    {item.amount}
                  </span>
                </td>
                <td className="actions">
                  <button className="edt-btn" onClick={() => handleEdit(item)}>✏️</button>
                  <button className="dlt-btn" onClick={() => handleDelete(item.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
}

export default Transactions;
