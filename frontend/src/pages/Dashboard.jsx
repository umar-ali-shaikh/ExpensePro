import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { NoRecentTransactions, Transaction } from "../components/NoUniversal";
import { useEffect, useState } from "react";
import api from "../libs/axios";
import { Link } from "react-router-dom";

function Bar({ value, max }) {
  const height = max === 0 ? 0 : (value / max) * 160;
  const highlight = value === max && value !== 0;

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
  );
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions");

        // 100% Safe
        if (Array.isArray(res.data)) {
          setTransactions(res.data);
        } else if (Array.isArray(res.data?.transactions)) {
          setTransactions(res.data.transactions);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.log("API Error:", error.response?.data || error.message);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // ================= SAFE DATA =================
  const safeTransactions = Array.isArray(transactions)
    ? transactions
    : [];

  // ================= TOTAL BALANCE =================
  const totalBalance = safeTransactions.reduce(
    (acc, t) => acc + Number(t?.amount || 0),
    0
  );

  // ================= WEEKLY SPENDING =================
  const weeklyTotals = [0, 0, 0, 0, 0, 0, 0];

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  safeTransactions.forEach((t) => {
    if (!t?.createdAt) return;

    const txnDate = new Date(t.createdAt);

    if (txnDate >= startOfWeek && Number(t.amount) < 0) {
      const day = txnDate.getDay();
      weeklyTotals[day] += Math.abs(Number(t.amount));
    }
  });

  const max = Math.max(...weeklyTotals, 0);

  // ================= RECENT =================
  const recent = safeTransactions.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

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

        {/* TOTAL BALANCE */}
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
            </div>
          </div>
        </section>

        {/* WEEKLY SPENDING */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Weekly Spending</h3>
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
          </div>
        </section>

        {/* RECENT */}
        <section>
          <h3 className="text-xl font-bold mb-6">
            Recent Transactions
          </h3>

          {recent.length === 0 ? (
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
  );
}