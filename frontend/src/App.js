import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import ViewAssets from "./components/Assets/ViewAssets";
import AddAsset from "./components/Assets/AddAsset";
import EditAsset from "./components/Assets/EditAsset";
import ViewLiabilities from "./components/Liablities/ViewLiabilities";
import EditLiabilities from "./components/Liablities/EditLiabilities";
import AddLiability from "./components/Liablities/AddLiablities";
import ViewIncomes from "./components/Incomes/ViewIncomes";
import AddIncomes from "./components/Incomes/AddIncomes";
import EditIncomes from "./components/Incomes/EditIncomes";
import ViewExpenses from "./components/Expenses/ViewExpenses";
import AddExpenses from "./components/Expenses/AddExpenses";
import EditExpenses from "./components/Expenses/EditExpenses";
import ViewProducts from "./components/Products/ViewProducts";
import EditProducts from "./components/Products/EditProducts";
import AddProducts from "./components/Products/AddProducts";
import Dashboard from "./components/DashBoard/Dashboard";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assets" element={<ViewAssets />} />
            <Route path="/add-asset" element={<AddAsset />} />
            <Route path="/edit-asset/:id" element={<EditAsset />} />
            <Route path="/liabilities" element={<ViewLiabilities />} />
            <Route path="/edit-liability/:id" element={<EditLiabilities />} />
            <Route path="/add-liability" element={<AddLiability />} />
            <Route path="/incomes" element={<ViewIncomes />} />
            <Route path="/add-income" element={<AddIncomes />} />
            <Route path="/edit-income/:id" element={<EditIncomes />} />
            <Route path="/expenses" element={<ViewExpenses />} />
            <Route path="/add-expense" element={<AddExpenses />} />
            <Route path="/edit-expense/:id" element={<EditExpenses />} />
            <Route path="/products" element={<ViewProducts />} />
            <Route path="/add-product" element={<AddProducts />} />
            <Route path="/edit-product/:id" element={<EditProducts />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
