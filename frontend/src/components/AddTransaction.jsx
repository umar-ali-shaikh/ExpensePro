import { useNavigate } from "react-router-dom"
// import useTransactions from "../hooks/useTransactions"
import toast from "react-hot-toast"
import TransactionForm from "../components/TransactionForm"

export default function AddTransaction() {
  const navigate = useNavigate();
  // const { addTransaction } = useTransactions();

  const handleAdd = async (data) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        toast.error("Please login first")
        return
      }

      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const errorData = await res.json()
        toast.error(errorData.message || "Failed to add transaction")
        return
      }

      toast.success("Transaction added successfully 🎉")

      navigate("/transactions", { state: { refresh: true } })

    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-main)"
      }}
    >
      <TransactionForm onSubmit={handleAdd} />
    </div>
  )
}