var express = require("express");
var path = require("path");
var fs = require("fs");
var app = express();
var PORT = process.env.PORT || 3000;

//use express methods
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//create array for notes
var activeNote = [];

//create path to read index.html
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
})

//create path to read notes.html
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
})

//create express post method to collect note entry data and log into array, with id
app.post("/api/notes", function (req, res) {

  var newNote = req.body;
  id = activeNote.length + 1;
  newNote.id = id.toString();

  //check id for existing id to prevent duplicates
  for (var i = 0; i < activeNote.length; i++) {

    if (id != activeNote[i].id) {
      console.log("ID can be added according to activeNote.length");
    } else {
      console.log("ID already exists. Use the next available ID.");
      id++;
      newNote.id = id.toString();
    } 
  }
  //log data into array
  activeNote.push(newNote);
  res.json(newNote);

  //write array data into db.json
  fs.writeFile("./db/db.json", JSON.stringify(activeNote), function (err) {
    if (err) throw err;
    console.log("Data has been saved to database");
  })
});

//create express get method to send db data in JSON format to display on HTML
app.get("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf-8", function (err, data) {
    if (err) throw err;
    res.send(JSON.parse(data));
  })
})

//create express get method to match chosen note item with item in array based on ID
app.get("/api/notes/:character", function (req, res) {
  var chosen = req.params.character;

  for (var i = 0; i < activeNote.length; i++) {

    if (chosen === activeNote[i].id) {
      return res.json(activeNote[i]);
    }
  }
  return res.json(false);
});

//create express method to find item chosen by user based on ID and splice away from existing array
app.delete("/api/notes/:character", function (req, res) {
  var chosen = req.params.character;
  console.log(chosen + " chosen to delete")

  for (var i = 0; i < activeNote.length; i++) {
    if (chosen === activeNote[i].id) {
      activeNote.splice(i, 1);

      fs.writeFile("./db/db.json", JSON.stringify(activeNote), function (err) {
        if (err) throw err;
        console.log("Data has been saved to database");
      })
      return res.json(activeNote);
    }
  }
  return res.json(false);
})

//create express method to display error message if pathway is incorrect
app.use(function (req, res, next) {
  res.status(404).send("<h2>The page you're looking for is unavailable. Please check if the address is correct and try again. Good luck!</h2>");
})

//create express method to listen to server
app.listen(PORT, function () {
  console.log("App listening on http://localhost:" + PORT);
});