import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);


  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      )

      localStorage.setItem("token", res.data.token)

      toast.success("Login Successful 🎉")

      setTimeout(() => {
        navigate("/dashboard")
      }, 1000)

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed ❌"
      )
    }
  }

  return (
    <div className="dark bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4 bg-mesh font-display">
      <div className="w-full max-w-[440px]">

        {/* Brand Section */}
        <div className="text-center mb-10">
          <div className="inline-flex brand-Section items-center justify-center p-3 rounded-xl bg-primary/10 mb-4">
            <span className="material-symbols-outlined text-[#13b6ec] react-icons text-5xl">
              account_balance_wallet
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Expense<span className="text-primary">Pro</span>
          </h1>

          <p className="text-[#92bbc9] text-base">
            Simplify your personal finances today
          </p>
        </div>

        {/* Authentication Card */}
        <div className="auth-card bg-white dark:bg-[#192d33] border border-slate-200 dark:border-[#325a67]/30 rounded-xl p-8 transition-all">

          <form className="space-y-6" onSubmit={handleLogin}>

            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 ml-1"
              >
                Email Address
              </label>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 dark:text-[#92bbc9] text-[20px] group-focus-within:text-primary transition-colors">
                    mail
                  </span>
                </div>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#101d22] border border-slate-200 dark:border-[#325a67] rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">

              <div className="flex items-center justify-between px-1">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Password
                </label>
              </div>

              <div className="relative group">

                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 dark:text-[#92bbc9] text-[20px] group-focus-within:text-primary transition-colors">
                    lock
                  </span>
                </div>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-[#101d22] border border-slate-200 dark:border-[#325a67] rounded-lg text-slate-900 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-[#92bbc9] hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>

              <div className="flex justify-end pt-1">
                <a
                  href="#"
                  className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-primary hover:bg-primary/90 text-[#101d22] font-bold rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              Log In to Dashboard
              <span className="material-symbols-outlined text-[20px]">
                login
              </span>
            </button>

          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-[#325a67]/50"></span>
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-[#192d33] px-4 text-slate-500 dark:text-[#92bbc9] font-semibold tracking-widest">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Button */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const res = await axios.post(
                      "http://localhost:5000/api/auth/google",
                      { credential: credentialResponse.credential }
                    );

                    localStorage.setItem("token", res.data.token);
                    toast.success("Google Login Successful 🎉");

                    setTimeout(() => {
                      navigate("/dashboard");
                    }, 1000);

                  } catch (err) {
                    console.error("Login Failed:", err);
                    toast.error("Google Login Failed ❌");
                  }
                }}
                onError={() => {
                  console.log("Google Login Failed");
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
          New to ExpensePro?
          <Link to="/register" className="text-primary font-bold hover:underline ml-1">
            Create an account
          </Link>
        </p>

        {/* Legal Links */}
        <div className="mt-12 flex items-center justify-center gap-6 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          <a href="#" className="hover:text-primary transition-colors">
            Privacy
          </a>
          <span className="size-1 bg-slate-400 dark:bg-slate-700 rounded-full"></span>
          <a href="#" className="hover:text-primary transition-colors">
            Terms
          </a>
          <span className="size-1 bg-slate-400 dark:bg-slate-700 rounded-full"></span>
          <a href="#" className="hover:text-primary transition-colors">
            Support
          </a>
        </div>

      </div>
    </div>
  );
}