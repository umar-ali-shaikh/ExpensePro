import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import axios from "axios"
import Footer from "./Footer"

export default function Navbar({ title = "Dashboard" }) {

  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)

  // ✅ Theme
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark"
  })

  useEffect(() => {
    const root = document.documentElement

    if (darkMode) {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  // ✅ Fetch User (for profile image)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await axios.get(
          "http://localhost:5000/api/users/me",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        setUser(res.data)

      } catch (error) {
        console.log(error)
      }
    }

    fetchUser()
  }, [])

  return (
    <>
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />

          <div
            className="relative w-72 p-6 shadow-2xl border-r"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-color)",
              color: "var(--text-main)"
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold">ExpensePro</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <SidebarItem
                icon="dashboard"
                label="Dashboard"
                to="/dashboard"
                active={location.pathname === "/dashboard"}
              />

              <SidebarItem
                icon="list_alt"
                label="Transactions"
                to="/transactions"
                active={location.pathname === "/transactions"}
              />

              <SidebarItem
                icon="analytics"
                label="Stats"
                to="/stats"
                active={location.pathname === "/stats"}
              />

              <SidebarItem
                icon="insights"
                label="Insights"
                to="/financialtargets"
                active={location.pathname === "/financialtargets"}
              />

              {/* ✅ ADD THIS */}
              <SidebarItem
                icon="person"
                label="Profile"
                to="/profile"
                active={location.pathname === "/profile"}
              />
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header
        className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between backdrop-blur-md border-b"
        style={{
          backgroundColor: "var(--bg-main)",
          borderColor: "var(--border-color)",
          color: "var(--text-main)"
        }}
      >
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)}>
            <span className="material-symbols-outlined">menu</span>
          </button>

          <h1 className="text-xl font-bold">{title}</h1>
        </div>

        <div className="flex items-center gap-4">

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(prev => !prev)}
            style={{ color: "var(--text-muted)" }}
          >
            <span className="material-symbols-outlined">
              {darkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {/* ✅ Dynamic Profile Image */}
          <Link to="/profile">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-primary shadow-sm">

              {user?.profileImage ? (
                <img
                  src={`http://localhost:5000${user.profileImage}`}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}

            </div>
          </Link>

        </div>
      </header>

      <Footer />
    </>
  )
}

function SidebarItem({ icon, label, to, active }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 px-4 py-3 rounded-xl"
      style={{
        backgroundColor: active ? "rgba(19,182,236,0.15)" : "transparent",
        color: active ? "rgb(19,182,236)" : "var(--text-main)"
      }}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  )
}