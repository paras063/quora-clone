// ---------------   Models  ---------------
const User = require("./models/user");

// ---------------   Module Imports  ---------------
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const dotenv = require("dotenv");
const errorController = require("./controllers/error");

// Config Environment Variables
dotenv.config();

// Connection String
const MONGODB_URI = process.env.MONGO_URL;

// App Created
const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

// Templating Engine Set
app.set("view engine", "ejs");
app.set("views", "views");

// Parsing Content
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Static Files Folder
app.use(express.static(path.join(__dirname, "public")));

// Session
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "First App To Implement Sessions",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// CSRF Protection
app.use(csrf());

// Store flash Msg Globally
app.use(flash());

// Setup logged in User Globally
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

// Passing Arguments to all Views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Auth Routes
const authRoutes = require("./routes/auth");
const homeRoutes = require("./routes/home");
const quesRoutes = require("./routes/ques");
const adminRoutes = require("./routes/admin");

app.use(homeRoutes, authRoutes, quesRoutes);
app.use("/admin", adminRoutes);

// Error Routes
app.get("/500", errorController.get500);
app.use(errorController.get404);

// Error Controller
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    error: err,
    isAuthenticated: req.session ? req.session.isLoggedIn : false,
  });
});

// Server Running
mongoose
  .connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then((result) => {
    if (!result) {
      console.log("NotConnected!");
    } else {
      const PORT = process.env.PORT || 8000;
      app.listen(PORT, () => {
        console.log(
          `Connected to Port ${PORT} in ${process.env.NODE_ENV} Mode`
        );
      });
    }
  })
  .catch((err) => {
    console.log(err);
  });
