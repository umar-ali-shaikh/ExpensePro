import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [show, setShow] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [strength, setStrength] = useState({
        text: "",
        width: "0%",
        color: "bg-gray-600",
    });

    const checkStrength = (password) => {
        let score = 0;
        if (password.length > 6) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 1)
            setStrength({ text: "Weak", width: "25%", color: "bg-red-500" });
        else if (score === 2)
            setStrength({ text: "Medium", width: "50%", color: "bg-orange-500" });
        else if (score === 3)
            setStrength({ text: "Good", width: "75%", color: "bg-yellow-400" });
        else
            setStrength({
                text: "Strong Password",
                width: "100%",
                color: "bg-green-500",
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (name === "newPassword") checkStrength(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.newPassword !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const res = await axios.put(
                "http://localhost:5000/api/users/change-password",
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.forceLogout) {
                alert(res.data.message);

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");
            }

        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#081422] to-[#0d1b34] px-4">
            <div className="w-full max-w-md bg-[#111c36] rounded-2xl p-8 shadow-2xl border border-white/10">

                <h2 className="text-white text-2xl font-semibold mb-2">
                    Change Password
                </h2>

                <p className="text-gray-400 text-sm mb-6">
                    Your new password must be different from previous used passwords
                    to ensure your account remains secure.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Current Password */}
                    <div>
                        <label className="text-gray-400 text-sm block mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={show.current ? "text" : "password"}
                                name="currentPassword"
                                value={form.currentPassword}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#0f1f3d] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShow({ ...show, current: !show.current })
                                }
                                className="absolute right-3 top-3 text-gray-400"
                            >
                                {show.current ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="text-gray-400 text-sm block mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={show.new ? "text" : "password"}
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#0f1f3d] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShow({ ...show, new: !show.new })}
                                className="absolute right-3 top-3 text-gray-400"
                            >
                                {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Strength Bar */}
                        <div className="h-2 w-full bg-[#0f1f3d] rounded-full mt-3 overflow-hidden">
                            <div
                                className={`h-full ${strength.color} transition-all duration-300`}
                                style={{ width: strength.width }}
                            ></div>
                        </div>

                        <p className="text-xs mt-1 text-gray-400">
                            {strength.text}
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-gray-400 text-sm block mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={show.confirm ? "text" : "password"}
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#0f1f3d] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShow({ ...show, confirm: !show.confirm })
                                }
                                className="absolute right-3 top-3 text-gray-400"
                            >
                                {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 transition-all py-3 rounded-lg text-white font-semibold"
                    >
                        Update Password
                    </button>

                    <p className="text-center text-gray-500 text-sm cursor-pointer hover:text-gray-300">
                        Cancel and go back
                    </p>

                </form>
            </div>
        </div>
    );
}