const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const Log = require("./models/log.js");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

mongoose.connect("mongodb://localhost:27017/basiccrud", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true
});
mongoose.connection.once("open", () => {
  console.log("connected to mongo");
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// New route
app.get("/logs/new", (req, res) => {
  res.render("new.ejs");
});

// Delete route
app.delete("/logs/:id", (req, res) => {
  Log.findByIdAndRemove(req.params.id, (err, data) => {
    res.redirect("/logs"); 
  });
});

// Update route
app.put("/logs/:id", (req, res) => {
  if (req.body.readyToEat === "on") {
    req.body.readyToEat = true;
  } else {
    req.body.readyToEat = false;
  }
  Log.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedModel) => {
      res.redirect("/logs");
    }
  );
});

// Create route
app.post("/logs", (req, res) => {
  if (req.body.shipIsBroken === "on") {
    req.body.shipIsBroken = true;
  } else {
    req.body.shipIsBroken = false;
  }
  Log.create(req.body, (err, createdLog) => {
    res.redirect("/logs");
  });
});

// Show route
app.get("/logs/:id", (req, res) => {
  Log.findById(req.params.id, (err, foundLog) => {
    res.render("show.ejs", {
      log: foundLog,
    });
  });
});

// Edit route
app.get("/logs/:id/edit", (req, res) => {
  Log.findById(req.params.id, (err, foundLog) => {
    res.render("edit.ejs", {
      log: foundLog,
    });
  });
});

// Index route
app.get("/logs", (req, res) => {
  Log.find({}, (err, allLogs) => {
    if (err) console.error(err.message);
    else {
      res.render("index.ejs", {
        logs: allLogs,
      });
    }
  });
});

app.listen(port, () => {
  console.log("listening at port 3000");
});
