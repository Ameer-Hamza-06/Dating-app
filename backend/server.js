const express = require("express");
require("dotenv").config();
const colors = require("colors");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
const { errorHandler } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoute");

connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users", userRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Api is Working!");
});
app.listen(port, () => console.log(`Server is started at ${port}`));
