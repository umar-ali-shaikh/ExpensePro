import Navbar from "../components/Navbar"
import { NoRecentTransactions, Transaction } from "../components/NoUniversal"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import api from "../libs/axios";

export default function StatsPage() {

    const [transactions, setTransactions] = useState([])
    const [targets, setTargets] = useState([])
    const [userName, setUserName] = useState("User")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [transactionsRes, userRes, targetsRes] = await Promise.all([
                    api.get("/transactions"),
                    api.get("/users/me"),
                    api.get("/targets"),
                ]);

                setTransactions(transactionsRes.data || []);
                setUserName(userRes.data?.name || "User");
                setTargets(targetsRes.data || []);

            } catch (err) {
                console.log(err.response?.data || err.message);
            }
        };

        fetchData();
    }, []);

    /* ================= MONTHLY FILTER ================= */

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const monthlyTransactions = transactions.filter(t => {
        const date = new Date(t.createdAt)
        return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
        )
    })

    const monthlyIncome = monthlyTransactions
        .filter(t => Number(t.amount) > 0)
        .reduce((acc, t) => acc + Number(t.amount), 0)

    const monthlyExpense = monthlyTransactions
        .filter(t => Number(t.amount) < 0)
        .reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0)

    const availableBalance = monthlyIncome - monthlyExpense

    /* ================= RECENT 2 TRANSACTIONS ================= */

    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 2)

    return (
        <div
            className="min-h-screen font-display flex flex-col transition-colors duration-300"
            style={{
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)"
            }}
        >

            <Navbar title="Financial Overview" />

            <main className="flex-1 p-6 space-y-10 max-w-6xl mx-auto w-full">

                {/* HERO */}
                <section>
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold">
                            Good Morning, {userName}
                        </h2>
                        <p
                            className="mt-2 font-medium"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Here's what's happening with your money today.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <DashboardCard
                            title="Monthly Income"
                            amount={`₹${monthlyIncome.toFixed(2)}`}
                            icon="trending_up"
                            color="green"
                        />

                        <DashboardCard
                            title="Monthly Expenses"
                            amount={`₹${monthlyExpense.toFixed(2)}`}
                            icon="trending_down"
                            color="red"
                        />

                        <DashboardCard
                            title="Available Balance"
                            amount={`₹${availableBalance.toFixed(2)}`}
                            icon="account_balance_wallet"
                            color="blue"
                        />

                    </div>
                </section>

                {/* CHART SECTION */}
                <section className="grid md:grid-cols-2 gap-6">
                    <CategoryBreakdown transactions={transactions} />
                    <IncomeVsExpense transactions={transactions} />
                </section>

                {/* TARGET INSIGHTS */}
                <section>
                    <DailyInsights targets={targets} />
                </section>

                {/* RECENT ACTIVITY */}
                <section className="pb-20">

                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Recent Activity</h3>
                        <Link
                            to="/transactions"
                            className="text-primary text-sm font-semibold"
                        >
                            View All
                        </Link>
                    </div>

                    {recentTransactions.length === 0 ? (
                        <NoRecentTransactions />
                    ) : (
                        <div className="space-y-4">
                            {recentTransactions.map((t) => (
                                <Transaction
                                    key={t._id}
                                    _id={t._id}
                                    title={t.title}
                                    category={t.category}
                                    date={new Date(t.createdAt).toLocaleDateString()}
                                    amount={t.amount}
                                    income={Number(t.amount) > 0}
                                />
                            ))}
                        </div>
                    )}

                </section>

            </main>

        </div>
    )
}

/* ================= DASHBOARD CARD ================= */

function DashboardCard({ title, amount, icon, color, percent, button }) {

    const colors = {
        green: "#22c55e",
        red: "#ef4444",
        blue: "#13b6ec"
    }

    return (
        <div
            className="rounded-2xl p-6 flex flex-col justify-between transition-transform hover:scale-[1.02]"
            style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                boxShadow: `0 0 30px ${colors[color]}15`
            }}
        >

            <div className="flex justify-between items-start mb-8">

                <div
                    className="p-3 rounded-xl"
                    style={{
                        backgroundColor: `${colors[color]}20`,
                        color: colors[color]
                    }}
                >
                    <span className="material-symbols-outlined text-3xl">
                        {icon}
                    </span>
                </div>

                {percent && (
                    <span
                        className="text-sm font-bold px-3 py-1 rounded-lg"
                        style={{
                            color: colors[color],
                            backgroundColor: `${colors[color]}20`
                        }}
                    >
                        {percent}
                    </span>
                )}

            </div>

            <div>
                <p
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--text-muted)" }}
                >
                    {title}
                </p>
                <h3 className="text-3xl font-extrabold">
                    {amount}
                </h3>
            </div>

            {button && (
                <div
                    className="mt-6 pt-4"
                    style={{ borderTop: "1px solid var(--border-color)" }}
                >
                    <button className="w-full bg-primary text-black font-bold py-2 rounded-lg text-sm hover:opacity-90 transition">
                        Manage Wallet
                    </button>
                </div>
            )}

        </div>
    )
}


function Legend({ color, label, value }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <div>
                <p>{label}</p>
                <p className="font-bold">{value}</p>
            </div>
        </div>
    )
}

/* ================= CATEGORY BREAKDOWN ================= */

function CategoryBreakdown({ transactions }) {

    // 🔥 Only Expenses
    const expenses = transactions.filter(t => t.amount < 0)

    const categoryTotals = {}

    expenses.forEach(t => {
        const category = t.category || "Others"
        categoryTotals[category] =
            (categoryTotals[category] || 0) + Math.abs(Number(t.amount))
    })

    const totalSpent = Object.values(categoryTotals)
        .reduce((a, b) => a + b, 0)

    const colors = [
        "#3b82f6",
        "#22c55e",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#14b8a6"
    ]

    const categories = Object.keys(categoryTotals)

    // 🔥 Create Conic Gradient Dynamically
    let start = 0
    const gradientParts = categories.map((cat, i) => {
        const value = categoryTotals[cat]
        const percent = (value / totalSpent) * 100
        const end = start + percent
        const part = `${colors[i % colors.length]} ${start}% ${end}%`
        start = end
        return part
    })

    return (
        <div
            className="rounded-2xl p-6"
            style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)"
            }}
        >
            <h3 className="font-bold text-lg mb-6">Category Breakdown</h3>

            {totalSpent === 0 ? (
                <p style={{ color: "var(--text-muted)" }}>
                    No expense data yet
                </p>
            ) : (
                <div className="flex flex-col items-center">

                    <div className="relative w-48 h-48 mb-6">

                        <div
                            className="w-full h-full rounded-full"
                            style={{
                                background: `conic-gradient(${gradientParts.join(",")})`
                            }}
                        />

                        <div
                            className="absolute inset-6 rounded-full flex flex-col items-center justify-center"
                            style={{ backgroundColor: "var(--bg-card)" }}
                        >
                            <span
                                className="text-xs"
                                style={{ color: "var(--text-muted)" }}
                            >
                                SPENT
                            </span>
                            <h2 className="text-2xl font-bold">
                                ₹{totalSpent.toFixed(2)}
                            </h2>
                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-6 text-sm">
                        {categories.map((cat, i) => (
                            <Legend
                                key={cat}
                                color={colors[i % colors.length]}
                                label={cat}
                                value={`₹${categoryTotals[cat].toFixed(2)}`}
                            />
                        ))}
                    </div>

                </div>
            )}
        </div>
    )
}



/* ================= INCOME VS EXPENSE ================= */

function IncomeVsExpense({ transactions }) {

    // 🔥 Current Month Filter
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const monthlyTransactions = transactions.filter(t => {
        const date = new Date(t.date)
        return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
        )
    })

    // 🔥 4 Weeks Structure
    const weeks = [
        { week: "W1", income: 0, expense: 0 },
        { week: "W2", income: 0, expense: 0 },
        { week: "W3", income: 0, expense: 0 },
        { week: "W4", income: 0, expense: 0 }
    ]

    monthlyTransactions.forEach(t => {
        const day = new Date(t.date).getDate()

        // Determine week number
        const weekIndex =
            day <= 7 ? 0 :
                day <= 14 ? 1 :
                    day <= 21 ? 2 : 3

        if (t.amount > 0) {
            weeks[weekIndex].income += Number(t.amount)
        } else {
            weeks[weekIndex].expense += Math.abs(Number(t.amount))
        }
    })

    // 🔥 Find max for scaling
    const max = Math.max(
        ...weeks.map(w => Math.max(w.income, w.expense)),
        1
    )

    return (
        <div
            className="rounded-2xl p-6 flex flex-col justify-between"
            style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)"
            }}
        >
            <h3 className="font-bold text-lg mb-6">
                Income vs Expense
            </h3>

            <div className="flex items-end justify-between h-48">

                {weeks.map((w, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">

                        <div className="flex gap-2 items-end h-36">

                            {/* Income Bar */}
                            <div
                                className="w-4 rounded transition-all duration-500"
                                style={{
                                    height: `${(w.income / max) * 100}%`,
                                    backgroundColor: "#22c55e"
                                }}
                            />

                            {/* Expense Bar */}
                            <div
                                className="w-4 rounded transition-all duration-500"
                                style={{
                                    height: `${(w.expense / max) * 100}%`,
                                    backgroundColor: "#ef4444"
                                }}
                            />

                        </div>

                        <span
                            className="text-xs"
                            style={{ color: "var(--text-muted)" }}
                        >
                            {w.week}
                        </span>

                    </div>
                ))}

            </div>
        </div>
    )
}


/* ================= TRANSACTION ITEM ================= */

function TransactionItem({ title, category, amount, income, expense }) {

    return (
        <div
            className="rounded-xl p-4 flex items-center justify-between"
            style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)"
            }}
        >
            <div>
                <p className="font-bold">{title}</p>
                <p
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                >
                    {category}
                </p>
            </div>

            <p
                className="font-bold"
                style={{
                    color: income
                        ? "#22c55e"
                        : expense
                            ? "#ef4444"
                            : "var(--text-main)"
                }}
            >
                {amount}
            </p>
        </div>
    )
}


/* ================= DAILY INSIGHTS ================= */

function DailyInsights({ targets }) {

    if (!targets.length) {
        return (
            <div className="space-y-4">
                <h3 className="font-bold text-lg">Daily Insights</h3>
                <p style={{ color: "var(--text-muted)" }}>
                    No financial targets set yet.
                </p>
            </div>
        )
    }

    const incomeTarget = targets.find(t => t.type === "income")
    const budgetTargets = targets.filter(t => t.type === "budget")

    return (
        <div className="space-y-4">

            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Target Insights</h3>
                <Link
                    to="/financialtargets"
                    className="text-primary text-sm font-semibold"
                >
                    View All
                </Link>
            </div>

            {/* 🔥 Income Target Insight */}
            {incomeTarget && (
                <InsightCard
                    icon="trending_up"
                    title="Income Target"
                    text={
                        incomeTarget.achieved >= incomeTarget.amount
                            ? `Great! Income target achieved 🎉`
                            : `₹${incomeTarget.achieved} of ₹${incomeTarget.amount} achieved so far.`
                    }
                    color="#22c55e"
                />
            )}

            {/* 🔥 Budget Warnings */}
            {budgetTargets.map((target) => {

                const percent = (target.achieved / target.amount) * 100

                return (
                    <InsightCard
                        key={target._id}
                        icon="account_balance_wallet"
                        title={`${target.category} Budget`}
                        text={
                            percent >= 100
                                ? `Budget exceeded! Overspent in ${target.category}.`
                                : percent >= 80
                                    ? `Warning! ${percent.toFixed(0)}% used in ${target.category}.`
                                    : `₹${target.achieved} of ₹${target.amount} used.`
                        }
                        color={
                            percent >= 100
                                ? "#ef4444"
                                : percent >= 80
                                    ? "#f59e0b"
                                    : "#3b82f6"
                        }
                    />
                )
            })}

        </div>
    )
}

function InsightCard({ icon, title, text, color }) {

    return (
        <div
            className="rounded-xl p-4 flex items-center justify-between"
            style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)"
            }}
        >
            <div className="flex items-center gap-4">

                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                        backgroundColor: `${color}20`,
                        color: color
                    }}
                >
                    <span className="material-symbols-outlined">
                        {icon}
                    </span>
                </div>

                <div>
                    <p className="font-semibold">{title}</p>
                    <p
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                    >
                        {text}
                    </p>
                </div>

            </div>

            <span className="material-symbols-outlined opacity-50">
                chevron_right
            </span>
        </div>
    )
}