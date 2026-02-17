import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import TransactionForm from "../components/TransactionForm"
import api from "../libs/axios";

export default function AddTransaction() {
  const navigate = useNavigate();
  const handleAdd = async (data) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const { data: responseData } = await api.post("/transactions", data);

      toast.success(responseData?.message || "Transaction added 🎉");

      navigate("/transactions", { state: { refresh: true } });

    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to add transaction"
      );
    }
  };

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