require("dotenv").config();
const PORT = process.env.PORT || 5000;
const express = require("express");
const app = express();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./db");
const colors = require("colors");
const path = require("path");
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "http://localhost:5174", // local dev
  "https://la-balcone-client.vercel.app",
  "https://employees-frontend-umber.vercel.app",
  "https://employees-frontend-umber.vercel.app", // production frontend
  "https://la-balcone.com", // production frontend
  "https://admin.myapp.com",
  "http://192.168.1.154:5173",
  "http://192.168.1.154:5173", // maybe another dashboard
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
// To get __dirname (because ES Modules don’t have it)

//Routes
app.use("/api/users", require("./Routes/userRoutes"));
app.use("/api/employees", require("./Routes/employeeRoutes"));
app.use("/api/worklogs", require("./Routes/worklogRoutes"));
// app.use('/api/sub/categories', require('./Routes/subCategoryRoutes'))
// app.use('/api/menu/items', require('./Routes/menuItemRoutes'))

// use the errorHandler function for manage error events
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("v.5");
});

app.listen(PORT, "0.0.0.0", function () {
  console.log(`started serve on port ${PORT}`);
});
