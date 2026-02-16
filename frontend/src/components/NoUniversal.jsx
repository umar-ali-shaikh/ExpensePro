import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom"
import { FiEdit } from "react-icons/fi"

export function EmptyState() {

    const navigate = useNavigate()

    return (
        <div
            className="min-h-screen transition-colors duration-300"
            style={{
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)"
            }}
        >

            <Navbar title="Transactions" />


            <div className="flex flex-col items-center justify-center text-center py-20">

                {/* Icon Circle Glow */}
                <div className="relative mb-8">

                    {/* Outer Glow */}
                    <div className="absolute inset-0 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />

                    {/* Middle Circle */}
                    <div className="relative w-32 h-32 rounded-full bg-[#0f2026] flex items-center justify-center border border-white/5">

                        {/* Inner Square */}
                        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                            <span className="material-symbols-outlined text-white text-4xl">
                                account_balance_wallet
                            </span>
                        </div>

                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-3">
                    No transactions yet
                </h2>

                {/* Subtitle */}
                <p className="text-slate-400 max-w-sm mb-8">
                    Start tracking your spending by adding your first transaction.
                </p>

                {/* Button */}
                <button
                    onClick={() => navigate("/addTransaction")}
                    className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2 transition active:scale-95"
                >
                    <span className="material-symbols-outlined text-lg">
                        add
                    </span>
                    Add Transaction
                </button>

            </div>
        </div>
    )
}


export function NoRecentTransactions() {
    const navigate = useNavigate()

    return (
        <div className="w-full flex justify-center py-16">

            <div
                className="w-full max-w-3xl rounded-2xl border border-dashed p-12 text-center relative"
                style={{
                    borderColor: "rgba(19,182,236,0.3)",
                    background: "rgba(19,182,236,0.03)"
                }}
            >

                {/* Icon Wrapper */}
                <div className="flex justify-center mb-6">
                    <div className="relative">

                        {/* Icon Box */}
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
                            <span className="material-symbols-outlined text-primary text-3xl">
                                receipt_long
                            </span>
                        </div>

                        {/* Small Notification Dot */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary border-2 border-[#0f1f24]" />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-2 text-white">
                    No recent transactions
                </h3>

                {/* Subtitle */}
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                    Your latest spending and income will appear here once you start tracking.
                </p>

                {/* Button */}
                <button
                    onClick={() => navigate("/addTransaction")}
                    className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-primary/20 inline-flex items-center gap-2 transition active:scale-95"
                >
                    <span className="material-symbols-outlined text-lg">
                        add_circle
                    </span>
                    Add Transaction
                </button>

            </div>
        </div>
    )
}


/* ---------------- TRANSACTION CARD ---------------- */

export function Transaction({ _id, title, category, date, amount, income }) {
    const navigate = useNavigate()

    return (
        <div
            className="relative group flex justify-between items-center p-5 rounded-2xl transition-all duration-200 hover:scale-[1.01]"
            style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
            }}
        >

            {/* EDIT ICON */}
            <button
                onClick={() => navigate(`/editTransaction/${_id}`)}
                className="absolute -top-3 -right-3
                   w-7 h-7
                   rounded-full
                   flex items-center justify-center
                   shadow-md
                   opacity-0
                   group-hover:opacity-100
                   transition-all duration-300
                   hover:scale-110"
                style={{
                    backgroundColor: "rgb(19,182,236)",
                    color: "#fff"
                }}
            >
                <FiEdit size={14} />
            </button>

            <div>
                <h4 className="font-semibold text-lg">{title}</h4>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {date} • {category}
                </p>
            </div>

            <div className="text-right">
                <p
                    className="font-bold text-lg"
                    style={{
                        color: income ? "#10b981" : "#f97316",
                    }}
                >
                    {income ? `+₹${amount}` : `-₹${Math.abs(amount)}`}
                </p>

                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {income ? "Income" : "Expense"}
                </span>
            </div>
        </div>
    )
}