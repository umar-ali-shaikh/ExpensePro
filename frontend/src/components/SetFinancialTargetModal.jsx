import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../libs/axios";
import toast from "react-hot-toast";

const budgetCategories = [
    { value: "shopping", label: "Shopping & Lifestyle", icon: "shopping_bag" },
    { value: "food", label: "Food & Dining", icon: "restaurant" },
    { value: "entertainment", label: "Entertainment", icon: "movie" },
    { value: "bills", label: "Utility Bills", icon: "receipt_long" },
    { value: "overall", label: "Overall Spending", icon: "track_changes" },
    { value: "other", label: "Other", icon: "more_horiz" }
];

const incomeCategories = [
    { value: "salary", label: "Salary", icon: "payments" },
    { value: "freelance", label: "Freelance Income", icon: "laptop_mac" },
    { value: "business", label: "Business Income", icon: "business_center" },
    { value: "savings", label: "Savings Target", icon: "savings" },
    { value: "investment", label: "Investments", icon: "trending_up" },
    { value: "other", label: "Other", icon: "more_horiz" }
];

const SetFinancialTargetModal = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        targetType: "budget",
        amount: "",
        category: "shopping",
        customCategory: "",
        period: "monthly"
    });

    const [openCategory, setOpenCategory] = useState(false);
    const dropdownRef = useRef(null);

    const categoryOptions =
        formData.targetType === "income"
            ? incomeCategories
            : budgetCategories;

    // ✅ Fetch existing target in edit mode
    useEffect(() => {
        if (!isEdit) return;

        const fetchTarget = async () => {
            try {
                const { data } = await api.get(`/targets/${id}`);

                setFormData({
                    targetType: data.targetType || "budget",
                    amount: data.amount ? String(data.amount) : "",
                    category: data.category || "shopping",
                    customCategory: "",
                    period: data.period || "monthly",
                });

            } catch (error) {
                console.error(error.response?.data || error.message);
                toast.error("Failed to load target");
            }
        };

        fetchTarget();
    }, [id, isEdit]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenCategory(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = async () => {
        try {
            if (!formData.amount) {
                toast.error("Amount is required");
                return;
            }

            const finalCategory =
                formData.category === "other"
                    ? formData.customCategory
                    : formData.category;

            const finalData = {
                ...formData,
                amount: Number(formData.amount),
                category: finalCategory
            };

            if (isEdit) {
                await api.put(`/targets/${id}`, finalData);
                toast.success("Target Updated");
            } else {
                await api.post("/targets", finalData);
                toast.success("Target Created");
            }

            navigate("/financialtargets");

        } catch (error) {
            console.error(error.response?.data || error.message);
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
    };

    return (
        <div
            className="w-full flex justify-center font-[Manrope] p-6"
            style={{
                backgroundColor: "var(--bg-card)",
                color: "var(--text-main)"
            }}
        >
            <div
                className="w-full max-w-md flex flex-col shadow-2xl border rounded-2xl overflow-hidden"
                style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-color)"
                }}
            >
                <div className="p-6 pt-4">

                    {/* Header */}
                    <div className="mb-10 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                            <span className="material-symbols-outlined text-primary">
                                track_changes
                            </span>
                        </div>

                        <h1 className="text-xl font-medium tracking-tight">
                            {isEdit ? "Edit Financial Target" : "Set Financial Target"}
                        </h1>

                        <p
                            className="text-xs mt-1 uppercase tracking-widest font-semibold"
                            style={{ color: "var(--text-muted)" }}
                        >
                            {isEdit ? "Update your limits" : "Configure your limits"}
                        </p>
                    </div>

                    {/* Segmented Control */}
                    <div
                        className="flex p-1 mb-10 rounded-xl border"
                        style={{
                            backgroundColor: "var(--bg-secondary)",
                            borderColor: "var(--border-color)"
                        }}
                    >
                        <button
                            onClick={() =>
                                setFormData(prev => ({
                                    ...prev,
                                    targetType: "budget",
                                    category: "shopping",
                                    customCategory: ""
                                }))
                            }
                            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                            style={{
                                backgroundColor:
                                    formData.targetType === "budget"
                                        ? "rgb(19, 182, 236)"
                                        : "transparent",
                                color:
                                    formData.targetType === "budget"
                                        ? "#fff"
                                        : "var(--text-muted)"
                            }}
                        >
                            Budget
                        </button>

                        <button
                            onClick={() =>
                                setFormData(prev => ({
                                    ...prev,
                                    targetType: "income",
                                    category: "salary",
                                    customCategory: ""
                                }))
                            }
                            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                            style={{
                                backgroundColor:
                                    formData.targetType === "income"
                                        ? "rgb(19, 182, 236)"
                                        : "transparent",
                                color:
                                    formData.targetType === "income"
                                        ? "#fff"
                                        : "var(--text-muted)"
                            }}
                        >
                            Income Goal
                        </button>
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col items-center gap-4 mb-10">
                        <label
                            className="text-xs font-bold uppercase tracking-widest"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Target Amount
                        </label>

                        <div
                            className="relative w-full max-w-[240px] border-b"
                            style={{ borderColor: "var(--border-color)" }}
                        >
                            <span
                                className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-light"
                                style={{ color: "var(--text-muted)" }}
                            >
                                $
                            </span>

                            <input
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        amount: e.target.value
                                    }))
                                }
                                placeholder="0.00"
                                className="w-full bg-transparent border-none text-center text-5xl font-light py-4 outline-none"
                                style={{ color: "var(--text-main)" }}
                            />
                        </div>
                    </div>

                    {/* Category Dropdown */}
                    <div className="grid gap-6">
                        <div className="relative" ref={dropdownRef}>

                            <button
                                onClick={() => setOpenCategory(!openCategory)}
                                className="w-full h-12 px-4 rounded-xl border flex items-center justify-between text-sm"
                                style={{
                                    backgroundColor: "var(--bg-secondary)",
                                    borderColor: "var(--border-color)",
                                    color: "var(--text-main)"
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-base">
                                        {
                                            categoryOptions.find(
                                                (c) => c.value === formData.category
                                            )?.icon
                                        }
                                    </span>
                                    {
                                        categoryOptions.find(
                                            (c) => c.value === formData.category
                                        )?.label
                                    }
                                </div>

                                <span className="material-symbols-outlined text-base">
                                    expand_more
                                </span>
                            </button>

                            {openCategory && (
                                <div
                                    className="absolute mt-2 w-full rounded-xl border shadow-lg z-20"
                                    style={{
                                        backgroundColor: "var(--bg-card)",
                                        borderColor: "var(--border-color)"
                                    }}
                                >
                                    {categoryOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    category: option.value,
                                                    customCategory: ""
                                                }));
                                                setOpenCategory(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-primary/10 transition"
                                            style={{ color: "var(--text-main)" }}
                                        >
                                            <span className="material-symbols-outlined text-base">
                                                {option.icon}
                                            </span>
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {formData.category === "other" && (
                            <input
                                type="text"
                                placeholder="Enter custom category"
                                value={formData.customCategory}
                                onChange={(e) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        customCategory: e.target.value
                                    }))
                                }
                                className="w-full h-12 px-4 rounded-xl border text-sm outline-none"
                                style={{
                                    backgroundColor: "var(--bg-secondary)",
                                    borderColor: "var(--border-color)",
                                    color: "var(--text-main)"
                                }}
                            />
                        )}

                        <select
                            value={formData.period}
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    period: e.target.value
                                }))
                            }
                            className="w-full h-12 px-4 rounded-xl border text-sm outline-none"
                            style={{
                                backgroundColor: "var(--bg-secondary)",
                                borderColor: "var(--border-color)",
                                color: "var(--text-main)"
                            }}
                        >
                            <option value="weekly">Weekly cycle</option>
                            <option value="monthly">Monthly cycle</option>
                            <option value="quarterly">Quarterly review</option>
                            <option value="yearly">Annual target</option>
                        </select>
                    </div>

                    <div className="mt-12">
                        <button
                            onClick={handleSubmit}
                            className="w-full h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-base rounded-xl shadow-lg transition-all active:scale-[0.99]"
                        >
                            {isEdit ? "Update Target" : "Save Target"}
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            className="w-full mt-4 py-2 text-xs font-semibold uppercase tracking-widest"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Cancel
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SetFinancialTargetModal;