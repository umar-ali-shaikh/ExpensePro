import { useState } from "react"
import { TransactionContext } from "./TransactionContext"

export function TransactionProvider({ children }) {

  const [transactions, setTransactions] = useState([])


  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) {
        console.log("Unauthorized or error")
        setTransactions([])
        return
      }

      const data = await res.json()

      setTransactions(Array.isArray(data) ? data : [])

    } catch (error) {
      console.error(error)
      setTransactions([])
    }
  }

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
