import { useState } from "react";
import "./css/Transactions.css";

function TransactionForm({ addTransaction, onClose }) {
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");

  // Auto-detect type based on amount
  const numAmount = parseFloat(amount);
  const detectedType = numAmount < 0 ? "Expense" : "Income";

  const handleSubmit = () => {
    if (!date || !description || !amount) return;

    const absAmount = Math.abs(numAmount).toString();

    const newTransaction = {
      id: Date.now(),
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      category: detectedType === "Income" ? "Income" : category,
      description,
      type: detectedType,
      amount: detectedType === "Income" ? `+₹${absAmount}` : `-₹${absAmount}`,
    };

    addTransaction(newTransaction);
    if (onClose) onClose();
    setCategory("Food");
    setDescription("");
    setDate("");
    setAmount("");
  };

  return (
    <div className="transaction-form">
      <h2>Add Transaction</h2>

      <div className="form-grid">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {detectedType === "Expense" && (
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Food</option>
            <option>Grocery</option>
            <option>Transport</option>
            <option>Other</option>
          </select>
        )}

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button type="button" onClick={handleSubmit} className="save-btn">
        Save Transactions
      </button>
    </div>
  );
}

export default TransactionForm;
