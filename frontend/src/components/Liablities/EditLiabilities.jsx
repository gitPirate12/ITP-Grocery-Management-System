import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./EditLiabilities.css";

const EditLiability = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLiability = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/liabilities/${id}`
        );
        setFormData({
          ...data.data,
          startDate: data.data.startDate.split("T")[0],
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load liability details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLiability();
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
        initialAmount: Number(formData.initialAmount),
        interestRate: Number(formData.interestRate),
        termYears: Number(formData.termYears),
      };

      await axios.put(`http://localhost:5000/api/liabilities/${id}`, payload);
      navigate("/liabilities", {
        state: { message: "Liability updated successfully" },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update liability");
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
    <div className="edit-liability-container">
      <div className="form-card">
        <header className="form-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="arrow-icon">←</span>
            Back to Liabilities
          </button>
          <h1 className="form-title">Edit Liability</h1>
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
                className="form-input"
                type="number"
                name="initialAmount"
                value={formData.initialAmount}
                onChange={handleChange}
                required
                step="0.01"
                min="0.01"
              />
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

export default EditLiability;
