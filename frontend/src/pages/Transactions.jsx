import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
import { EmptyState, Transaction } from "../components/NoUniversal"
import useTransactions from "../hooks/useTransactions"

export default function Transactions() {
  const { transactions, fetchTransactions } = useTransactions()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.refresh) {
      fetchTransactions()
      navigate(location.pathname, { replace: true })
    }
  }, [location.state, fetchTransactions, navigate, location.pathname])

  const [activeFilter, setActiveFilter] = useState("all")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [advancedType, setAdvancedType] = useState(null)
  const [customAmount, setCustomAmount] = useState("")

  const filteredTransactions = transactions.filter((t) => {
    if (activeFilter === "income" && t.amount < 0) return false
    if (activeFilter === "expense" && t.amount > 0) return false

    if (advancedType === "big" && Math.abs(t.amount) < 100) return false
    if (advancedType === "small" && Math.abs(t.amount) >= 100) return false
    if (
      advancedType === "custom" &&
      customAmount &&
      Math.abs(t.amount) < Number(customAmount)
    )
      return false

    return true
  })

  if (transactions.length === 0) {
    return <EmptyState onAdd={() => navigate("/addTransaction")} />
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-main)",
      }}
    >
      <Navbar title="Transactions" />

      <main className="px-6 py-8 max-w-3xl mx-auto">

        {/* FILTER TABS */}
        <div
          className="flex p-1 rounded-xl w-fit mb-6"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <FilterButton
            active={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          >
            All
          </FilterButton>

          <FilterButton
            active={activeFilter === "income"}
            onClick={() => setActiveFilter("income")}
          >
            Income
          </FilterButton>

          <FilterButton
            active={activeFilter === "expense"}
            onClick={() => setActiveFilter("expense")}
          >
            Expense
          </FilterButton>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 text-sm ml-2"
            style={{ color: "var(--text-muted)" }}
          >
            Advanced
          </button>
        </div>

        {/* ADVANCED FILTER */}
        {showAdvanced && (
          <div
            className="mb-6 p-4 rounded-xl space-y-4"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div className="flex gap-4">
              <button
                onClick={() => setAdvancedType("big")}
                style={{ color: "var(--text-muted)" }}
              >
                Big (&gt;100)
              </button>

              <button
                onClick={() => setAdvancedType("small")}
                style={{ color: "var(--text-muted)" }}
              >
                Small (&lt;100)
              </button>
            </div>

            <input
              type="number"
              placeholder="Custom Minimum Amount"
              value={customAmount}
              onChange={(e) => {
                setAdvancedType("custom")
                setCustomAmount(e.target.value)
              }}
              className="w-full p-2 rounded-lg"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-main)",
              }}
            />
          </div>
        )}

        {/* TRANSACTIONS LIST */}
        <div className="space-y-4">
          {filteredTransactions.map((t) => (
            <Transaction
              key={t._id}
              _id={t._id}
              title={t.title}
              category={t.category}
              date={new Date(t.date).toLocaleDateString()}
              amount={t.amount}
              income={t.amount > 0}
            />
          ))}
        </div>

      </main>
    </div>
  )
}

/* ---------------- FILTER BUTTON ---------------- */

function FilterButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
      style={{
        backgroundColor: active ? "rgb(19,182,236)" : "transparent",
        color: active ? "#fff" : "var(--text-muted)",
      }}
    >
      {children}
    </button>
  )
}

