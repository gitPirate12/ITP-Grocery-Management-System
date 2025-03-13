import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ViewLiabilities.css";

const ViewLiabilities = () => {
  const [liabilities, setLiabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiabilities = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/liabilities"
        );
        setLiabilities(data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load liabilities");
      } finally {
        setLoading(false);
      }
    };

    fetchLiabilities();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this liability?")) {
      try {
        await axios.delete(`http://localhost:5000/api/liabilities/${id}`);
        setLiabilities((prev) =>
          prev.filter((liability) => liability._id !== id)
        );
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete liability");
      }
    }
  };

  const handleEdit = (id) => navigate(`/edit-liability/${id}`);
  const handleAdd = () => navigate("/add-liability");

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Liabilities...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <div className="error-content">
          <h3>Something went wrong</h3>
          <p>{error}</p>
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
    <div className="liability-management">
      <header className="liability-header">
        <div className="header-content">
          <h1 className="page-title">Liabilities</h1>
          <p className="liability-count">{liabilities.length} items listed</p>
        </div>
        <button className="add-liability-btn" onClick={handleAdd}>
          <svg className="plus-icon" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Add Liability
        </button>
      </header>

      <div className="content-container">
        {liabilities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📑</div>
            <h3>No Liabilities Found</h3>
            <p>Start by adding your first liability</p>
            <button className="add-liability-btn" onClick={handleAdd}>
              Add Liability
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="liability-table">
              <thead>
                <tr>
                  {[
                    "Item Code",
                    "Name",
                    "Type",
                    "Start Date",
                    "Amount",
                    "Interest Rate",
                    "Term (Years)",
                    "Actions",
                  ].map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {liabilities.map((liability) => (
                  <tr key={liability._id}>
                    <td data-label="Item Code">{liability.itemCode}</td>
                    <td data-label="Name" className="liability-name">
                      {liability.name}
                    </td>
                    <td data-label="Type">
                      <span className="liability-type">
                        {liability.liabilityType}
                      </span>
                    </td>
                    <td data-label="Start Date">
                      {new Date(liability.startDate).toLocaleDateString()}
                    </td>
                    <td data-label="Amount">
                      ${Number(liability.initialAmount).toFixed(2)}
                    </td>
                    <td data-label="Interest Rate">
                      {liability.interestRate}%
                    </td>
                    <td data-label="Term (Years)">{liability.termYears}</td>
                    <td data-label="Actions" className="actions-cell">
                      <button
                        className="icon-btn edit-btn"
                        onClick={() => handleEdit(liability._id)}
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                      </button>
                      <button
                        className="icon-btn delete-btn"
                        onClick={() => handleDelete(liability._id)}
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

export default ViewLiabilities;
