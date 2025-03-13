import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./EditProducts.css";

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: "",
    category: "dairy",
    price: 0,
    quantity: 0,
    description: "",
    expiryDate: "",
    brand: "",
    nutritionalInfo: {
      calories: 0,
      allergens: [],
    },
    storageCondition: "room temperature",
    barcode: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );

        const productData = data.data || data;

        setFormState({
          ...productData,
          expiryDate: productData.expiryDate.split("T")[0],
          nutritionalInfo: {
            calories: productData.nutritionalInfo?.calories || 0,
            allergens: productData.nutritionalInfo?.allergens || [],
          },
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Failed to load product details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("nutritionalInfo.")) {
      const field = name.split(".")[1];
      setFormState((prev) => ({
        ...prev,
        nutritionalInfo: {
          ...prev.nutritionalInfo,
          [field]: field === "allergens" ? value.split(",") : value,
        },
      }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, formState);
      navigate("/products", {
        state: { message: "Product updated successfully" },
      });
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
    <div className="edit-product-container">
      <div className="form-card">
        <header className="form-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="arrow-icon">←</span>
            Back to Products
          </button>
          <h1 className="form-title">Edit Product</h1>
        </header>

        <form onSubmit={handleFormSubmit} className="product-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="input-label">Product Name</label>
              <input
                className="form-input"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Category</label>
              <select
                className="form-input"
                name="category"
                value={formState.category}
                onChange={handleInputChange}
                required
              >
                <option value="dairy">Dairy</option>
                <option value="produce">Produce</option>
                <option value="bakery">Bakery</option>
                <option value="meat">Meat</option>
                <option value="frozen">Frozen</option>
                <option value="pantry">Pantry</option>
                <option value="beverages">Beverages</option>
                <option value="household">Household</option>
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Price ($)</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                min="0.01"
                name="price"
                value={formState.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Quantity</label>
              <input
                className="form-input"
                type="number"
                min="0"
                name="quantity"
                value={formState.quantity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Expiry Date</label>
              <input
                className="form-input"
                type="date"
                name="expiryDate"
                value={formState.expiryDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Brand</label>
              <input
                className="form-input"
                name="brand"
                value={formState.brand}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="input-label">Storage Condition</label>
              <select
                className="form-input"
                name="storageCondition"
                value={formState.storageCondition}
                onChange={handleInputChange}
                required
              >
                <option value="room temperature">Room Temperature</option>
                <option value="refrigerated">Refrigerated</option>
                <option value="frozen">Frozen</option>
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Barcode</label>
              <input
                className="form-input"
                name="barcode"
                value={formState.barcode}
                onChange={handleInputChange}
                required
                pattern="[0-9]{12,13}"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Calories</label>
              <input
                className="form-input"
                type="number"
                name="nutritionalInfo.calories"
                value={formState.nutritionalInfo.calories}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="input-label">Allergens (comma separated)</label>
              <input
                className="form-input"
                name="nutritionalInfo.allergens"
                value={formState.nutritionalInfo.allergens.join(",")}
                onChange={handleInputChange}
                placeholder="e.g., milk, nuts"
              />
            </div>

            <div className="form-group full-width">
              <label className="input-label">Description</label>
              <textarea
                className="form-input"
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                maxLength="200"
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

export default EditProducts;
