// ROCK 5B client code (browser)
// Uses the jQuery library to request new data from the server
// Returns JSON formatted data and parses to the HTML page

// Update HTML elements with new data
function UpdatePage(newdata)
{
document.getElementById("heading_data").innerHTML = newdata.heading_data_JSON;
document.getElementById("pitch_data").innerHTML = newdata.pitch_data_JSON;
document.getElementById("roll_data").innerHTML = newdata.roll_data_JSON;
document.getElementById("temperature_data").innerHTML = newdata.temperature_data_JSON;
document.getElementById("pressure_data").innerHTML = newdata.pressure_data_JSON;
document.getElementById("humidity_data").innerHTML = newdata.humidity_data_JSON;
document.getElementById("altitude_data").innerHTML = newdata.altitude_data_JSON;
document.getElementById("light_data").innerHTML = newdata.light_data_JSON;
}

// set page to request updates every 5s
var intervalId = setInterval(function() 
{
$.ajax({
type: "POST",
url: "/",
contentype: "plain/text",
data: "hello",
success: (fromServer) =>
{
 UpdatePage(JSON.parse(fromServer));
}
});
}, 5000);