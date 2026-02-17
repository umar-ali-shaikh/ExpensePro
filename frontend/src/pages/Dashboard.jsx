import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { NoRecentTransactions, Transaction } from "../components/NoUniversal"
import { useEffect, useState } from "react"
import api from "../libs/axios"
import { Link } from "react-router-dom"

function Bar({ value, max }) {
  const height = max === 0 ? 0 : (value / max) * 160
  const highlight = value === max && value !== 0

  return (
    <div className="flex flex-col items-center justify-end w-12 h-44 relative">
      <div
        className="w-full rounded-2xl transition-all duration-700 ease-out"
        style={{
          height: `${height}px`,
          background: highlight
            ? "linear-gradient(180deg, #38bdf8 0%, #0ea5e9 100%)"
            : "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
          boxShadow: highlight
            ? "0 0 15px rgba(56,189,248,0.6)"
            : "none"
        }}
      />
    </div>
  )
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions");

        setTransactions(Array.isArray(res.data) ? res.data : []);

      } catch (error) {
        console.log(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  /* ================= TOTAL BALANCE ================= */

  const totalBalance = Array.isArray(transactions)
    ? transactions.reduce((acc, t) => acc + Number(t.amount), 0)
    : 0;

  /* ================= WEEKLY SPENDING ================= */

  const weeklyTotals = [0, 0, 0, 0, 0, 0, 0]

  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  transactions.forEach((t) => {
    const txnDate = new Date(t.createdAt)

    if (txnDate >= startOfWeek && Number(t.amount) < 0) {
      const day = txnDate.getDay()
      weeklyTotals[day] += Math.abs(Number(t.amount))
    }
  })

  const max = Math.max(...weeklyTotals)

  /* ================= RECENT ================= */

  const recent = transactions.slice(0, 5)

  return (
    <div
      className="min-h-screen font-display transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-main)"
      }}
    >
      <Navbar />

      <main className="p-6 space-y-12 max-w-6xl mx-auto mb-20">

        {/* ================= BALANCE CARD ================= */}
        <section>
          <div
            className="rounded-[32px] p-10 shadow-xl"
            style={{
              background:
                "linear-gradient(135deg, var(--bg-secondary), var(--bg-card))",
              border: "1px solid var(--border-color)"
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p
                  className="text-xs uppercase tracking-widest font-semibold mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Total Balance
                </p>

                <h2 className="text-5xl font-extrabold">
                  ₹{totalBalance.toFixed(2)}
                </h2>
              </div>

              <div
                className="px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2"
                style={{
                  backgroundColor:
                    totalBalance >= 0
                      ? "rgba(16,185,129,0.15)"
                      : "rgba(239,68,68,0.15)",
                  color: totalBalance >= 0 ? "#10b981" : "#ef4444"
                }}
              >
                <span className="material-symbols-outlined text-sm">
                  {totalBalance >= 0 ? "trending_up" : "trending_down"}
                </span>
                {totalBalance >= 0 ? "Positive" : "Negative"}
              </div>
            </div>
          </div>
        </section>

        {/* ================= MONTHLY SPENDING ================= */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Monthly Spending</h3>
            <Link to="/stats"
              className="text-sm cursor-pointer"
              style={{ color: "#38bdf8" }}
            >
              View Analytics
            </Link>
          </div>

          <div
            className="rounded-[32px] p-10"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)"
            }}
          >
            <div className="flex justify-between items-end gap-6">
              {weeklyTotals.map((value, index) => (
                <Bar key={index} value={value} max={max} />
              ))}
            </div>

            <div
              className="flex justify-between mt-8 text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </section>

        {/* ================= RECENT ================= */}
        <section>
          <h3 className="text-xl font-bold mb-6">
            Recent Transactions
          </h3>

          {loading ? (
            <p>Loading...</p>
          ) : recent.length === 0 ? (
            <NoRecentTransactions />
          ) : (
            <div className="space-y-4">
              {recent.map((t) => (
                <Transaction
                  key={t._id}
                  _id={t._id}
                  title={t.title}
                  category={t.category}
                  date={new Date(t.createdAt).toLocaleDateString()}
                  amount={t.amount}
                  income={t.amount > 0}
                />
              ))}
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  )
}