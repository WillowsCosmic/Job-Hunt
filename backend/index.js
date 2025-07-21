import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import sequelize from "./utils/database.js";
import User from "./models/user.js";
import Company from "./models/company.js";
import Job from "./models/job.js";
import Application from "./models/application.js";
import userRoute from "./routes/user.route.js"
import jobRoute from "./routes/job.route.js"
const app = express();
import companyRoute from "./routes/company.route.js"
import dotenv from 'dotenv';
dotenv.config();

app.get("/home", (req, res) => {
    return res.status(200).json({
        message: "I am coming from backend",
        success: true
    })
})
const PORT = 3000;

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}
app.use(cors(corsOptions));

//api
app.use("/api/v1/user", userRoute)
app.use("/api/v1/company", companyRoute)
app.use("/api/v1/job", jobRoute)


sequelize.sync({ alter: true }).then(() => {
    console.log("Database ready");
    app.listen(PORT, () => {
        console.log(`Server Running at port ${PORT}`);
    });
}).catch(error => {
    console.error("Database failed:", error);
});



