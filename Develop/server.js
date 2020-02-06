var express = require("express");
var path = require("path");
var fs = require("fs");
var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


var activeNote = [];

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
})

app.get("/api/notes", function (req, res) {
  // res.sendFile(path.join(__dirname, "/public/notes.html"));
  res.send(readNotes());
  
})

app.post("/api/notes", function (req, res) {

  var newNote = req.body;
  activeNote.push(newNote);
  res.json(newNote);

  console.log(activeNote);

  fs.writeFile("./db/db.json", JSON.stringify(activeNote), function (err) {
    if (err) throw err;
    console.log("Data has been saved to database");
  })
});









function readNotes (req, res) {
var notes = "";
  fs.readFile("./db/db.json", "utf-8", function (err, data) {
    if (err) throw err;
    console.log("line 50 " + data + " line 50")
    notes = JSON.parse(data);
  })
  return notes;
}


















app.use(function (req, res, next) {
  res.status(404).send("<h2>The page you're looking for is unavailable. Please check if the address is correct and try again. Good luck!</h2>");
})

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});