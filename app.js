const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");



const app = express();

const dotenv = require('dotenv').config();
const api_key = process.env.API_KEY;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.get("/", function(req, res) {
    res.render("index", { description: "Try to Enter exact name.", temp: "", pic: "" });
});
app.post("/", function(req, res) {


    const query = req.body.cityName;

    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + api_key + "&units=" + units;
    https.get(url, function(response) {


        response.on("data", function(data) {
            const weatherData = JSON.parse(data);
            if (response.statusCode === 200) {
                const temp = "And the Temperature is " + weatherData.main.temp + " celsius";
                const Description = "In " + query + " it's " + weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

                res.render("index", { description: Description, temp: temp, pic: imgURL });
            } else {
                res.render("index", { description: "Sorry we can't find " + query + " :(", temp: "", pic: "" });
            }

        });
    });
});



let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, function() {
    console.log("Server started on port 3000");
});