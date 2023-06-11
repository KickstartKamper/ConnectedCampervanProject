// ROCK 5B server code (Node.js)
// Uses the express library to listen for and handle incoming HTTP events
// Returns HTML, CSS and JavaScript files to client as required
// Returns placeholder data to client in response to HTTP post requests.

// CTRL + C to exit Node



/************************************************************************/
/*******************************WEB SERVER*******************************/
/************************************************************************/

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


/************************************************************************/
/******************************SENSOR CLUSTER****************************/
/************************************************************************/


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
console.log("USB working");

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


/************************************************************************/
/*********************************DATABASE*******************************/
/************************************************************************/


/* SENSOR DATABASE SETUP */

const mariadb = require('mariadb');

async function SensorDBSetup() {

console.log("Setting up DB");

let conn = await mariadb.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rock',
database: 'CampervanData'
 });

try{
// delete old short-term data table on startup
await conn.query('DROP TABLE IF EXISTS SensorData');
// create new data table for time data

const result = await conn.query('CREATE TABLE IF NOT EXISTS SensorData (minute VARCHAR(255), temperature VARCHAR(255), pressure VARCHAR(255), humidity VARCHAR(255), light VARCHAR(255))');
// now initialise the table with each 5 minute row, and 0 data for each sensor
await conn.query("INSERT INTO SensorData (minute, temperature, pressure, humidity, light) VALUES " +
"('0', '0', '0', '0', '0'), " +
"('5', '0', '0', '0', '0'), " +
"('10', '0', '0', '0', '0'), " +
"('15', '0', '0', '0', '0'), " +
"('20', '0', '0', '0', '0'), " +
"('25', '0', '0', '0', '0'), " +
"('30', '0', '0', '0', '0'), " +
"('35', '0', '0', '0', '0'), " +
"('40', '0', '0', '0', '0'), " +
"('45', '0', '0', '0', '0'), " +
"('50', '0', '0', '0', '0'), " +
"('55', '0', '0', '0', '0') "
);
console.log(result);
}
catch(err)
{
console.log(err);
}
finally {
  conn.end();
}
}
/* END OF DB SETUP */


// Update DB with latest data
async function SensorDBUpdate() {

let conn = await mariadb.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rock',
database: 'CampervanData'
 });

let current_temp = String(Cluster_Temperature);
let current_press = String(Cluster_Pressure);
let current_humid = String(Cluster_Humidity);
let current_light = String(Cluster_Light);

let current_time = new Date();
let current_min = String(current_time.getMinutes());

try{
await conn.query("UPDATE SensorData SET temperature = " + current_temp + " WHERE minute = " + current_min);
await conn.query("UPDATE SensorData SET pressure = " + current_press + " WHERE minute = " + current_min);
await conn.query("UPDATE SensorData SET humidity = " + current_humid + " WHERE minute = " + current_min);
await conn.query("UPDATE SensorData SET light = " + current_light + " WHERE minute = " + current_min);
}
catch(err)
{
console.log(err);
}
finally {
  conn.end();
}
}


/************************************************************************/
/***********************************MAIN*********************************/
/************************************************************************/


SensorDBSetup();

setInterval(function()
{
SensorDBUpdate(); // updates database with current sensor values

}, 5000); // waits for interval then executes