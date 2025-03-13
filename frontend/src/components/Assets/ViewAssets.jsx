import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ViewAssets.css";

const ViewAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchAssets = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/assets");
      setAssets(data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch assets"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      try {
        await axios.delete(`http://localhost:5000/api/assets/${id}`);
        setAssets((prev) => prev.filter((asset) => asset._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || "Delete operation failed");
      }
    }
  };

  const handleEdit = (id) => navigate(`/edit-asset/${id}`);
  const handleAdd = () => navigate("/add-asset");

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Assets...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <div className="error-content">
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchAssets}>
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="asset-management">
      <header className="asset-header">
        <div className="header-content">
          <h1 className="page-title">Assets</h1>
          <p className="asset-count">{assets.length} items listed</p>
        </div>
        <button className="add-asset-btn" onClick={handleAdd}>
          <svg className="plus-icon" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Add Asset
        </button>
      </header>

      <div className="content-container">
        {assets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>No Assets Found</h3>
            <p>Start by adding your first asset</p>
            <button className="add-asset-btn" onClick={handleAdd}>
              Add Asset
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="asset-table">
              <thead>
                <tr>
                  {[
                    "Item Code",
                    "Name",
                    "Type",
                    "Purchase Date",
                    "Initial Value",
                    "Residual Value",
                    "Useful Life",
                    "Actions",
                  ].map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset._id}>
                    <td data-label="Item Code">{asset.itemCode}</td>
                    <td data-label="Name" className="asset-name">
                      {asset.name}
                    </td>
                    <td data-label="Type">
                      <span className="asset-type">{asset.assetType}</span>
                    </td>
                    <td data-label="Purchase Date">
                      {new Date(asset.purchaseDate).toLocaleDateString()}
                    </td>
                    <td data-label="Initial Value">
                      ${Number(asset.initialValue).toFixed(2)}
                    </td>
                    <td data-label="Residual Value">
                      ${Number(asset.residualValue).toFixed(2)}
                    </td>
                    <td data-label="Useful Life">
                      {asset.usefulLifeYears} years
                    </td>
                    <td data-label="Actions" className="actions-cell">
                      <button
                        className="icon-btn edit-btn"
                        onClick={() => handleEdit(asset._id)}
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                      </button>
                      <button
                        className="icon-btn delete-btn"
                        onClick={() => handleDelete(asset._id)}
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

export default ViewAssets;
