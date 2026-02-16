import { Routes, Route, Navigate } from "react-router-dom"
import "./App.css"
import { Toaster } from "react-hot-toast"

import Login from "./pages/loginPage"
import Register from "./pages/RegisterPage"
import Dashboard from "./pages/Dashboard"
import Profile from "./components/Profile"
import TransactionsHistory from "./pages/Transactions"
import StatsPage from "./pages/StatsPage"
import AddTransaction from "./components/AddTransaction"

import ProtectedRoute from "./components/ProtectedRoute"
// import { Transaction } from "./components/NoUniversal"
import Transactions from "./pages/Transactions"
import EditTransaction from "./components/EditTransaction"
import FinancialTargets from "./pages/FinancialTargets"
import SetFinancialTargetModal from "./components/SetFinancialTargetModal"
import ChangePassword from "./components/ChangePassword"

const App = () => {
  const savedTheme = localStorage.getItem("theme")

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark")
  }


  return (

    <>

      <Toaster position="top-right" toastOptions={{ style: { background: "#192d33", color: "#fff", border: "1px solid #325a67" } }} />

      <Routes>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <StatsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addTransaction"
          element={
            <ProtectedRoute>
              <AddTransaction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editTransaction/:id"
          element={
            <ProtectedRoute>
              <EditTransaction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/financialtargets"
          element={
            <ProtectedRoute>
              <FinancialTargets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/financialtargets/add"
          element={
            <ProtectedRoute>
              <SetFinancialTargetModal />
            </ProtectedRoute>
          }
        />

        <Route
          path="/financialtargets/edit/:id"
          element={
            <ProtectedRoute>
              <SetFinancialTargetModal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/changepassword"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-20 text-3xl">
              404 Not Found
            </h1>
          }
        />
      </Routes>

    </>
  )
}

export default App