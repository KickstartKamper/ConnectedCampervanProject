// ROCK 5B server code (Node.js)
// Uses the express library to listen for and handle incoming HTTP events
// Returns HTML, CSS and JavaScript files to client as required
// Returns placeholder data to client in response to HTTP post requests.

// Dependencies
const http = require('http');
const express = require('express');

// Establish socket address, port number for server.
const hostname = 'localhost';
const port = 3000;

// Initialise express library
const app = express();


// HTTP GET event handlers for client-side files

// Upon user connection, send HTML file
app.get(['/', '/index.html'], function(req, res)
{
res.sendFile((__dirname + '/client/index.html'));
console.log('homepage sent');
});

// Request Javascript when required by the client
app.get('/clientcode.js', function(req, res)
{
res.sendFile((__dirname + '/client/clientcode.js'));
console.log('client JS code sent');
});

// Request jQuery library when required by the client
app.get('/jquery.min.js', function(req, res)
{
res.sendFile((__dirname + '/client/jquery-3.6.3.min.js'));
console.log('jQuery sent');
});

// Request style sheet when required by the client
app.get('/clientstyle.css', function(req, res)
{
res.sendFile((__dirname + '/client/clientstyle.css'));
console.log('client CSS code sent');
});


// HTTP POST event handler for client-side data requests
app.post(['/', '/index.html'], function(req, res)
{
console.log('page update requested');

// Generate random placeholder data for testing
let Rand_Temp = JSON.stringify(Math.floor((Math.random()*50)));
let Rand_Light = JSON.stringify(Math.floor((Math.random()*100)));

// key value pair data format
let helloData = {
temperature_data_JSON: Rand_Temp,
light_data_JSON: Rand_Light
};


// Send data in JSON format
res.send(JSON.stringify(helloData));
});


// Listen for HTTP events
app.listen(port, hostname, function() 
{
  console.log('server running');
});