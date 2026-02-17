import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../libs/axios"
import toast from "react-hot-toast"

export default function Register() {

  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", data.token);

      toast.success("Account created successfully 🎉");

      navigate("/dashboard");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center p-4 register-body">

      <div className="w-full max-w-[480px] bg-white dark:bg-[#192d33] p-8 md:p-10 rounded-xl shadow-2xl border border-slate-200 dark:border-[#325a67]/30">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl mb-4">
            <span className="material-symbols-outlined text-primary text-4xl">
              payments
            </span>
          </div>
          <h2 className="text-white text-2xl font-extrabold tracking-tight">
            ExpensePro
          </h2>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">
            Create your account
          </h1>
          <p className="text-[#92bbc9]">
            Start managing your finances today
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleRegister}>

          <InputField
            icon="person"
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <InputField
            icon="mail"
            label="Email Address"
            placeholder="name@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            icon="lock"
            label="Password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <InputField
            icon="lock_reset"
            label="Confirm Password"
            placeholder="••••••••"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 bg-accent-green text-white font-bold text-lg h-14 rounded-lg shadow-lg flex items-center justify-center gap-2 transition 
              ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-green-600"}
            `}
          >
            {loading ? (
              <>
                <span className="animate-spin material-symbols-outlined">
                  progress_activity
                </span>
                Creating...
              </>
            ) : (
              <>
                Create Account
                <span className="material-symbols-outlined">
                  arrow_forward
                </span>
              </>
            )}
          </button>

        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[#325a67]/30 text-center">
          <p className="text-[#92bbc9] text-sm">
            Already have an account?
            <Link
              to="/login"
              className="text-primary font-bold ml-1 underline"
            >
              Log in
            </Link>
          </p>
        </div>

      </div>

      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-green rounded-full blur-[120px]" />
      </div>

    </div>
  )
}

/* Reusable Input Component */
function InputField({ icon, label, placeholder, type = "text", value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium px-1">
        {label}
      </label>

      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#92bbc9] text-[20px]">
          {icon}
        </span>

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#325a67] bg-[#111e22] focus:border-primary h-14 placeholder:text-[#5c7f8a] pl-12 pr-4 text-base"
        />
      </div>
    </div>
  )
}