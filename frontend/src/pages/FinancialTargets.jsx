import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import api from "../libs/axios";

const FinancialTargets = () => {
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      const { data } = await api.get("/targets");
      setTargets(data || []);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setTargets([]);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercent = (achieved = 0, total = 0) => {
    const a = Number(achieved);
    const t = Number(total);
    if (!t) return 0;
    return Math.min((a / t) * 100, 100);
  };

  const incomeTarget = targets.find(t => t.type === "income");
  const budgetTargets = targets.filter(t => t.type === "budget");

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg-main)", color: "var(--text-main)" }}
    >
      <Navbar title="Financial Target" />

      <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">

        {loading && (
          <p style={{ color: "var(--text-muted)" }} className="text-center">
            Loading...
          </p>
        )}

        {/* INCOME TARGET */}
        {incomeTarget && (
          <div
            className="p-6 rounded-xl mb-6 shadow-lg border"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-color)"
            }}
          >
            <h3 className="text-lg font-semibold mb-3">
              Income Target
            </h3>

            <div className="flex justify-between items-center mb-2">
              <p className="text-2xl font-bold text-green-500">
                ${incomeTarget.achieved}
                <span
                  className="text-sm ml-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  / ${incomeTarget.amount}
                </span>
              </p>

              <span className="text-green-500 font-semibold">
                {calculatePercent(
                  incomeTarget.achieved,
                  incomeTarget.amount
                ).toFixed(0)}% ACHIEVED
              </span>
            </div>

            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{
                  width: `${calculatePercent(
                    incomeTarget.achieved,
                    incomeTarget.amount
                  )}%`
                }}
              />
            </div>
          </div>
        )}

        {/* CATEGORY BUDGETS */}
        <h3
          className="text-sm uppercase tracking-wider mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Categories
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgetTargets.map((target) => {
            const percent = calculatePercent(
              target.achieved,
              target.amount
            );

            return (
              <div
                key={target._id}
                className="p-5 rounded-xl shadow-lg border"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-color)"
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">
                    {target.category}
                  </h4>

                  <span className="text-sm font-semibold text-cyan-500">
                    {percent.toFixed(0)}%
                  </span>
                </div>

                <p className="text-lg font-bold mb-3">
                  ${target.achieved}
                  <span
                    className="text-sm ml-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    / ${target.amount}
                  </span>
                </p>

                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <div
                    className="h-full bg-cyan-500 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ADD BUTTON */}
        <div className="mt-10 text-center">
          <Link
            to="/financialtargets/add"
            className="inline-block px-6 py-3 rounded-lg font-semibold transition text-white"
            style={{ backgroundColor: "#22c55e" }}
          >
            + Add Financial Target
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default FinancialTargets;