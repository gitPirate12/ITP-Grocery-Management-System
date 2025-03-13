import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ViewExpenses.css";

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      console.log("Fetching expenses...");
      const response = await axios.get("http://localhost:5000/api/expenses");
      console.log("API Response:", response);

      const expensesData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setExpenses(expensesData);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch expenses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axios.delete(`http://localhost:5000/api/expenses/${id}`);
        setExpenses((prev) => prev.filter((expense) => expense._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || "Delete operation failed");
      }
    }
  };

  const handleEdit = (id) => navigate(`/edit-expense/${id}`);
  const handleAdd = () => navigate("/add-expense");

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Expenses...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <div className="error-content">
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchExpenses}>
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="expense-management">
      <header className="expense-header">
        <div className="header-content">
          <h1 className="page-title">Expense Records</h1>
          <p className="expense-count">{expenses.length} entries listed</p>
        </div>
        <button className="add-expense-btn" onClick={handleAdd}>
          <svg className="plus-icon" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Add Expense
        </button>
      </header>

      <div className="content-container">
        {expenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💸</div>
            <h3>No Expense Records Found</h3>
            <p>Start by adding your first expense entry</p>
            <button className="add-expense-btn" onClick={handleAdd}>
              Add Expense
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="expense-table">
              <thead>
                <tr>
                  {[
                    "Title",
                    "Amount",
                    "Category",
                    "Date",
                    "Payment Type",
                    "Description",
                    "Actions",
                  ].map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td data-label="Title" className="expense-title">
                      {expense.title}
                    </td>
                    <td data-label="Amount">
                      ${Number(expense.amount).toFixed(2)}
                    </td>
                    <td data-label="Category">
                      <span className="expense-category">
                        {expense.category}
                      </span>
                    </td>
                    <td data-label="Date">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td data-label="Payment Type">{expense.paymentType}</td>
                    <td data-label="Description">
                      {expense.description || "-"}
                    </td>
                    <td data-label="Actions" className="actions-cell">
                      <button
                        className="icon-btn edit-btn"
                        onClick={() => handleEdit(expense._id)}
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                      </button>
                      <button
                        className="icon-btn delete-btn"
                        onClick={() => handleDelete(expense._id)}
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

export default ViewExpenses;
