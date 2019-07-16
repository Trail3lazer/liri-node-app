require("dotenv").config();
var inquirer = require("inquirer");
var moment = require("moment")
var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs")
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//----------BONUS---------//
var write = (data) => {
  fs.appendFile('log.txt', data, function(err, result) {if (err){console.log(err)};})
}
//----------BONUS---------//

var liri = (arg2, arg3) => {
  if (arg2 === "concert-this") {
    let artist = arg3
    let url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    axios.get(url).then((response) => {
      for (event in response['data']) {
        event = response['data'][event]
        console.log(event['venue']['name'], event['venue']['city'] + ", " + event['venue']['region'], moment(event['datetime']).format("MM-DD-YYYY"))
        write(event['venue']['name'] + ", " + event['venue']['city'] + ", " + event['venue']['region'] + ", " + moment(event['datetime']).format("MM-DD-YYYY")+"\r\n")
      }

    })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an object that comes back with details pertaining to the error that occurred.
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      })
  }

  else if (arg2 === "spotify-this-song") {
    let song = arg3
    if (song === undefined) { song = "The Sign" }

    spotify.search({ type: 'track', query: song, limit: 5 }, function (err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      for (index in data["tracks"]["items"]) {
        let songObj = data["tracks"]["items"][index];
        let info = {
          title: "Title: " + songObj['name'],
          artist: "Artist: " + songObj["artists"][0]["name"],
          preview: "Preview: " + songObj['preview_url'],
          album: "Album: " + songObj["album"]["name"],
          divider: "<----------------------------------------------------------->"
        }
        for (prop in info) { console.log(info[prop]); write(info[prop]+"\r\n")}
      };
    });
  }

  else if (arg2 === "movie-this") {

    var title = arg3;
    if (title === undefined) { title = "Mr. Nobody" };
    var queryURL = "https://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";


    axios.get(queryURL).then((response) => {
      let info = ['Title', 'Year', 'imdbRating', 'Ratings', 'Country', 'Language', "Plot", 'Actors']
      for (i in info) {
        if (info[i] === 'Ratings') { console.log(response["data"][info[i]][1]["Value"]) }
        else { console.log(response["data"][info[i]]); write(response["data"][info[i]]+"\r\n")}
      }

    }).catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    })
  }

  else if (arg2 === "do-what-it-says") {
    // Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
    fs.readFile("random.txt", 'utf8',(err, response)=>{
      console.log(err)
      let arr = response.split(",")
      liri(arr[0],arr[1])
    })
    // It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
    // Edit the text in random.txt to test out the feature for movie-this and concert-this.
  };
}

liri(process.argv[2],process.argv[3])
