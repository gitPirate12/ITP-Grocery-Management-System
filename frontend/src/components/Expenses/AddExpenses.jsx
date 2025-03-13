import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddExpenses.css";

const AddExpenses = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "utilities",
    paymentType: "cash",
    description: "",
    date: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        date: new Date(formData.date).toISOString(),
      };

      await axios.post("http://localhost:5000/api/expenses", payload);
      navigate("/expenses");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-expense-container">
      <div className="form-card">
        <header className="form-header">
          <button className="back-btn" onClick={() => navigate("/expenses")}>
            <span className="arrow-icon">←</span>
            Back to Expenses
          </button>
          <h1 className="form-title">Add New Expense</h1>
        </header>

        <form onSubmit={handleSubmit} className="expense-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label className="input-label">Title</label>
              <input
                className="form-input"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength="30"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Amount ($)</label>
              <input
                className="form-input"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Category</label>
              <select
                className="form-input"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="utilities">Utilities</option>
                <option value="rent">Rent</option>
                <option value="supplies">Supplies</option>
                <option value="travel">Travel</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Payment Type</label>
              <select
                className="form-input"
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
                required
              >
                <option value="cash">Cash</option>
                <option value="card">Credit/Debit Card</option>
                <option value="transfer">Bank Transfer</option>
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Date</label>
              <input
                className="form-input"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Description</label>
              <textarea
                className="form-input"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                maxLength="50"
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/expenses")}
            >
              Cancel
            </button>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Adding...
                </>
              ) : (
                "Add Expense"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenses;
