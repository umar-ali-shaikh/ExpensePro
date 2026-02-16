import Target from "../models/target.js";
import Transaction from "../models/transaction.js";

/* CREATE TARGET */
export const createTarget = async (req, res) => {
  try {
    const target = await Target.create({
      type: req.body.targetType,
      amount: Number(req.body.amount),
      category: req.body.category,
      period: req.body.period,
      user: req.user.id
    });

    res.status(201).json(target);
  } catch (error) {
    console.error("CREATE TARGET ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* GET USER TARGETS */
export const getTargets = async (req, res) => {
  try {
    const userId = req.user.id;

    const targets = await Target.find({ user: userId });

    const updatedTargets = await Promise.all(
      targets.map(async (target) => {

        const transactions = await Transaction.find({
          user: userId,
          category: { $regex: new RegExp(`^${target.category}$`, "i") }
        });

        let achieved = 0;

        transactions.forEach(txn => {
          if (target.type === "income" && txn.amount > 0) {
            achieved += txn.amount;
          }

          if (target.type === "budget" && txn.amount < 0) {
            achieved += Math.abs(txn.amount);
          }
        });

        return {
          ...target.toObject(),
          achieved
        };
      })
    );

    res.json(updatedTargets);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE TARGET */
export const updateTarget = async (req, res) => {
  try {
    const updated = await Target.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        type: req.body.targetType,
        amount: Number(req.body.amount),
        category: req.body.category,
        period: req.body.period
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("UPDATE TARGET ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* DELETE TARGET */
export const deleteTarget = async (req, res) => {
  try {
    await Target.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    res.json({ message: "Deleted Successfully" });
  } catch (error) {
    console.error("DELETE TARGET ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};