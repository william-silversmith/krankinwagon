"use strict";

var Utils = require('./utils.js');

var LAST_ID = 1;

function Player (args) {
	args = args || {};

	var _this = this;
	_this.socket = args.socket;
	_this.world = args.world;
	_this.id = LAST_ID; 
	LAST_ID++;

	_this.state = resetState();

	_this.socket.on('lifecycle', function (stage) {
		if (stage === 'start') {
			_this.world.startGame();
		}
		else if (stage === 'stop') {
			_this.world.endGame();
		}
	});

	_this.socket.on('player-action', function (args) {
		var control_id = args.id;
		var value = args.value;

		if (_this.world.state.outstanding[control_id]) {
			_this.world.setHealthIncr(_this.world.state.HEALTH_BONUS);

			var player = _this.world.state.outstanding[control_id];
			player.resetPlayerCommandState();
			player.issueRandomCommand();
		}
		else {
			_this.world.setHealthIncr(-1);
			_this.send('incorrect', 'omg');
		}
	});

	_this.resetPlayerCommandState = function () {
		var delete_control_id = null;
		Utils.forEach(_this.world.state.outstanding, function (ctrl_id, player) {
			if (player === _this) {
				delete_control_id = ctrl_id;
			}
		});

		if (delete_control_id) {
			delete _this.world.state.outstanding[delete_control_id];
		}

		if (_this.state.timer_id) {
			clearTimeout(_this.state.timer_id);
		}

		_this.state.timer_id = null;
	};

	_this.issueRandomCommand = function () {
		_this.resetPlayerCommandState();

		var controls = Utils.clone(_this.world.state.assigned_controls);
		Utils.forEach(_this.world.state.outstanding, function (ctrl_id, player) {
			delete controls[ctrl_id];
		});

		var random_command_id = Utils.random_choice(Object.keys(controls));
		_this.world.state.outstanding[random_command_id] = _this;

		var instruction = Utils.random_choice(controls[random_command_id].instructions);

		_this.send('command', {
			text: instruction,
			ttl: _this.world.state.COMMAND_TTL,
		});

		_this.state.timer_id = setTimeout(function () {
			_this.state.timer_id = null;
			_this.world.setHealthIncr(_this.world.state.HEALTH_TIMEOUT_PENALTY);
			_this.issueRandomCommand();
		}, _this.world.state.COMMAND_TTL);
	};

	_this.setControls = function (controls) {
		_this.state.controls = controls;

		var fmt = [];
		Utils.forEach(controls, function (id, label) {
			fmt.push({
				id: id,
				label: label,
			});
		});

		_this.send('set-controls', fmt);
	};

	_this.send = function (evt, payload) {
		_this.socket.emit(evt, payload);
	};

	function resetState () {
		return {
			controls: {},
			timer_id: null,
		};
	}
}

module.exports = Player;