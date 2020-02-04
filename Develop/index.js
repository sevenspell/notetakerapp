var express = require("express");
var path = require("path");
var fs = require("fs");
var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var tableReserve = [];

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));
})


// Displays all reservations
app.get("/view", function (req, res) {
    return res.json(tableReserve);
});


app.post("/reserve", function (req, res) {

    var newReserve = req.body;

    tableReserve.push(newReserve);

    res.json(newReserve);

    console.log(tableReserve);
});


app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});