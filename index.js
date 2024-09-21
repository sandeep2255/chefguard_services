const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { connectDB } = require("./database/index.js");

const app = express();
const PORT = 8082

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: 'GET,POST', 
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const userRouter = require("./Routes/userRoutes");

app.get("/", (req, res) => {
  res.send("hello World");
});

app.use("/api/v1/user", userRouter);
module.exports = { app };

dotenv.config();

connectDB()
.then(() => {
    http.listen(process.env.PORT || 8000, () => {
    console.log(`Server/ws is running at Port:${process.env.PORT}`);
    });
})
.catch((e) => {
    console.log("Database connection failed", e);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

