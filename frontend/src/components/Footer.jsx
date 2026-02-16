import { useLocation, Link, useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Footer() {
    const location = useLocation()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    return (
        <div className="relative">

            {/* Bottom Navigation */}
            <nav
                className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t px-10 py-4 flex items-center justify-between"
                style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-main)"
                }}
            >
                <NavItem
                    to="/dashboard"
                    icon="home"
                    label="Home"
                    active={location.pathname === "/dashboard"}
                />

                {/* Floating Plus Button + Dropup */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">

                    {/* Dropup Menu */}
                    {open && (
                        <div
                            className="absolute bottom-16 left-1/2 -translate-x-1/2 w-60 rounded-xl shadow-xl border backdrop-blur-xl p-3 space-y-2"
                            style={{
                                backgroundColor: "var(--bg-card)",
                                borderColor: "var(--border-color)"
                            }}
                        >
                            <button
                                onClick={() => {
                                    navigate("/addTransaction")
                                    setOpen(false)
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition"
                            >
                                <span className="material-symbols-outlined text-sm">
                                    receipt_long
                                </span>
                                Add Transaction
                            </button>

                            <button
                                onClick={() => {
                                    navigate("/financialtargets/add")
                                    setOpen(false)
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition"
                            >
                                <span className="material-symbols-outlined text-sm">
                                    insights
                                </span>
                                Add Insights
                            </button>
                        </div>
                    )}

                    {/* Plus Button */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition hover:scale-105"
                        style={{
                            backgroundColor: "#1fb6ff",
                            color: "#fff"
                        }}
                    >
                        <span className="material-symbols-outlined text-3xl">
                            {open ? "close" : "add"}
                        </span>
                    </button>
                </div>

                <NavItem
                    to="/transactions"
                    icon="history"
                    label="History"
                    active={location.pathname === "/transactions"}
                />

                <NavItem
                    to="/stats"
                    icon="pie_chart"
                    label="Stats"
                    active={location.pathname === "/stats"}
                />

                <NavItem
                    to="/profile"
                    icon="person"
                    label="Profile"
                    active={location.pathname === "/profile"}
                />
            </nav>
        </div>
    )
}

function NavItem({ icon, label, active, to }) {
    return (
        <Link
            to={to}
            className="flex flex-col items-center gap-1 cursor-pointer transition"
            style={{
                color: active ? "#1fb6ff" : "var(--text-muted)"
            }}
        >
            <span className="material-symbols-outlined text-2xl">
                {icon}
            </span>

            <span className="text-[10px] font-bold tracking-wider uppercase">
                {label}
            </span>
        </Link>
    )
}