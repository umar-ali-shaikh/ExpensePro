
import Transaction from "../models/transaction.js";

export const createTransaction = async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        const transaction = await Transaction.create({
            user: req.user._id,  // 🔥 important
            title,
            amount,
            category,
            date
        });

        res.status(201).json(transaction);

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

/* GET USER TRANSACTIONS */
export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        res.json(transactions);

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};