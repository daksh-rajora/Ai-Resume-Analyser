const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")

const env = require("./config/env")
const {connectDB} = require("./config/db")
const {notFound, errorHandler} = require("./middleware/errorHandler")

const healthRouter = require("./routes/health")
const authRouter = require("./routes/auth")
const resumeRouter = require("./routes/resume")
const dashboardRouter = require("./routes/dashboard")
const insightRouter = require("./routes/insights")
const versionsRouter = require("./routes/versions")
const historyRouter = require("./routes/history")

const app = express()

app.set("trust proxy", 1);

const allowedOrigins = [
    "https://ai-resume-psi-flame.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    ...(Array.isArray(env.clientOrigins) ? env.clientOrigins : []),
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
        if (!origin) return callback(null, true);

        const isExplicitlyAllowed =
            allowedOrigins.includes(origin) ||
            /^https:\/\/.*\.vercel\.app$/.test(origin);

        if (isExplicitlyAllowed) {
            return callback(null, true);
        }
        // Fallback: reflect request origin so custom domains or other previews are not blocked
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 204,
    maxAge: 86400,
};

app.use(cors(corsOptions));

app.use(express.json({limit:"1mb"}));
app.use(express.urlencoded({extended: true, limit:"1mb"}));
app.use(cookieParser());
if(!env.isProd) app.use(morgan("dev"));

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/insights", insightRouter);
app.use("/api/versions", versionsRouter);
app.use("/api/history", historyRouter);

app.use(notFound);
app.use(errorHandler);

async function start(){
    try {
        await connectDB();
        app.listen(env.port, ()=> {
            console.log(
                `Server listening on http://localhost:${env.port}(${env.nodeEnv})`,
            )
        })
    } catch (error) {
        console.error("Failed to start server:",error.message);
        process.exit(1);
    }
}

process.on("unhandledRejection",(reason)=>{
    console.error("Unhandled Rejection:", reason)
})

start()
module.exports = app