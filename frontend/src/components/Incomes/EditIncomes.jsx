import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./EditIncomes.css";

const EditIncomes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "salary",
    paymentType: "cash",
    description: "",
    date: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/incomes/${id}`
        );
        setFormData({
          ...data,
          date: data.date.split("T")[0],
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load income details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIncome();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        date: new Date(formData.date).toISOString(),
      };

      await axios.put(`http://localhost:5000/api/incomes/${id}`, payload);
      navigate("/incomes", {
        state: { message: "Income updated successfully" },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update income");
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
          <button
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="edit-income-container">
      <div className="form-card">
        <header className="form-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="arrow-icon">←</span>
            Back to Incomes
          </button>
          <h1 className="form-title">Edit Income</h1>
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
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIncomes;
