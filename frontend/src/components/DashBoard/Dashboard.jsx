import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiBox,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiBriefcase,
  FiAlertTriangle,
} from "react-icons/fi";
import "./Dashboard.css";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    loading: true,
    error: "",
    summary: {},
    lastUpdated: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          productsRes,
          assetsRes,
          expensesRes,
          incomesRes,
          liabilitiesRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/products"),
          axios.get("http://localhost:5000/api/assets"),
          axios.get("http://localhost:5000/api/expenses"),
          axios.get("http://localhost:5000/api/incomes"),
          axios.get("http://localhost:5000/api/liabilities"),
        ]);

        const processData = (
          products,
          assets,
          expenses,
          incomes,
          liabilities
        ) => ({
          products: products.length,
          assets: assets.length,
          liabilities: liabilities.length,
          income: incomes.reduce((sum, i) => sum + (i.amount || 0), 0),
          expenses: expenses.reduce((sum, e) => sum + (e.amount || 0), 0),
          netWorth:
            assets.reduce((sum, a) => sum + (a.initialValue || 0), 0) -
            liabilities.reduce((sum, l) => sum + (l.initialAmount || 0), 0),
        });

        setDashboardData({
          loading: false,
          error: "",
          lastUpdated: new Date(),
          summary: processData(
            productsRes.data?.data || [],
            assetsRes.data?.data || [],
            expensesRes.data?.data || [],
            incomesRes.data?.data || [],
            liabilitiesRes.data?.data || []
          ),
        });
      } catch (err) {
        console.error("Dashboard error:", err);
        setDashboardData((prev) => ({
          ...prev,
          loading: false,
          error:
            err.response?.data?.message || err.message || "Failed to load data",
        }));
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const SummaryCard = ({ title, value, icon, type }) => {
    const isCurrency = ["income", "expenses", "netWorth"].includes(type);
    const trend = value >= 0 ? "positive" : "negative";

    return (
      <article className={`summary-card ${type}`}>
        <header className="card-header">
          <div className="card-icon">{icon}</div>
          <h3 className="card-title">{title}</h3>
          {type === "netWorth" && (
            <div className={`trend-indicator ${trend}`}>
              {trend === "positive" ? <FiTrendingUp /> : <FiTrendingDown />}
            </div>
          )}
        </header>
        <div className="card-value">
          {isCurrency ? formatCurrency(value) : value.toLocaleString()}
          {type === "netWorth" && (
            <small className="value-subtext">
              {value >= 0 ? "Total Equity" : "Overall Deficit"}
            </small>
          )}
        </div>
      </article>
    );
  };

  if (dashboardData.loading)
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading Financial Data...</p>
      </div>
    );

  if (dashboardData.error)
    return (
      <div className="error-state">
        <div className="error-content">
          <FiAlertTriangle className="error-icon" />
          <h3>Data Load Error</h3>
          <p>{dashboardData.error}</p>
          <button
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Refresh Dashboard
          </button>
        </div>
      </div>
    );

  return (
    <main className="dashboard-container">
      <header className="dashboard-header">
        <h1>Business Financial Overview</h1>
        {dashboardData.lastUpdated && (
          <p className="update-time">
            Last updated: {dashboardData.lastUpdated.toLocaleDateString()} at{" "}
            {dashboardData.lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </header>

      <section className="metrics-grid">
        <SummaryCard
          title="Inventory Items"
          value={dashboardData.summary.products}
          icon={<FiBox />}
          type="inventory"
        />
        <SummaryCard
          title="Net Position"
          value={dashboardData.summary.netWorth}
          icon={<FiDollarSign />}
          type="netWorth"
        />
        <SummaryCard
          title="YTD Revenue"
          value={dashboardData.summary.income}
          icon={<FiTrendingUp />}
          type="income"
        />
        <SummaryCard
          title="YTD Expenditure"
          value={dashboardData.summary.expenses}
          icon={<FiTrendingDown />}
          type="expense"
        />
        <SummaryCard
          title="Capital Assets"
          value={dashboardData.summary.assets}
          icon={<FiBriefcase />}
          type="asset"
        />
        <SummaryCard
          title="Outstanding Liabilities"
          value={dashboardData.summary.liabilities}
          icon={<FiAlertTriangle />}
          type="liability"
        />
      </section>
    </main>
  );
};

export default Dashboard;
