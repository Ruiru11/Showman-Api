const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const chalk = require("chalk");
const mongoose = require("mongoose");
const users = require("./routes/api/users");
import emailVerify from "./routes/endpoints/users";

const app = express();
const DB = require("./config/keys").mongoUri;

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

app.use(morgan("dev"));

mongoose
  .connect(DB, {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false
  })
  .then(() => console.log(chalk.greenBright("connection to the database successful")))
  .catch(err => console.log(err));

  const connectWithRetry = () => {
    console.log('MongoDB connection with retry')
    return mongoose.connect(DB, {
        keepAlive: 1,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false
      })
  }

mongoose.connection.on("error", err => {
  console.log(`MongoDB connection error: ${err}`);
  setTimeout(connectWithRetry, 5000);
});

app.use("/api/v1/users", users);
app.use("/verify-email", emailVerify);

const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(chalk.magenta(`server running on port ${port}`))
);