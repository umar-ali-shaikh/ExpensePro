import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);


import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import TransactionRoutes from "./routes/transactionRoutes.js";
import cors from "cors"
import targetRoutes from "./routes/targetRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve()

if (process.env.NODE_ENV != "production") {
    app.use(
        cors({
            origin: "http://localhost:5173",
            credentials: true
        })
    )
}

// MiddleWare
app.use(express.json());


// app.get("/", (req, res) => {
//     res.send("Server running 🚀");
// });


app.use("/api/auth", authRoutes);
app.use("/api/transactions", TransactionRoutes);
app.use("/api/targets", targetRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"))

if (process.env.NODE_ENV === "production") {

    const __dirname = path.resolve();
    const frontendPath = path.join(__dirname, "../frontend/dist");

    app.use(express.static(frontendPath));

    app.use((req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
} 

app.set("trust proxy", 1);

const startServer = async () => {
    await connectDB(); // wait until DB connects

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT} 🚀`);
    });
};

startServer()