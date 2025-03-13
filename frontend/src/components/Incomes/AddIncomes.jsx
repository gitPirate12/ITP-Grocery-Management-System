import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddIncomes.css";

const AddIncomes = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "salary",
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

      await axios.post("http://localhost:5000/api/incomes", payload);
      navigate("/incomes");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add income");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-income-container">
      <div className="form-card">
        <header className="form-header">
          <button className="back-btn" onClick={() => navigate("/incomes")}>
            <span className="arrow-icon">←</span>
            Back to Incomes
          </button>
          <h1 className="form-title">Add New Income</h1>
        </header>

        <form onSubmit={handleSubmit} className="income-form">
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
                maxLength={50}
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
                min="0.01"
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
                <option value="salary">Salary</option>
                <option value="freelance">Freelance</option>
                <option value="investment">Investment</option>
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
                <option value="bank-transfer">Bank Transfer</option>
                <option value="check">Check</option>
                <option value="other">Other</option>
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
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/incomes")}
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
                "Add Income"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncomes;
