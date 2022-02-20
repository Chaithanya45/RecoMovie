const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const ejs = require("ejs");
const axios = require('axios');
const fs = require("fs");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("home");
})

app.post("/", function(req, res) {
  const url = "https://movielens-ap.herokuapp.com/movies/content/?movie=" + req.body.movie + "&limit=10"
  axios
    .get(url)
    .then(response => {

      fs.readFile("./data.json", "utf8", (err, jsonString) => {
        if (err) {
          console.log("Error reading file from disk:", err);
          return;
        }
        try {
          const data = JSON.parse(jsonString);
          var content = response.data.content;
          const movies = [];
          for(var k=0;k<data.length;k++){
            if(req.body.movie===data[k].Movie){
              movies[0]=data[k];
              break;
            }
          }
          for(var i=0;i<content.length;i++){
            for(var j=0;j<data.length;j++){
              if(content[i]===data[j].Movie){
                movies[i+1]=data[j];
                break;
              }
            }
          }
          res.render("tester", {
            movies: movies
          });
        } catch (err) {
          console.log("Error parsing JSON string:", err);
        }
      });

    })
    .catch(error => {
      res.render("fail");
    });

})


app.listen(3000, function() {
  console.log("server up on 3000");
})
