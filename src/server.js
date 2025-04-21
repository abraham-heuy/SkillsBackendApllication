"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const import_aliases_1 = require("import-aliases");
(0, import_aliases_1.setupAliases)();
const authroutes_1 = __importDefault(require("@app/routes/authroutes"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const jobroutes_1 = __importDefault(require("@app/routes/jobroutes"));
const interviewroutes_1 = __importDefault(require("@app/routes/interviewroutes"));
const portfolioRoutes_1 = __importDefault(require("@app/routes/portfolioRoutes"));
const filterRoutes_1 = __importDefault(require("@app/routes/filterRoutes"));
const chatRoutes_1 = __importDefault(require("@app/routes/chatRoutes"));
const hiringroutes_1 = __importDefault(require("@app/routes/hiringroutes"));
const applicationroutes_1 = __importDefault(require("@app/routes/applicationroutes"));
// Load environment variables first
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Routes
app.use("/api/v1/auth", authroutes_1.default);
app.use("/api/v1/users", usersRoutes_1.default);
app.use("/api/v1/jobs", jobroutes_1.default);
app.use("/api/v1/interviews", interviewroutes_1.default);
app.use("/api/v1/portfolio", portfolioRoutes_1.default);
app.use("/api/v1/filters", filterRoutes_1.default);
app.use("/api/v1/chat", chatRoutes_1.default);
app.use("/api/v1/applyjob", applicationroutes_1.default);
app.use("/api/v1/hire", hiringroutes_1.default);
// Test route
app.get("/", (req, res) => {
    res.send("Hello, Welcome to the Skills match API!");
});
// Start server
app.listen(port, () => {
    console.log(`🚀 Server is running on port: ${port}`);
});
