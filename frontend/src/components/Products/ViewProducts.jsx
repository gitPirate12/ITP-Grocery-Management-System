import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ViewProducts.css";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      console.log("API Response:", response.data);

      const productsData = response.data?.data || [];

      setProducts(productsData);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setProducts((prev) => prev.filter((product) => product._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || "Delete operation failed");
      }
    }
  };

  const handleEdit = (id) => navigate(`/edit-product/${id}`);
  const handleAdd = () => navigate("/add-product");

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Products...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <div className="error-content">
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchProducts}>
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="product-management">
      <header className="product-header">
        <div className="header-content">
          <h1 className="page-title">Product Inventory</h1>
          <p className="product-count">{products.length} items listed</p>
        </div>
        <button className="add-product-btn" onClick={handleAdd}>
          <svg className="plus-icon" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Add Product
        </button>
      </header>

      <div className="content-container">
        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No Products Found</h3>
            <p>Start by adding your first product</p>
            <button className="add-product-btn" onClick={handleAdd}>
              Add Product
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="product-table">
              <thead>
                <tr>
                  {[
                    "Name",
                    "Category",
                    "Price",
                    "Quantity",
                    "Expiry Date",
                    "Brand",
                    "Storage",
                    "Barcode",
                    "Actions",
                  ].map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const safeProduct = {
                    _id: product._id || "",
                    name: product.name || "Unnamed Product",
                    category: product.category || "uncategorized",
                    price: Number(product.price) || 0,
                    quantity: product.quantity ?? "-",
                    expiryDate: product.expiryDate || null,
                    brand: product.brand || "-",
                    storageCondition: product.storageCondition || "unknown",
                    barcode: product.barcode || "N/A",
                  };

                  return (
                    <tr key={safeProduct._id}>
                      <td data-label="Name" className="product-name">
                        {safeProduct.name}
                      </td>
                      <td data-label="Category">
                        <span className="product-category">
                          {safeProduct.category}
                        </span>
                      </td>
                      <td data-label="Price">
                        ${safeProduct.price.toFixed(2)}
                      </td>
                      <td data-label="Quantity">{safeProduct.quantity}</td>
                      <td data-label="Expiry Date">
                        {safeProduct.expiryDate
                          ? new Date(
                              safeProduct.expiryDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td data-label="Brand">{safeProduct.brand}</td>
                      <td data-label="Storage" className="storage-condition">
                        {safeProduct.storageCondition.replace(/\b\w/g, (l) =>
                          l.toUpperCase()
                        )}
                      </td>
                      <td data-label="Barcode">{safeProduct.barcode}</td>
                      <td data-label="Actions" className="actions-cell">
                        <button
                          className="icon-btn edit-btn"
                          onClick={() => handleEdit(safeProduct._id)}
                        >
                          <svg viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                          </svg>
                        </button>
                        <button
                          className="icon-btn delete-btn"
                          onClick={() => handleDelete(safeProduct._id)}
                        >
                          <svg viewBox="0 0 24 24">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProducts;
