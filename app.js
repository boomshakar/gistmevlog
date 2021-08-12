const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const morgan = require("morgan");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo"); // to store databaase session in the browser
const UserService = require("./model/userpack/userIndex");

// Load config
dotenv.config({ path: "./config/config.env" });
const connectDB = require("./config/db"); // require the connectDB after creating the setup in db.js iside the config folder
connectDB();
// Passport config
require("./config/configpassp");
// local Passport config
require("./config/passport");
// Google Passport config
// require("./model/googleuser/googleIndex");
require("./config/googlepass");

const app = express();

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// morgan middleware logging
app.use(morgan("dev"));

// Set Templating Engine
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

//Set up express session
app.use(
  session({
    secret: "keyboard cat", // should be inside an environment variable
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        process.env.MONGO_URI /* mongooseConnection: mongoose.connection */,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);
// Passport middleware
//Initialize and start using passport.js
app.use(passport.initialize());
//Tell the app to use passport to also setup the sessions
app.use(passport.session());

//Tell the app to use all the statics files inside the public folder
app.use(express.static(path.join(__dirname, "public")));

//   Connect Flash
app.use(flash());

// Global VARS
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg"); //registration success redirecting to log in
  res.locals.error_msg = req.flash("error_msg"); //registration failed (requirements not met)
  res.locals.error = req.flash("error"); //for login flash error message
  next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/posts"));

const port = process.env.PORT;
app.listen(port, () => console.log(`Server up on running on ${port}`));
