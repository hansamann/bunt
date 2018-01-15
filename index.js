var request = require("request");
var options = require("./options");

var colors = [
	[255,0,0], //B
	[0,255,0], //U
	[0,0,255], //N
	[255,0, 255]  //T
]

var threeColors = [
	[255,255,255], 
	[0,0,0], 
	[127,127,127] 
]

var twoColors = [
	[0,255,0], 
	[255,255,0]
]

//console.log(hexColors(colors));


setInterval(function() {
	sendCommand(colorCommand(randomColors()));
}, 3000);

//sendCommand(rainbowCommand(15));
//sendCommand(colorWipeCommand(10, twoColors)); //or threeColors
//sendCommand(letterWipeCommand(127, twoColors));


//Mode 2 rainbow -> prefixed with 02
function rainbowCommand(wait)
{
	if (wait < 0 || wait > 255)
		throw new Error("wait is out of range[0,255]");

	var wait = Number(wait).toString(16);
	wait = (wait.length == 1) ? "0" + wait : wait;
	
	var hexString = "02" + wait;
	return hexString;
}

function colorWipeCommand(wait, colors)
{
	var wait = Number(wait).toString(16);
	wait = (wait.length == 1) ? "0" + wait : wait;

	var hexString = "03";
	hexString += wait;

	colors.forEach(colorArr => {
		colorArr.forEach(colorValue =>{
			var str = Number(colorValue).toString(16);
			str = (str.length == 1) ? "0" + str : str;
			hexString += str;
		});
	});

	return hexString;
}

//wait is multiplied by 2 in particle photon
function letterWipeCommand(wait, colors)
{
	var wait = Number(wait).toString(16);
	wait = (wait.length == 1) ? "0" + wait : wait;

	var hexString = "04";
	hexString += wait;

	colors.forEach(colorArr => {
		colorArr.forEach(colorValue =>{
			var str = Number(colorValue).toString(16);
			str = (str.length == 1) ? "0" + str : str;
			hexString += str;
		});
	});

	return hexString;
}



//Mode 1 letter -> prefixed with 01
function colorCommand(colors)
{
	var hexString = "01";
	colors.forEach(colorArr => {
		colorArr.forEach(colorValue =>{
			var str = Number(colorValue).toString(16);
			str = (str.length == 1) ? "0" + str : str;
			hexString += str;
		});
	});
	return hexString;
}

function randomColors() 
{
	return [
		[r(),r(),r()], //B
		[r(),r(),r()], //U
		[r(),r(),r()], //N
		[r(),r(),r()]  //T
	];

}

function r()
{
	var min = 0;
	var max = 255;
    return Math.floor(Math.random()*(max-min+1)+min);
}

function sendCommand(command)
{
	request({
			url : options.api_base + "/v1/devices/"+options.device_id+"/mode",
			method : "POST",
			form : {
				args : command,
				access_token : options.access_token
			}
		}, function(err, response, body)
		{
			
			if (!err)
				console.log(body);
			else
				console.error(err);
	});
}