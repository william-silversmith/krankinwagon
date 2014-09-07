"use strict";

function Player (args) {
	args = args || {};

	var _this = this;
	_this.socket = args.socket;
	_this.world = args.world;

	_this.state = resetState();

	_this.socket.on('lifecycle', function (stage) {
		if (stage === 'start') {
			_this.world.startGame();
		}
		else if (stage === 'stop') {
			_this.world.endGame();
		}
	});

	_this.setControls = function (controls) {
		_this.state.controls = controls;

		var fmt = [];
		Utils.forEach(controls, function (id, label)) {
			fmt.push({
				id: id,
				label: label,
			});
		}

		_this.send('set-controls', fmt);
	};

	_this.send = function (evt, payload) {
		_this.socket.emit(evt, payload);
	};

	function resetState () {
		return {
			controls: {},
		};
	}
}

module.exports = Player;