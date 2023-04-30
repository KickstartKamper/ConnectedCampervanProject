// ROCK 5B server code (Node.js)
// Uses the express library to listen for and handle incoming HTTP events
// Returns HTML, CSS and JavaScript files to client as required
// Returns placeholder data to client in response to HTTP post requests.

// CTRL + C to exit Node

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

// key value pair data format
let helloData = {
heading_data_JSON: Cluster_Heading,
pitch_data_JSON: Cluster_Pitch,
roll_data_JSON: Cluster_Roll,
temperature_data_JSON: Cluster_Temperature,
pressure_data_JSON: Cluster_Pressure,
humidity_data_JSON: Cluster_Humidity,
altitude_data_JSON: Cluster_Altitude,
light_data_JSON: Cluster_Light
};


// Send data in JSON format
res.send(JSON.stringify(helloData));
});


// Listen for HTTP events
app.listen(port, hostname, function() 
{
  console.log('server running');
});








/* Read USB serial data from sensor cluster */
// https://serialport.io/docs/api-serialport
// https://serialport.io/docs/api-serialport#parsers
// use df or lsblk to find usb devices
// or goto /dev and use ls

// Sensor Cluster Data
var Cluster_Heading = 0;
var Cluster_Pitch = 0;
var Cluster_Roll = 0;
var Cluster_Temperature = 0;
var Cluster_Pressure = 0;
var Cluster_Humidity = 0;
var Cluster_Altitude = 0;
var Cluster_Light = 0;

const serialport = require('serialport');
var SerialPort = serialport.SerialPort;

// don't change this, it works
var USB_Serial = new SerialPort({path: "/dev/ttyACM0", baudRate: 115200,}); // default REPL/Serial baud rate of the microbit

// parse microbit print() serial data to console
const data_parser = USB_Serial.pipe(new serialport.ReadlineParser({ delimiter: '\r\n' }))
data_parser.on('data', function(MB_Data) 
{
let CSVData = MB_Data.split(',') // seperate out data

Cluster_Heading = CSVData[0];
Cluster_Pitch = CSVData[1];
Cluster_Roll = CSVData[2];
Cluster_Temperature = CSVData[3];
Cluster_Pressure = CSVData[4];
Cluster_Humidity = CSVData[5];
Cluster_Altitude = CSVData[6];
Cluster_Light = CSVData[7];
});





