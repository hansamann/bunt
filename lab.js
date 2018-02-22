var request = require("request");
var options = require("./options");

var colors = [
	[255,0,0], //8
	[0,255,0], //7
	[0,0,255]
	]

var threeColors = [
	[0,255,0], 
	[255,255,0],
	[255,127,0],
	
]

var twoColors = [
	[0,255,0], 
	[255,255,0]
]


//01 set colors
//sendCommand(colorCommand(randomColors()));
//sendCommand(colorCommand(colors));

//02 rainbow
//sendCommand(rainbowCommand(30));

//03 color wipe with wait and 2 or 3 colors
//sendCommand(colorWipeCommand(30, threeColors)); //or threeColors

//04 letter wipe wit wait and 2 or 3 colors
//sendCommand(letterWipeCommand(64, threeColors));

//05 randomFade (all) with wait
//sendCommand(randomFade(50));

//06 randomLetterFade with wait;
sendCommand(randomLetterFade(100));


/*
setInterval(function() {
	sendCommand(colorCommand(randomColors()));
}, 3000);
*/






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


function randomFade(wait)
{
	if (wait < 0 || wait > 255)
		throw new Error("wait is out of range[0,255]");

	var wait = Number(wait).toString(16);
	wait = (wait.length == 1) ? "0" + wait : wait;
	
	var hexString = "05" + wait;
	return hexString;
}

function randomLetterFade(wait)
{
	if (wait < 0 || wait > 255)
		throw new Error("wait is out of range[0,255]");

	var wait = Number(wait).toString(16);
	wait = (wait.length == 1) ? "0" + wait : wait;
	
	var hexString = "06" + wait;
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
		[r(),r(),r()], //L
		[r(),r(),r()], //A
		[r(),r(),r()] //B
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
			url : options.api_base + "/v1/devices/"+options['lab'+ '_device_id']+"/mode",
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