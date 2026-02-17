import { useState } from "react"
import { TransactionContext } from "./TransactionContext"
import api from "../libs/axios"

export function TransactionProvider({ children }) {

  const [transactions, setTransactions] = useState([])


  const fetchTransactions = async () => {
    try {
      const { data } = await api.get("/transactions");

      setTransactions(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error(error.response?.data || error.message);
      setTransactions([]);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        fetchTransactions   // ✅ MUST RETURN THIS
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
