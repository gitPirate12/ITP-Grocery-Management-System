import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./EditAsset.css";

const EditAsset = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    itemCode: "",
    name: "",
    assetType: "",
    purchaseDate: "",
    initialValue: "",
    residualValue: "",
    usefulLifeYears: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/assets/${id}`
        );
        setFormState({
          ...data.data,
          purchaseDate: data.data.purchaseDate.split("T")[0],
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load asset details");
      } finally {
        setLoading(false);
      }
    };

    fetchAssetData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/assets/${id}`, formState);
      navigate("/assets", { state: { message: "Asset updated successfully" } });
    } catch (err) {
      setError(
        err.response?.data?.message || "Update failed. Please try again."
      );
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
          <button className="retry-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );

  return (
    <div className="edit-asset-container">
      <div className="form-card">
        <header className="form-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="arrow-icon">←</span>
            Back to Assets
          </button>
          <h1 className="form-title">Edit Asset</h1>
        </header>

        <form onSubmit={handleFormSubmit} className="asset-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="input-label">Item Code</label>
              <input
                className="form-input"
                name="itemCode"
                value={formState.itemCode}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Asset Name</label>
              <input
                className="form-input"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Asset Type</label>
              <input
                className="form-input"
                name="assetType"
                value={formState.assetType}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Purchase Date</label>
              <input
                className="form-input"
                type="date"
                name="purchaseDate"
                value={formState.purchaseDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Initial Value ($)</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                name="initialValue"
                value={formState.initialValue}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Residual Value ($)</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                name="residualValue"
                value={formState.residualValue}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Useful Life (Years)</label>
              <input
                className="form-input"
                type="number"
                name="usefulLifeYears"
                value={formState.usefulLifeYears}
                onChange={handleInputChange}
                required
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

export default EditAsset;
