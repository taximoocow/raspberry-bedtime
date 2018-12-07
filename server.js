var http = require('http');
var exec = require('child_process').exec;
var Hue = require('philips-hue');

var sonosOptions = {
	host: '10.11.25.74',
	port: 5005,
	path: '/preset/bedtime',
	method: 'GET'
}

var hueState = {
	"on": true,
	"bri": 114,
	"hue": 7170,
	"sat": 225,
	"xy": [ 0.5266, 0.4133 ],
	"ct": 500
};

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	if(req.url === "/bedtime") {
		// sonos
		var req = http.request(sonosOptions, function(sonosRes) { })
		req.end();

		// hue
		var hue = new Hue();
		hue
			.login('/home/pi/.philips-hue.json')
			.then(function(conf) {
				return Promise.all(
					[1, 2, 3, 4, 5].map(function(i){
						return hue.light(i).off();
					}),
					hue.light(6).setState(hueState)
					);
			})
			.then(function(res){
			    // console.log(res);
			})
			.catch(function(err){
			    // console.error(err.stack || err);
			});
	}

	res.end();
}).listen(8089);