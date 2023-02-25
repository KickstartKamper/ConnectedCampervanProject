// ROCK 5B client code (browser)
// Uses the jQuery library to request new data from the server
// Returns JSON formatted data and parses to the HTML page

document.getElementById("update_button").addEventListener("click", function(event1)
{
event1.preventDefault(); // prevent page refresh
this.style.backgroundColor = "red"; // user feedback

// jQuery HTTP post request to server
$.ajax(
{
type: "POST",
url: "/",
contentype: "plain/text",
data: "hello",
success: (fromServer) =>
{
// if server sucessfully responds, parse new JSON data to update function
 UpdatePage(JSON.parse(fromServer));
}
});
});

// Update HTML elements with new data
function UpdatePage(newdata)
{
document.getElementById("temperature_data").innerHTML = newdata.temperature_data_JSON;
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