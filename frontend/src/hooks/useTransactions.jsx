import { useContext, useEffect } from "react"
import { TransactionContext } from "../context/TransactionContext"

export default function useTransactions() {

  const context = useContext(TransactionContext)

  if (!context) {
    throw new Error("useTransactions must be used inside TransactionProvider")
  }

  const { transactions, fetchTransactions } = context

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return { transactions, fetchTransactions }
}