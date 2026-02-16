import { useState } from "react"

export default function TransactionForm({
  initialData,
  onSubmit,
  isEdit = false
}) {

  const [amount, setAmount] = useState(
    initialData ? Math.abs(initialData.amount) : ""
  )

  const [type, setType] = useState(
    initialData
      ? initialData.amount > 0
        ? "income"
        : "expense"
      : "expense"
  )

  const [category, setCategory] = useState(
    initialData?.category || ""
  )

  const [description, setDescription] = useState(
    initialData?.title || ""
  )

  const [date, setDate] = useState(
    initialData?.date?.slice(0, 10) || ""
  )

  const handleSubmit = () => {
    if (!amount || !category || !date) {
      return alert("Please fill all required fields")
    }

    const finalAmount =
      type === "expense"
        ? -Math.abs(amount)
        : Math.abs(amount)

    onSubmit({
      amount: Number(finalAmount),
      category,
      title: description,
      date
    })
  }

  return (
    <div
      className="w-full max-w-lg rounded-2xl shadow-xl overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        color: "var(--text-main)"
      }}
    >

      {/* Header */}
      <div
        className="p-6 border-b"
        style={{ borderColor: "var(--border-color)" }}
      >
        <h2 className="text-xl font-bold">
          {isEdit ? "Edit Transaction" : "New Transaction"}
        </h2>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">

        {/* Amount */}
        <div className="text-center">
          <p
            className="text-sm mb-2 uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            Amount
          </p>

          <div className="flex items-center justify-center">
            <span
              className="text-4xl mr-2 font-bold"
              style={{ color: "var(--text-main)" }}
            >
              ₹
            </span>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-4xl text-center focus:outline-none w-40"
              style={{
                background: "transparent",
                color: "var(--text-main)"
              }}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Toggle */}
        <div
          className="p-1 rounded-xl flex transition-colors duration-300"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <button
            onClick={() => setType("expense")}
            className="flex-1 py-3 rounded-lg font-semibold transition-all duration-300"
            style={{
              backgroundColor:
                type === "expense"
                  ? "rgb(19, 182, 236)"
                  : "transparent",
              color:
                type === "expense"
                  ? "var(--text-main)"
                  : "var(--text-muted)"
            }}
          >
            Expense
          </button>

          <button
            onClick={() => setType("income")}
            className="flex-1 py-3 rounded-lg font-semibold transition-all duration-300"
            style={{
              backgroundColor:
                type === "income"
                  ? "rgb(19, 182, 236)"
                  : "transparent",
              color:
                type === "income"
                  ? "var(--text-main)"
                  : "var(--text-muted)"
            }}
          >
            Income
          </button>
        </div>

        {/* Category */}
        <div>
          <label
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-2 rounded-lg py-3 px-4 transition-colors duration-300"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-main)"
            }}
          >
            <option value="">Select Category</option>
            <option value="Food">🍔 Food</option>
            <option value="Transport">🚗 Transport</option>
            <option value="Salary">💰 Salary</option>
            <option value="Health">🏥 Health</option>
            <option value="Shopping">🛍️ Shopping</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mt-2 rounded-lg py-3 px-4 transition-colors duration-300"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-main)",
              colorScheme: document.documentElement.classList.contains("dark")
                ? "dark"
                : "light"
            }}
          />
        </div>

        {/* Description */}
        <div>
          <label
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            Description
          </label>

          <textarea
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this for?"
            className="w-full mt-2 rounded-lg py-3 px-4 resize-none transition-colors duration-300"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-main)"
            }}
          />
        </div>

      </div>

      {/* Footer */}
      <div
        className="p-6 border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-xl font-bold transition-all duration-300"
          style={{
            backgroundColor: "rgb(19, 182, 236)",
            color: "var(--text-main)"
          }}
        >
          {isEdit ? "Update Transaction" : "Add Transaction"}
        </button>
      </div>

    </div>
  )
}