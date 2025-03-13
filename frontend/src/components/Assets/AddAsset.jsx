import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddAsset.css";

const AddAsset = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemCode: "",
    name: "",
    assetType: "other",
    purchaseDate: "",
    initialValue: "",
    residualValue: "",
    usefulLifeYears: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        initialValue: Number(formData.initialValue),
        residualValue: Number(formData.residualValue),
        usefulLifeYears: Number(formData.usefulLifeYears),
      };

      await axios.post("http://localhost:5000/api/assets", payload);
      navigate("/assets");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-asset-container">
      <div className="form-card">
        <header className="form-header">
          <button className="back-btn" onClick={() => navigate("/assets")}>
            <span className="arrow-icon">←</span>
            Back to Assets
          </button>
          <h1 className="form-title">Add New Asset</h1>
        </header>

        <form onSubmit={handleSubmit} className="asset-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label className="input-label">Item Code</label>
              <input
                className="form-input"
                type="text"
                name="itemCode"
                value={formData.itemCode}
                onChange={handleChange}
                required
                maxLength={10}
              />
            </div>

            <div className="form-group">
              <label className="input-label">Asset Name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={30}
              />
            </div>

            <div className="form-group">
              <label className="input-label">Asset Type</label>
              <select
                className="form-input"
                name="assetType"
                value={formData.assetType}
                onChange={handleChange}
                required
              >
                <option value="equipment">Equipment</option>
                <option value="property">Property</option>
                <option value="vehicle">Vehicle</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Purchase Date</label>
              <input
                className="form-input"
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Initial Value ($)</label>
              <input
                className="form-input"
                type="number"
                name="initialValue"
                value={formData.initialValue}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Residual Value ($)</label>
              <input
                className="form-input"
                type="number"
                name="residualValue"
                value={formData.residualValue}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Useful Life (Years)</label>
              <input
                className="form-input"
                type="number"
                name="usefulLifeYears"
                value={formData.usefulLifeYears}
                onChange={handleChange}
                required
                min="1"
                max="100"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/assets")}
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
                "Add Asset"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAsset;
