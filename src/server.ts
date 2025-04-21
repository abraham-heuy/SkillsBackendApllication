import { setupAliases } from "import-aliases";
setupAliases()
import authRoutes from "@app/routes/authroutes";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import userRoutes from "./routes/usersRoutes";
import jobRoutes from"@app/routes/jobroutes"
import interviewroutes from "@app/routes/interviewroutes";
import portfolioRoutes from "@app/routes/portfolioRoutes";
import filterRoutes from "@app/routes/filterRoutes";
import chatRoutes from "@app/routes/chatRoutes";
import hiringroutes from "@app/routes/hiringroutes";
import applicationroutes from "@app/routes/applicationroutes";




// Load environment variables first
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser()); 

app.use(
    
    cors({
        origin: "http://localhost:4200",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Routes
app.use("/api/v1/auth", authRoutes); 
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/jobs", jobRoutes); 
app.use("/api/v1/interviews", interviewroutes); 
app.use("/api/v1/portfolio", portfolioRoutes); 
app.use("/api/v1/filters", filterRoutes);
app.use("/api/v1/chat", chatRoutes); 
app.use("/api/v1/applyjob", applicationroutes); 
app.use("/api/v1/hire", hiringroutes); 

// Test route

app.get("/", (req, res) => {
    res.send("Hello, Welcome to the Skills match API!");
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server is running on port: ${port}`);
});
