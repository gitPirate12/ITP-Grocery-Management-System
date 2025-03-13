import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ViewIncomes.css";

const ViewIncomes = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchIncomes = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/incomes");
      setIncomes(data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch incomes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      try {
        await axios.delete(`http://localhost:5000/api/incomes/${id}`);
        setIncomes((prev) => prev.filter((income) => income._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || "Delete operation failed");
      }
    }
  };

  const handleEdit = (id) => navigate(`/edit-income/${id}`);
  const handleAdd = () => navigate("/add-income");

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Incomes...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <div className="error-content">
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchIncomes}>
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="income-management">
      <header className="income-header">
        <div className="header-content">
          <h1 className="page-title">Income Records</h1>
          <p className="income-count">{incomes.length} entries listed</p>
        </div>
        <button className="add-income-btn" onClick={handleAdd}>
          <svg className="plus-icon" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Add Income
        </button>
      </header>

      <div className="content-container">
        {incomes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💰</div>
            <h3>No Income Records Found</h3>
            <p>Start by adding your first income entry</p>
            <button className="add-income-btn" onClick={handleAdd}>
              Add Income
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="income-table">
              <thead>
                <tr>
                  {[
                    "Title",
                    "Amount",
                    "Date",
                    "Category",
                    "Payment Type",
                    "Description",
                    "Actions",
                  ].map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {incomes.map((income) => (
                  <tr key={income._id}>
                    <td data-label="Title" className="income-title">
                      {income.title}
                    </td>
                    <td data-label="Amount">
                      ${Number(income.amount).toFixed(2)}
                    </td>
                    <td data-label="Date">
                      {new Date(income.date).toLocaleDateString()}
                    </td>
                    <td data-label="Category">
                      <span className="income-category">{income.category}</span>
                    </td>
                    <td data-label="Payment Type">{income.paymentType}</td>
                    <td data-label="Description">
                      {income.description || "-"}
                    </td>
                    <td data-label="Actions" className="actions-cell">
                      <button
                        className="icon-btn edit-btn"
                        onClick={() => handleEdit(income._id)}
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                      </button>
                      <button
                        className="icon-btn delete-btn"
                        onClick={() => handleDelete(income._id)}
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewIncomes;
