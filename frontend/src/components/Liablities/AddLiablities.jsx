import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddLiabilities.css";

const AddLiabilities = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemCode: "",
    name: "",
    liabilityType: "loan",
    startDate: "",
    initialAmount: "",
    interestRate: "",
    termYears: "",
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
        initialAmount: Number(formData.initialAmount),
        interestRate: Number(formData.interestRate),
        termYears: Number(formData.termYears),
      };

      await axios.post("http://localhost:5000/api/liabilities", payload);
      navigate("/liabilities");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add liability");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-liability-container">
      <div className="form-card">
        <header className="form-header">
          <button className="back-btn" onClick={() => navigate("/liabilities")}>
            <span className="arrow-icon">←</span>
            Back to Liabilities
          </button>
          <h1 className="form-title">Add New Liability</h1>
        </header>

        <form onSubmit={handleSubmit} className="liability-form">
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
              <label className="input-label">Name</label>
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
              <label className="input-label">Liability Type</label>
              <select
                className="form-input"
                name="liabilityType"
                value={formData.liabilityType}
                onChange={handleChange}
                required
              >
                <option value="loan">Loan</option>
                <option value="mortgage">Mortgage</option>
                <option value="credit">Credit</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Start Date</label>
              <input
                className="form-input"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Initial Amount ($)</label>
              <input
                className={`form-input ${
                  formData.initialAmount <= 0 ? "input-error" : ""
                }`}
                type="number"
                name="initialAmount"
                value={formData.initialAmount}
                onChange={handleChange}
                required
                min="0.01"
                step="0.01"
              />
              {formData.initialAmount <= 0 && (
                <span className="error-text">Must be a positive number</span>
              )}
            </div>

            <div className="form-group">
              <label className="input-label">Interest Rate (%)</label>
              <input
                className="form-input"
                type="number"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleChange}
                required
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Term (Years)</label>
              <input
                className="form-input"
                type="number"
                name="termYears"
                value={formData.termYears}
                onChange={handleChange}
                required
                min="1"
                max="50"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/liabilities")}
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
                "Add Liability"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLiabilities;
