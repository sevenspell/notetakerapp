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

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
})

app.get("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf-8", function (err, data) {
    if (err) throw err;
    res.send(JSON.parse(data));
  })
})

app.post("/api/notes", function (req, res) {

  var newNote = req.body;
  id = activeNote.length + 1;
  newNote.id = id.toString();
  activeNote.push(newNote);
  res.json(newNote);

  fs.writeFile("./db/db.json", JSON.stringify(activeNote), function (err) {
    if (err) throw err;
    console.log("Data has been saved to database");
  })
});

app.get("/api/notes/:character", function(req, res) {
  var chosen = req.params.character;
  console.log(chosen + " chosen");
  console.log(activeNote[i].id + " id");

  for (var i = 0; i < activeNote.length; i++) {
    if (chosen === activeNote[i].id) {
      return res.json(activeNote[i]);
    }
  }
  return res.json(false);
});

app.delete("/api/notes/:character", function(req, res){
  var chosen = req.params.character;
  console.log(chosen + " chosen to delete")

  for (var i = 0; i < activeNote.length; i++) {
    
    if (chosen === activeNote[i].id) {
      console.log(activeNote[i].id + " id in array")
      activeNote.splice(chosen-1, 1);
      console.log(JSON.stringify(activeNote) + " new activeNote")

      fs.writeFile("./db/db.json", JSON.stringify(activeNote), function (err) {
        if (err) throw err;
        console.log("Data has been saved to database");
    
      })
      return res.json(activeNote);
    }
  }


  return res.json(false);


})


app.use(function (req, res, next) {
  res.status(404).send("<h2>The page you're looking for is unavailable. Please check if the address is correct and try again. Good luck!</h2>");
})

app.listen(PORT, function () {
  console.log("App listening on http://localhost:" + PORT);
});