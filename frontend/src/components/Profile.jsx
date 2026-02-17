import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import api from "../libs/axios";

export default function Profile() {

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    )

    const [user, setUser] = useState(null)

    const navigate = useNavigate()

    /* ================= FETCH USER ================= */

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/users/me");
                setUser(res.data)

            } catch (err) {
                console.log(err)
            }
        }

        fetchUser()
    }, [])

    /* ================= THEME ================= */

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
            document.documentElement.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    }, [darkMode])

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };


    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const { data } = await api.put(
                "/users/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setUser(data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div
            className="min-h-screen font-display transition-colors duration-300"
            style={{
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)"
            }}
        >

            <main className="flex-1 overflow-y-auto pb-24 ">

                {/* HEADER */}
                <Navbar title="Profile" />

                {/* PROFILE CARD */}
                <div className="px-6 mb-8 mt-8">
                    <div
                        className="relative rounded-3xl p-8 text-center overflow-hidden"
                        style={{
                            background: `linear-gradient(135deg,var(--bg-secondary),var(--bg-card),var(--bg-main))`,
                            border: "1px solid var(--border-color)"
                        }}
                    >

                        {/* Profile Image */}
                        <div className="relative group w-28 h-28 mx-auto">

                            {/* Hidden File Input */}
                            <input
                                type="file"
                                accept="image/*"
                                id="profileUpload"
                                className="hidden"
                                onChange={handleImageUpload}
                            />

                            {/* Profile Image Container */}
                            <label
                                htmlFor="profileUpload"
                                className="cursor-pointer block w-full h-full rounded-full overflow-hidden border-4 transition-all duration-300"
                                style={{
                                    borderColor: "var(--border-color)",
                                    backgroundColor: "var(--bg-card)"
                                }}
                            >

                                {user?.profileImage ? (
                                    <img
                                        src={`${import.meta.env.VITE_API_URL_image}${user.profileImage}`}
                                        alt="profile"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-5xl text-primary">
                                            person
                                        </span>
                                    </div>
                                )}

                                {/* Dark Overlay on Hover */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-2xl">
                                        edit
                                    </span>
                                </div>

                            </label>

                        </div>

                        {/* NAME */}
                        <h2 className="mt-4 text-xl font-bold">
                            {user?.name || "User"}
                        </h2>

                        {/* EMAIL */}
                        <p
                            className="text-sm mt-1"
                            style={{ color: "var(--text-muted)" }}
                        >
                            {user?.email || "No email available"}
                        </p>

                        {/* ACCOUNT NUMBER */}
                        {/* <div
                            className="mt-4 inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                            style={{
                                backgroundColor: "rgba(31,182,255,0.15)",
                                color: "#1fb6ff"
                            }}
                        >
                            Acc No: {user?.accountNumber || "0000000000"}
                        </div> */}

                    </div>
                </div>

                {/* SETTINGS */}
                <div className="px-6 space-y-8">

                    <SettingsGroup title="Account Settings">
                        <DisabledItem
                            icon="person"
                            label="Edit Profile"
                            sub="Update personal details"
                        />
                        <DisabledItem
                            icon="account_balance"
                            label="Linked Bank Accounts"
                            sub="2 accounts connected"
                        />
                    </SettingsGroup>

                    <SettingsGroup title="Preferences">
                        <DisabledItem
                            icon="payments"
                            label="Currency"
                            right={user?.currency || "INR (₹)"}
                        />
                        <ToggleItem
                            icon="dark_mode"
                            label="Theme"
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                        />

                        {/* Disabled Notification */}
                        <DisabledItem
                            icon="notifications_active"
                            label="Notifications"
                        />
                    </SettingsGroup>

                    <SettingsGroup title="Security">
                        <SettingsItem
                            icon="lock"
                            label="Change Password"
                            to="/changepassword"
                        />

                        {/* Disabled 2FA */}
                        <DisabledItem
                            icon="verified_user"
                            label="Two-factor Authentication"
                        />
                    </SettingsGroup>

                    <SettingsGroup title="Danger Zone">
                        <div
                            onClick={handleLogout}
                            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-red-500/10 transition"
                        >
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                                <span className="material-symbols-outlined">
                                    logout
                                </span>
                            </div>

                            <p className="font-semibold text-red-500">
                                Logout
                            </p>
                        </div>
                    </SettingsGroup>

                </div>

            </main>

            <Footer />
        </div>
    )
}

/* ================= COMPONENTS ================= */

function SettingsGroup({ title, children }) {
    return (
        <section>
            <h3
                className="text-sm font-bold uppercase tracking-widest mb-4 px-2"
                style={{ color: "var(--text-muted)" }}
            >
                {title}
            </h3>

            <div
                className="rounded-2xl overflow-hidden"
                style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)"
                }}
            >
                {children}
            </div>
        </section>
    )
}

function SettingsItem({ icon, label, sub, right, to }) {
    return (
        <Link
            to={to}
            className="flex items-center gap-4 p-4 hover:bg-primary/5 transition cursor-pointer"
        >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">{icon}</span>
            </div>

            <div className="flex-1">
                <p className="font-semibold">{label}</p>
                {sub && (
                    <p
                        style={{ color: "var(--text-muted)" }}
                        className="text-xs"
                    >
                        {sub}
                    </p>
                )}
            </div>

            {right && <span className="text-primary">{right}</span>}
        </Link>
    )
}
/* 🔥 DISABLED HOVER ITEM */
function DisabledItem({ icon, label }) {
    return (
        <div className="flex items-center gap-4 p-4 opacity-60 cursor-not-allowed hover:bg-gray-500/10 transition">
            <div className="w-10 h-10 rounded-xl bg-gray-400/20 text-gray-400 flex items-center justify-center">
                <span className="material-symbols-outlined">{icon}</span>
            </div>

            <div className="flex-1">
                <p className="font-semibold">{label}</p>
            </div>

            <span className="text-xs text-gray-400">
                Coming Soon
            </span>
        </div>
    )
}

function ToggleItem({ icon, label, checked, onChange }) {
    return (
        <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">{icon}</span>
            </div>

            <div className="flex-1">
                <p className="font-semibold">{label}</p>
            </div>

            <div
                onClick={onChange}
                className={`w-12 h-6 rounded-full relative flex items-center px-1 cursor-pointer transition ${checked ? "bg-primary" : "bg-gray-400"
                    }`}
            >
                <div
                    className={`w-4 h-4 bg-white rounded-full transition ${checked ? "ml-auto" : ""
                        }`}
                />
            </div>
        </div>
    )
}