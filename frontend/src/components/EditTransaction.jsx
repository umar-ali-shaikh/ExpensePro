import { useParams, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import useTransactions from "../hooks/useTransactions"
import toast from "react-hot-toast"
import TransactionForm from "../components/TransactionForm"

export default function EditTransaction() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { transactions, updateTransaction } = useTransactions()

  const transaction = transactions.find(t => t._id === id)

  // ❗ Only redirect if transaction not found
  useEffect(() => {
    if (transactions.length > 0 && !transaction) {
      navigate("/transactions")
    }
  }, [transaction, transactions, navigate])

  const handleUpdate = async (data) => {
    await updateTransaction(id, data)
    toast.success("Transaction Updated ✅")
    navigate("/transactions", { state: { refresh: true } })
  }

  if (!transaction) return <p>Loading...</p>

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-main)"
      }}
    >
      <TransactionForm
        initialData={transaction}
        onSubmit={handleUpdate}
        isEdit
      />
    </div>
  )
}