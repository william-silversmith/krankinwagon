(function ($) {
	var socket = io.connect('http://localhost');

	socket.on('rawr', function (data) {
		console.log(data);
	});

})(jQuery);

